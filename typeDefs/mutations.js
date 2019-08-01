const { gql } = require('apollo-server')


const mutations = gql`
type Mutation {
  createEntry (
    title: String!
    content: String!
  ): Entry

  editEntry (
    content: String!
    id: ID!
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