const Folder = require('../models/Folder')
const JournalEntry = require('../models/JournalEntry')

module.exports = {
  Query: {
    mainFolder: async () => {
      const folder = await Folder.findOne({ isMainFolder: true })
        .populate('entries')
        .populate('folders')
      return folder
    },
    getFolder: async (parent, args, context, info) => {
      const folder = await Folder.findById(args.id)
        .populate('entries')
        .populate('folders')
      return folder
    }
  },
  Mutation: {
    createFolder: async (_, args) => {
      // Main folder, which doesn't have a parentId, is created in index.js
      const folder = new Folder({ name: args.name, entries: [], folders: [], isMainFolder: false })
      await folder.save()
      await Folder.findByIdAndUpdate(args.parentId, { $push: { folders: folder }})

      return null
    },
    //TODO recursive deletion
    deleteFolder: async (_, args) => {
      const folder = await Folder.findById(args.id)
      await JournalEntry.deleteMany({ _id: { $exists: true, $in: folder.entries }})
      if (folder.folders.length > 0) {
        let entriesToDelete = []
        let foldersToDelete = []
      }
      await Folder.findByIdAndDelete(args.id)

      return null
    },
    addToFolder: async (_, args) => {
      await Folder.findByIdAndUpdate(args.id, { $push: { entries: args.content, itemOrder: args.content.id }})

      return null
    }
  }
}

const deleteFolderContentRecursively = (folder, entriesArray, foldersArray) => {
  if (folder.folders.length > 0) {
    return true
  }
  folder.entries.forEach(element => {
    entriesArray.push(element.id)
  })
  folder.folders.forEach(element => {
    foldersArray.push(element.id)
  })
  folder.folders.forEach(element => {
    deleteFolderContentRecursively(element, entriesArray, foldersArray)
  })
}