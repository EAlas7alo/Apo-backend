const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
  },
  passwordHash: String,
})

module.exports = mongoose.model('User', userSchema)