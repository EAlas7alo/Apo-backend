const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  folders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  }],
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JournalEntry'
  }],
  itemOrder: [{
    type: String,
    required: true,
  }],
  isMainFolder: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Folder', schema)