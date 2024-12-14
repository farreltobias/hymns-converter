import { xml2js } from 'xml-js'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { XML } from './types/xml'

function execute(xml: string) {
  const { song } = xml2js(xml, { compact: true }) as XML

  const {
    verseOrder: { _text: verseOrder },
    titles: { title: titles },
  } = song.properties

  const [{ _text: title }] = Array.isArray(titles) ? titles : [titles]

  const [hymn, number, ...nameArray] = title.split(' ')

  const artist = `${hymn} ${number}`
  const name = nameArray.join(' ')

  const order = verseOrder.split(' ')

  const { verse } = song.lyrics
  const lyrics = Array.isArray(verse) ? verse : [verse]

  const verses = lyrics.reduce(
    (acc, lyric) => {
      const lines = Array.isArray(lyric.lines) ? lyric.lines : [lyric.lines]

      const [type, number] = lyric._attributes.name.split('')
      const header = type === 'v' ? 'Estrofe' : 'Refrão'
      const text = `##(${header} ${number})\n`

      const verse = lines
        .map((line) => {
          const text = Array.isArray(line._text) ? line._text : [line._text]
          return text.join('\n\n')
        })
        .join('\n')

      return { ...acc, [lyric._attributes.name]: `${text}${verse}\n` }
    },
    {} as Record<string, string>,
  )

  const music = order.map((type) => verses[type]).join('\n')

  // console.log({ name, artist, order, music })

  writeFileSync(
    path.join(__dirname, '../hymn_txt', `${name} (${artist}).txt`),
    music,
  )
}

const files = readdirSync(path.join(__dirname, '../hymn_xml'))

files.forEach((file) => {
  const xml = readFileSync(path.join(__dirname, '../hymn_xml', file), 'utf-8')
  execute(xml)
})

console.log('Done!')
