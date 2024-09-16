const cron = require('node-cron')
const autoDeleteNotes = require('../services/auto_delete')

cron.schedule('0 0 * * *', () => {
    console.log('Running auto-delete for old notes...')
    autoDeleteNotes()
})

