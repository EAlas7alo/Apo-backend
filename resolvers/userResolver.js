const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  Mutation: {
    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({
        username: args.username,
        passwordHash,
      })
      const savedUser = await user.save()
      return savedUser
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username = user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)
      return token
    }
  },
}