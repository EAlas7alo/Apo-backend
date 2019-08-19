const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const queries = require('./typeDefs/queries')
const mutations = require('./typeDefs/mutations')
const resolvers = require('./resolvers/mainResolver')
require('dotenv').config()
const reminderAgenda = require('./reminders/agenda')


mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const server = new ApolloServer({ 
  typeDefs: [queries, mutations], 
  resolvers,
  formatError: (err) => {
    console.log(err)
  }
})

reminderAgenda()

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})