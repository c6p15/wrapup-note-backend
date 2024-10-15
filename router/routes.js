
const express = require('express')
// controller
const { getAlluser,Register, Login, Logout, updateUser, getToken } = require('../controller/userController')
const { getNotebyID, getNote, combineNoteByIDs, postNote, editNote, archiveNote, deleteNote, getDeletedNote, resetStatusNote, getArchivedNote, pinNote, unpinNote, showDeletionCountdown} = require('../controller/noteController')
const { getSummary, deleteSummary, getSummarybySID } = require('../controller/summaryController')
const { summaryNotes } = require('../controller/geminiController')

// middleware
const auth = require('../middleware/auth')
const paginateResults = require('../middleware/pagination')


const router = express.Router()

// user's API
router.post('/api/register', Register)
router.post('/api/login', Login)
router.post('/api/logout', Logout)
router.put('/user/edit', auth, updateUser)
router.get('/users', auth, getAlluser)
router.get('/api/token', getToken)

// note's API
router.get('/note', auth, paginateResults, getNote)
router.post('/notes', auth, getNotebyID)
router.post('/combine-notes', auth, combineNoteByIDs)
router.post('/note', auth, postNote)
router.put('/note/:id', auth, editNote)
router.put('/note/archive/:id', auth, archiveNote)
router.get('/archive', auth, paginateResults, getArchivedNote)
router.put('/note/delete/:id', auth, deleteNote)
router.get('/trash', auth, paginateResults, getDeletedNote)
router.put('/note/pin/:id', auth, pinNote)
router.put('/note/unpin/:id', auth, unpinNote)
router.put('/note/default/:id', auth, resetStatusNote)
router.get('/trash/deletionCountdown', auth, showDeletionCountdown)


// summary's API
router.get('/summary', auth, paginateResults, getSummary)
router.delete('/summary/delete/:id', auth, deleteSummary)
router.get('/summary/:id', auth, getSummarybySID)

// gemini's API for summary
router.post('/summarize', auth, summaryNotes)

module.exports = router
