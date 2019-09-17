const Reminder = require('../models/Reminder')

module.exports = {
  Query: {
    allReminders: async () => {
      return await Reminder.find({})
    },
    activeReminders: async () => {
      return await Reminder.find({ dateExpiry: { $gte: new Date(0), $lte: new Date() }, resolved: false})
    }
  },
  
  Mutation: {
    createReminder: async (root, args) => {
      const reminder = new Reminder({ 
        content: args.content, 
        dateAdded: new Date(), 
        dateExpiry: new Date(args.dateExpiry),
        resolved: false
      })
      await reminder.save()
      return reminder
    },
    toggleResolvedStatus: async (root, args) => {
      const reminder = await Reminder.findById(args.id)
      await Reminder.findByIdAndUpdate(args.id, { resolved: !reminder.resolved}, { new: true })

      return null
    },
    deleteReminder: async (root, args) => {
      await Reminder.findByIdAndDelete(args.id)

      return null
    },
  }
}
