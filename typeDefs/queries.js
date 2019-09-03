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
}

type Reminder {
  content: String
  dateExpiry: Date
  id: ID!
  resolved: Boolean!
}

type Query {
  allEntries: [Entry]
  allReminders: [Reminder]
  activeReminders: [Reminder]
}


`

module.exports = queries