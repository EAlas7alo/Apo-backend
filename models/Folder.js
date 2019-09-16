const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  content: {
    type: String
  },
  isMainFolder: {
    type: Boolean
  }
})

module.exports = mongoose.model('Folder', schema)