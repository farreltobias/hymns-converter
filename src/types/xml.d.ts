import type { DeclarationAttributes } from 'xml-js'

export interface Declaration {
  _atributes: Required<Pick<DeclarationAttributes, 'version' | 'encoding'>>
}

interface Text {
  _text: string
}

interface Line {
  _text: string | string[]
  br?: Record<string, never>[]
}

interface Attributes {
  xmlns: string
  version: string
  createdIn: string
  modifiedIn: string
  modifiedDate: string
}

interface Songbook {
  _attributes: {
    name: string
    entry: string
  }
}

interface Properties {
  titles: {
    title: Text[] | Text
  }
  copyright?: Text
  verseOrder: Text
  authors: {
    author: Text[] | Text
  }
  songbooks: {
    songbook: Songbook
  }
}

interface Verse {
  _attributes: {
    name: string
  }
  lines: Line[] | Line
}

interface Lyrics {
  verse: Verse[] | Verse
}

interface Song {
  _attributes: Attributes
  properties: Properties
  lyrics: Lyrics
}

export interface XML {
  _declaration: Declaration
  song: Song
}
