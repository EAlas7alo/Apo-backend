const JournalEntry = require('../models/JournalEntry')
const Reminder = require('../models/Reminder')

const resolvers = {
  Query: {
    allEntries: async () =>  {
      return await JournalEntry.find({})
    },
    allReminders: async () => {
      return await Reminder.find({})
    },
    activeReminders: async () => {
      return await Reminder.find({ dateExpiry: { $gte: new Date(0), $lte: new Date() }, resolved: false})
    }
  },

  Mutation: {
    createEntry: async (root, args) => {
      const entry = new JournalEntry({ title: args.title, content: args.content, images: args.images })
      await entry.save()
      return entry
    },
    editEntry: async (root, args) => {
      const entry = await JournalEntry.findByIdAndUpdate(args.id, {title: args.title, content: args.content, images: args.images}, {new: true})

      return entry
    },
    deleteEntry: async (root, args) => {
      await JournalEntry.findByIdAndDelete(args.id)
      return true
    },
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
    }
  /*
    uploadImage: async (root, { file }, context) => {
      const { createReadStream, filename, mimetype, encoding } = await file
      console.log(file)
      //console.log(createReadStream())
      const image = new Image({
        type: mimetype,
      })
      let imageData = ''
      try {
        const stream = createReadStream()
        const saveToFile = await new Promise((resolve, reject) => 
          stream
            //.pipe(fs.createWriteStream(imageData))
            .on('data', (chunk) => imageData += chunk)
            .on('error', error => reject(error))
            .on('finish', () => resolve())
        )
        
        console.log(saveToFile)
        image.data = imageData
      } catch (error) {
        console.log(error)
      }
      
      image.save()
      
      return true
    },*/
  }
}

module.exports = resolvers