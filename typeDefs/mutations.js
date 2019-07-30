const { gql } = require('apollo-server')


const mutations = gql`
type Mutation {
  createEntry (
    title: String!
    content: String!
    date: Date!
    id: ID
  ): Entry

  editEntry (
    content: String!
    id: ID!
  ): Entry

  uploadImage (
    file: Upload!
  ): File!

  deleteEntry (
    id: ID!
  ) : Boolean
}
`

module.exports = mutations