const cron = require('node-cron');
const autoDeleteNotes = require('../services/auto_delete');  // The function defined above

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running auto-delete for old notes...');
    autoDeleteNotes();
});
