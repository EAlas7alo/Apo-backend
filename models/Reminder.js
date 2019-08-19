const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  content: {
    type: String,
  },
  dateAdded: {
    type: Date,
  },
  dateExpiry: {
    type: Date,
  },
  resolved: {
    type: Boolean,
  }
})

module.exports = mongoose.model('Reminder', schema)