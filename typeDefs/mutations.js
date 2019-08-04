const { gql } = require('apollo-server')


const mutations = gql`
type Mutation {
  createEntry (
    title: String!
    content: String!
    images: [String!]!
  ): Entry

  editEntry (
    title: String!
    content: String!
    id: ID!
    images: [String!]!
  ): Entry

  uploadImage (
    file: Upload!
  ): Boolean!

  deleteEntry (
    id: ID!
  ) : Boolean
}
`

module.exports = mutations