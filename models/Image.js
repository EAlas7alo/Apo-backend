const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type: String,
  data: Buffer
})

module.exports = mongoose.model('Image', schema)