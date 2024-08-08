
const express = require('express')
// controller
const { getAlluser,Register, Login } = require('../controller/userController')
const { getNotebyID, getNote, postNote, editNote, archiveNote, deleteNote, getDeletedNote, resetStatusNote, combineNoteByIDs} = require('../controller/noteController')


// middleware
const auth = require('../middleware/auth')
const { getSummary, deleteSummary } = require('../controller/summaryController')
const { summaryNotes } = require('../controller/geminiController')

const router = express.Router()

// user's API
router.post('/api/register', Register)
router.post('/api/login', Login)
router.get('/users', auth, getAlluser)

// note's API
router.get('/note', auth, getNote)
router.post('/notes', auth, getNotebyID)
router.post('/selected-notes', auth, combineNoteByIDs)
router.post('/note', auth, postNote)
router.put('/note/:id', auth, editNote)
router.put('/note/archive/:id', auth, archiveNote)
router.put('/note/delete/:id', auth, deleteNote)
router.get('/trash', auth, getDeletedNote)
router.put('/note/default/:id', auth, resetStatusNote)

// summary's API
router.get('/summary', auth, getSummary)
router.delete('/summary/delete/:id', auth, deleteSummary)
// gemini's API for summary
router.post('/summarize', auth, summaryNotes)

module.exports = router
