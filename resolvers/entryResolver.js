const JournalEntry = require('../models/JournalEntry')
const Folder = require('../models/Folder')
const { AuthenticationError, UserInputError } = require('apollo-server')

module.exports = {
  Query: {
    allEntries: async (root, args, context) =>  {
      return await JournalEntry.find({ user: context.currentUser})
    },
  },
  
  Mutation: {
    createEntry: async (root, args, context) => {
      const entry = new JournalEntry({ title: args.title, content: args.content, images: args.images })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      try {
        await entry.save()
        console.log(args)
        await Folder.findByIdAndUpdate(args.folder, { $push: { entries: entry._id, itemOrder: entry._id } })
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return entry
    },
    editEntry: async (root, args) => {
      const entry = await JournalEntry.findByIdAndUpdate(args.id, {title: args.title, content: args.content, images: args.images}, {new: true})

      return entry
    },
    deleteEntry: async (root, args) => {
      await JournalEntry.findByIdAndDelete(args.id)
      await Folder.findByIdAndUpdate(args.folder, { $pull: { entries: args.id, itemOrder: args.id }})
      return args.id
    },
    deleteEntries: async (root, args) => {
      if (args.idList.length === 0) return null
      const entries = args.idList
      await JournalEntry.deleteMany({ _id: { $in: entries }})
      await Folder.findByIdAndUpdate(args.folder, { $pull: { entries: { $in: entries }, itemOrder: { $in: entries } }})

      return null
    }
  }
}