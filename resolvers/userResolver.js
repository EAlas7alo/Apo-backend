const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

module.exports = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      try {
        console.log('xd')
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(args.password, saltRounds)
        const user = new User({
          username: args.username,
          passwordHash,
        })
        const savedUser = await user.save()
        return savedUser
      } catch (error) {
        console.log(error)
        return error
      }
       
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
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)
      return { value: token }
    }
  },
}