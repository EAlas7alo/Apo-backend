const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
  },
  passwordHash: String,
})

module.exports = mongoose.model('User', userSchema)