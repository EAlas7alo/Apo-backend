const JournalEntry = require('../models/JournalEntry')

const resolvers = {
  Query: {
    allEntries: async () =>  {
      return await JournalEntry.find({})
    }
  },

  Mutation: {
    createEntry: async (root, args, context) => {
      const entry = new JournalEntry({ title: args.title, content: args.content, })
      await entry.save()
      return entry
    },
    editEntry: async (root, args, context) => {
      const entry = await JournalEntry.findByIdAndUpdate(args.id, {content: args.content}, {new: true})

      return entry
    },
    deleteEntry: async (root, args, context) => {
      await JournalEntry.findByIdAndDelete(args.id)
      return true
    },

    uploadImage: async (root, { file }, context) => {
      //const { stream, filename, mimetype, encoding } = await file
      console.log(file)
    },
  }
}

module.exports = resolvers