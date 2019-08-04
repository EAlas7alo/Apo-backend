const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  images: [
    {
      type: String,
    }
  ]
})

module.exports = mongoose.model('JournalEntry', schema)