const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  folders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  },
  entries: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JournalEntry'
  },
  isMainFolder: {
    type: Boolean
  }
})

module.exports = mongoose.model('Folder', schema)