const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const queries = require('./typeDefs/queries')
const mutations = require('./typeDefs/mutations')
const reminderResolver = require('./resolvers/reminderResolver')
const entryResolver = require('./resolvers/entryResolver')
const folderResolver = require('./resolvers/folderResolver')
const userResolver = require('./resolvers/userResolver')
require('dotenv').config()
const User = require('./models/User')
const jwt = require('jsonwebtoken')


mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const server = new ApolloServer({ 
  typeDefs: [queries, mutations], 
  resolvers: [reminderResolver, entryResolver, folderResolver, userResolver],
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return null
  },
  formatError: (err) => {
    console.log(err)
    return err
  }
})

server.listen({ port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
}) 
