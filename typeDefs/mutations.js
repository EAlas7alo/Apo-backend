const { gql } = require('apollo-server')


const mutations = gql`
type Mutation {
  createEntry (
    title: String!
    content: String!
    images: [String!]!
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
  ) : Boolean

  deleteFolder (
    id: ID!
  ) : Boolean
}
`

module.exports = mutations