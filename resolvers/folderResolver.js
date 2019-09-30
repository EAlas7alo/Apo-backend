const Folder = require('../models/Folder')
const JournalEntry = require('../models/JournalEntry')
const mongoose = require('mongoose')

module.exports = {
  Query: {
    mainFolder: async () => {
      const folder = await Folder.findOne({ isMainFolder: true })
        .populate('entries')
        .populate('folders')
      return folder
    },
    getFolder: async (parent, args) => {
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

      return folder
    },
    //TODO recursive deletion
    deleteFolder: async (_, args) => {
      const folder = await Folder.findById(args.id)
      await JournalEntry.deleteMany({ _id: { $exists: true, $in: folder.entries }})
      await Folder.findByIdAndDelete(args.id)

      return null
    },
    deleteManyFolders: async (_, args) => {
      if (args.idList.length === 0) return null
      const idArray = args.idList.map(id => mongoose.Types.ObjectId(id))
      const folders = await Folder.aggregate([
        { $match: { _id: { $in: idArray }}},
        { $graphLookup: {
          from: 'folders', 
          startWith: '$folders',
          connectFromField: 'folders',
          connectToField: '_id',
          as: 'children', 
        }
        }])
      const entriesToRemove = folders.reduce((acc, currV) => {
        const entries = acc.concat(currV.entries)
        return entries.concat(currV.children.map(folder => folder.entries))
      }, []).flat()
      const foldersToRemove = folders.reduce((acc, currV) => {
        const folders = acc.concat(currV._id)
        return folders.concat(currV.children.map(folder => folder._id))
      }, []).flat()
      await JournalEntry.deleteMany({ _id: { $exists: true, $in: entriesToRemove }})
      await Folder.deleteMany({ _id: { $exists: true, $in: foldersToRemove }})

      return null
    },
    addToFolder: async (_, args) => {
      await Folder.findByIdAndUpdate(args.id, { $push: { entries: args.content, itemOrder: args.content.id }})

      return null
    }
  }
}
