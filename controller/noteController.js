
const { Op } =  require('sequelize');
const { Note } = require('../models')

const getNote = async (req, res) => {
    try{
        const { UID } = req.user

        const result = await Note.findAll({
            where: {
                UID: UID,
                status: {
                    [Op.ne]: 'deleted'
                }
            }
        })
        
        res.json({
            message: "Show notes successfully!!",
            note: result
        })

    }catch(error){
        res.status(500).json({
            message: "Show notes unsuccessful",
            error: error.message
        })
    }
}

const getNotebyID = async (req, res) => {
    try{
        const { NIDs } = req.body
        const { UID } = req.user
    
        const result = await Note.findAll({
            where:{
                NID : {
                    [Op.in]: NIDs
                },
                UID : UID
            }
        })

        if (result.length > 0) {

            const message = result.length === 1 ? "Show note successfully!!" : "Show notes successfully!!"
            res.json({
                message: message,
                note: result
            })
        } else {
            res.status(404).json({
                message: "No notes found for the provided IDs.",
            });
        }

    }catch(error){
        res.status(500).json({
            message: "Show notes unsuccessful",
            error: error.message
        })
    }
}

const combineNoteByIDs = async (req, res) => {
    try {
        const { NIDs } = req.body; // Assuming NIDs are provided in the request body
        const { UID } = req.user;

        const notes = await Note.findAll({
            where: {
                NID: {
                    [Op.in]: NIDs
                },
                UID: UID
            }
        });

        if (notes.length > 1) {
            const combinedContent = notes.map(note => `date: ${note.date_create} label: ${note.label} content: ${note.content}`).join('/n ');
            res.json({
                message: "Show notes successfully!!",
                combinedContent
            });
        } else if (notes.length === 1) {
            res.status(400).json({
                message: "Error: Only one note found, multiple notes are required"
            });
        } else {
            res.status(404).json({
                message: "Show notes unsuccessful, no notes found"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Show notes unsuccessful",
            error: error.message
        });
    }
}


const postNote = async (req, res) => {
    try{
        const { title, content, label } = req.body
        const { UID } = req.user

        const newNote = await Note.create({
            title,
            content,
            label,
            date_create: new Date(),
            date_update: new Date(),
            UID: UID

        })

        res.json({
            message: "Create note successfully!!",
            note: newNote
        })

    }catch(error){
        res.status(500).json({
            message: "Create note unsuccessful",
            error: error.message
        })
    }
}

const editNote = async (req, res) => {
    try{
        const NID = req.params.id

        const { title, content, label } = req.body

        const result = await Note.update(
            {
                title,
                content,
                label,
                date_update: new Date()
            },
            {where : {NID: NID}}
        )
        
        if (result[0] === 1) {
            res.json({
                message: "Note updated successfully!!",
                
            });
        } else {
            res.json({
                message: "Note not found or no changes made",
            });
        }

    }catch(error){
        res.status(500).json({
            message: "Note updated unsuccessful",
            error: error.message
        })
    }
}

const archiveNote = async (req, res) => {
    try{
        const NID = req.params.id
        const note = await Note.findByPk(NID)

        if(!note){
            return res.status(404).json({ message: "Note not found"})
        }

        note.status = 'archive'
        await note.save()

        res.json({
            message: "Note archived succesfully!!",
            note: note
        })
    }catch(error){
        res.status(500).json({
            message: "Note archived unsuccesful",
            error: error.message
        })
    }
}

const getArchivedNote = async (req, res) => {
    try{
        const result = await Note.findAll({
            where: {status: 'archive'}
        })
        
        res.json({
            message: "Show archived notes successfully!!",
            note: result
        })

    }catch(error){
        res.status(500).json({
            message: "Show archived notes unsuccessful",
            error: error.message
        })
    }
}


const deleteNote = async (req, res) => {
    try{
        const NID = req.params.id
        const note = await Note.findByPk(NID)

        if(!note){
            return res.status(404).json({ message: "Note not found"})
        }

        note.status = 'deleted'
        await note.save()

        res.json({
            message: "Note deleted succesfully!!",
            note: note
        })

    }catch(error){
        res.status(500).json({
            message: "Note delete unsuccesful",
            error: error.message
        })
    }
}

const getDeletedNote = async (req, res) => {
    try{
        const result = await Note.findAll({
            where: {status: 'deleted'}
        })
        
        res.json({
            message: "Show deleted notes successfully!!",
            note: result
        })

    }catch(error){
        res.status(500).json({
            message: "Show deleted notes unsuccessful",
            error: error.message
        })
    }
}

const pinNote = async (req, res) => {
    try{
        const NID = req.params.id
        const note = await Note.findByPk(NID)

        if(!note){
            return res.status(404).json({ message: "Note not found"})
        }

        note.pin = 1
        await note.save()

        res.json({
            message: "Note pinned succesfully!!",
            note: note
        })

    }catch(error){
        res.status(500).json({
            message: "Note pin unsuccesful",
            error: error.message
        })
    }
}

const unpinNote = async (req, res) => {
    try{
        const NID = req.params.id
        const note = await Note.findByPk(NID)

        if(!note){
            return res.status(404).json({ message: "Note not found"})
        }

        note.pin = 0
        await note.save()

        res.json({
            message: "Note unpinned succesfully!!",
            note: note
        })

    }catch(error){
        res.status(500).json({
            message: "Note unpin unsuccesful",
            error: error.message
        })
    }
}


const resetStatusNote = async (req, res) => {
    try{
        const NID = req.params.id
        const note = await Note.findByPk(NID)

        if(!note){
            return res.status(404).json({ message: "Note not found"})
        }

        note.status = 'default'
        await note.save()

        res.json({
            message: "Note default succesfully!!",
            note: note
        })

    }catch(error){
        res.status(500).json({
            message: "Note default unsuccesful",
            error: error.message
        })
    }
}

module.exports = {
    getNote,
    getNotebyID,
    combineNoteByIDs,
    postNote,
    editNote,
    archiveNote,
    getArchivedNote,
    deleteNote,
    getDeletedNote,
    pinNote,
    unpinNote,
    resetStatusNote

}