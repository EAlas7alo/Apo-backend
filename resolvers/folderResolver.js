const Folder = require('../models/Folder')

module.exports = {
  Query: {
    allFolders: async () => {
      return await Folder.find({})
    },
    mainFolder: async () => {
      return await Folder.find({ mainFolder: true }).populate('content')
    }
  },
  Mutation: {
    createFolder: async (_, args) => {
      const folder = new Folder({ name: args.name, content: [] })
      await folder.save()

      return null
    },
    deleteFolder: async (_, args) => {
      await Folder.findByIdAndDelete(args.id)

      return null
    },
    addToFolder: async (_, args) => {
      await Folder.findByIdAndUpdate(args.id, { $push: { content: args.content }})

      return null
    }
  }
}