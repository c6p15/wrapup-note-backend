
const express = require('express')
// controller
const { getAlluser,Register, Login } = require('../controller/userController')
const { getNotebyID, getNote, combineNoteByIDs, postNote, editNote, archiveNote, deleteNote, getDeletedNote, resetStatusNote, getArchivedNote, pinNote, unpinNote, showDeletionCountdown} = require('../controller/noteController')


// middleware
const auth = require('../middleware/auth')
const { getSummary, deleteSummary } = require('../controller/summaryController')
const { summaryNotes } = require('../controller/geminiController')
const { autoDeleteNotes } = require('../services/auto_delete')

const router = express.Router()

// user's API
router.post('/api/register', Register)
router.post('/api/login', Login)
router.get('/users', auth, getAlluser)

// note's API
router.get('/note', auth, getNote)
router.post('/notes', auth, getNotebyID)
router.post('/combine-notes', auth, combineNoteByIDs)
router.post('/note', auth, postNote)
router.put('/note/:id', auth, editNote)
router.put('/note/archive/:id', auth, archiveNote)
router.get('/archive', auth, getArchivedNote)
router.put('/note/delete/:id', auth, deleteNote)
router.get('/trash', auth, getDeletedNote)
router.put('/note/pin/:id', auth, pinNote)
router.put('/note/unpin/:id', auth, unpinNote)
router.put('/note/default/:id', auth, resetStatusNote)
router.get('/trash/deletionCountdown', auth, showDeletionCountdown)

// summary's API
router.get('/summary', auth, getSummary)
router.delete('/summary/delete/:id', auth, deleteSummary)

// gemini's API for summary
router.post('/summarize', auth, summaryNotes)

module.exports = router
