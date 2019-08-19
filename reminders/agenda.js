const Agenda = require('agenda')
const Reminder = require('../models/Reminder')

const reminderAgenda = async () => {
  const agenda = new Agenda({db: {address: process.env.MONGODB_URI}})
  agenda.define('check reminders', (job, done) => {
    Reminder.find({
      dateExpiry: { $gte: new Date(0), $lte: new Date()},
      resolved: false 
    }).sort({ dateExpiry: 1 })
      .then(reminders => {
        console.log('active reminders:', reminders)
      })
    
    console.log('checking reminders')
    done()
  })
  
  const startAgendas = async () => {
    await agenda.start()
      .then(() => {
        console.log('agenda connected')
      })
      .catch((error) => {
        console.log('error connecting to agenda', error.message)
      })
  
    await agenda.every('5 seconds', 'check reminders')
    //await agenda.save()
  }
  
  startAgendas()
}

module.exports = reminderAgenda