const JournalEntry = require('../models/JournalEntry')
const Image = require('../models/Image')
const fs = require('fs')

const resolvers = {
  Query: {
    allEntries: async () =>  {
      return await JournalEntry.find({})
    }
  },

  Mutation: {
    createEntry: async (root, args, context) => {
      const entry = new JournalEntry({ title: args.title, content: args.content, })
      await entry.save()
      return entry
    },
    editEntry: async (root, args, context) => {
      const entry = await JournalEntry.findByIdAndUpdate(args.id, {content: args.content}, {new: true})

      return entry
    },
    deleteEntry: async (root, args, context) => {
      await JournalEntry.findByIdAndDelete(args.id)
      return true
    },

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
    },
  }
}

module.exports = resolvers