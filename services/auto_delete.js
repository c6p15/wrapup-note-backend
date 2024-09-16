const { Op } = require('sequelize')
const { Note } = require('../models')

const autoDeleteNotes = async () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    try {
        // Find and log notes to be deleted
        const notesToDelete = await Note.findAll({
            where: {
                status: 'deleted',
                date_update: {
                    [Op.lt]: thirtyDaysAgo  
                }
            }
        })

        console.log('Notes to delete:', notesToDelete.map(note => note.title))

        const result = await Note.destroy({
            where: {
                status: 'deleted',
                date_update: {
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });

        console.log(`${result} deleted notes were removed.`)
    } catch (error) {
        console.error('Error deleting old notes:', error)
    }
};

module.exports = { autoDeleteNotes }
