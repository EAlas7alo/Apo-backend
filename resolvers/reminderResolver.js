const Reminder = require('../models/Reminder')
const { AuthenticationError } = require('apollo-server')

module.exports = {
  Query: {
    allReminders: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      return await Reminder.find({ user: context.currentUser._id })
    },
    activeReminders: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      return await Reminder.find({ 
        dateExpiry: { $gte: new Date(0),
          $lte: new Date() },
        resolved: false,
        user: context.currentUser._id,
      })
    }
  },
  Mutation: {
    createReminder: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const reminder = new Reminder({ 
        content: args.content, 
        dateAdded: new Date(), 
        dateExpiry: new Date(args.dateExpiry),
        resolved: false,
        user: context.currentUser._id,
      })
      await reminder.save()
      return reminder
    },
    toggleResolvedStatus: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const reminder = await Reminder.findById(args.id)
      if (!context.currentUser._id !== reminder.user) {
        throw new AuthenticationError('wrong user')
      }
      await reminder.update(({ resolved: !reminder.resolved}, { new: true }))

      return null
    },
    deleteReminder: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const reminder = await Reminder.findById(args.id)
      if (!context.currentUser._id !== reminder.user) {
        throw new AuthenticationError('wrong user')
      }
      await reminder.remove()

      return null
    },
  }
}
