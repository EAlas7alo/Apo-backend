const { gql } = require('apollo-server')


const mutations = gql`
type Token {
  value: String!
}

type Mutation {
  createEntry (
    title: String!
    content: String!
    images: [String!]!
    folder: ID!
  ): Entry

  editEntry (
    title: String
    content: String
    id: ID!
    images: [String]
  ): Entry

  uploadImage (
    file: Upload!
  ): Boolean!

  deleteEntry (
    id: ID!
    folder: ID!
  ) : ID

  deleteEntries (
    idList: [ID]!
    folder: ID!
  ) : Boolean

  createReminder (
    content: String!
    dateExpiry: Date!
  ) : Reminder

  toggleResolvedStatus (
    id: ID!
  ) : Boolean

  deleteReminder (
    id: ID!
  ) : Boolean

  addToFolder (
    id: ID!
    content: String!
  ) : Boolean
  
  createFolder (
    name: String!
    parentId: ID!
  ) : Folder

  deleteFolder (
    id: ID!
  ) : Boolean

  deleteManyFolders (
    idList: [ID]!
  ) : Boolean

  createUser (
    username: String!
    password: String!
  ) : User

  login (
    username: String!
    password: String!
  ) : Token
}
`

module.exports = mutations