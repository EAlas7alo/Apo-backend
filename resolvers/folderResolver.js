const Folder = require('../models/Folder')

module.exports = {
  Query: {
    allFolders: async () => {
      return await Folder.find({})
    },
    mainFolder: async () => {
      return await Folder.find({ mainFolder: true})
    }
  }
}