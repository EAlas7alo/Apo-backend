const JournalEntry = require('../models/JournalEntry')

module.exports = {
  Query: {
    allEntries: async () =>  {
      return await JournalEntry.find({})
    },
  },
  
  Mutation: {
    createEntry: async (root, args) => {
      const entry = new JournalEntry({ title: args.title, content: args.content, images: args.images })
      await entry.save()
      return entry
    },
    editEntry: async (root, args) => {
      const entry = await JournalEntry.findByIdAndUpdate(args.id, {title: args.title, content: args.content, images: args.images}, {new: true})

      return entry
    },
    deleteEntry: async (root, args) => {
      await JournalEntry.findByIdAndDelete(args.id)
      return true
    },
  }
}