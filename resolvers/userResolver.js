const User = require('../models/User')
const Folder = require('../models/Folder')
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
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(args.password, saltRounds)
        const user = new User({
          username: args.username,
          passwordHash,
        })
        const savedUser = await user.save()
        const folder = new Folder(
          { name: `mainfolder_${savedUser._id}`,
            entries: [],
            folders: [],
            isMainFolder: true,
            user: savedUser._id
          })
        await folder.save()
        return savedUser.username
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