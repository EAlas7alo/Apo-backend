const { gql } = require('apollo-server')

const queries = gql`
scalar Date

type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Entry {
  title: String
  content: String
  images: [String]
  id: ID!
  date: Date
  folder: Folder
}

type Reminder {
  content: String
  dateExpiry: Date
  id: ID!
  resolved: Boolean!
}

type Folder {
  id: ID!
  entries: [Entry]
  folders: [Folder]
  name: String
  itemOrder: [String]
  isMainFolder: Boolean!
}

type User {
  username: String!
  passwordHash: String!
  id: ID!
}

type Query {
  allEntries: [Entry]
  allReminders: [Reminder]
  activeReminders: [Reminder]
  allFolders: [Folder]
  mainFolder: Folder
  getFolder(id: ID!): Folder
  me: User
}


`

module.exports = queries