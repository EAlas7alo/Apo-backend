const Folder = require('../models/Folder')

module.exports = {
  Query: {
    allFolders: async () => {
      return await Folder.find({})
    },
    mainFolder: async () => {
      const folder = await Folder.findOne({ isMainFolder: true })
        .populate('entries')
        .populate('folders')
      console.log(folder)
      return folder
    }
  },
  Mutation: {
    createFolder: async (_, args) => {
      // Main folder, which doesn't have a parentId, is created in index.js
      const folder = new Folder({ name: args.name, entries: [], folders: [] })
      await folder.save()
      await Folder.findByIdAndUpdate(args.parentId, { $push: { folders: folder }})

      return null
    },
    //TODO recursive deletion
    deleteFolder: async (_, args) => {
      await Folder.findByIdAndDelete(args.id)

      return null
    },
    addToFolder: async (_, args) => {
      await Folder.findByIdAndUpdate(args.id, { $push: { entries: args.content, itemOrder: args.content.id }})

      return null
    }
  }
}