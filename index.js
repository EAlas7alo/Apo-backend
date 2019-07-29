const { ApolloServer, gql } = require('apollo-server');

let entries = [
  {
    title: 'Read Three-Body Problem',
    content: 'Three-Body Problem by Cixin Liu',
    id: 1,
    date: new Date('2019, 7, 20, 13, 20, 20, 0'),
  },
  {
    title: 'Sold Qt for 200 euros',
    content: 'Qt stock sold for 200',
    id: 2,
    date: new Date('2019, 7, 21, 14, 35, 1, 0'),
  },
  {
    title: 'React Native best Practices',
    content: 'https://medium.com/react-native-training/best-practices-for-creating-react-native-apps-part-1-66311c746df3',
    id: 3,
    date: new Date('2019, 7, 24, 11, 55, 54, 0'),
  },
]

const typeDefs = gql`
  scalar Date

  type Entry {
    title: String
    content: String
    id: ID!
    date: Date
  }

  type Query {
    allEntries: [Entry]
  }

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

    deleteEntry (
      id: ID!
    ) : Boolean
  }
`

const resolvers = {
  Query: {
    allEntries: () => entries,
  },

  Mutation: {
    createEntry: async (root, args, context) => {
      const entry = {title: args.title, content: args.content, id: args.id, date: args.date}
      entries.push(entry)
      return entry
    },
    editEntry: async (root, args, context) => {
      let entry = entries.find(entry => entry.id === args.id)
      
      entry.content = args.content
      return entry
    },
    deleteEntry: async (root, args, context) => {
      entries = entries.filter(entry => entry.id !== parseInt(args.id))
      console.log(entries, args.id)
      return true
    }
  }
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});