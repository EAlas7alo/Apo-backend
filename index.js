const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const queries = require('./typeDefs/queries')
const mutations = require('./typeDefs/mutations')
const reminderResolver = require('./resolvers/reminderResolver')
const entryResolver = require('./resolvers/entryResolver')
const folderResolver = require('./resolvers/folderResolver')
require('dotenv').config()
const reminderAgenda = require('./reminders/agenda')
const Folder = require('./models/Folder')
const JournalEntry = require('./models/JournalEntry')

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
  resolvers: [reminderResolver, entryResolver, folderResolver],
  formatError: (err) => {
    console.log(err)
  }
})

reminderAgenda()

mongoose.connection.collection('folders').count(async (err, count) => {
  if (count === 0) {
    console.log('Initializing main folder')
    const entries = await JournalEntry.find({})
    const mainFolder = new Folder({ 
      name: 'mainFolder', 
      isMainFolder: true, 
      entries: entries,
      itemOrder: entries.map(entry => entry._id)
    })
    await mainFolder.save()
  } else {
    console.log('Main folder found, aborting folder initialization')
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})