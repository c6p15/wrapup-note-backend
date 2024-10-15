
const { Op } =  require('sequelize')
const { Note } = require('../models')
const { esClient } = require('../config/elasticsearch')

const getNote = async (req, res) => {
    try {
        const { UID } = req.user
        const { filter, label } = req.query

        let orderCondition = []

        if (filter === 'title') {
            orderCondition = [['title', 'ASC']]
        } else if (filter === 'date create') {
            orderCondition = [['date_create', 'DESC']]
        } else {
            orderCondition = [['date_update', 'DESC']]
        }

        let labelCondition = {}
        if (label) {
            const validLabels = ['study', 'health', 'finance', 'diary']
            if (validLabels.includes(label)) {
                labelCondition = { label: label }
            }
        }

        const { offset, limit, page } = req.pagination;

        const result = await Note.findAndCountAll({
            where: {
                UID: UID,
                status: {
                    [Op.ne]: 'deleted'
                },
                ...labelCondition
            },
            order: orderCondition,
            limit: limit, 
            offset: offset 
        });

        const totalPages = Math.ceil(result.count / limit)

        res.json({
            message: "Show notes successfully!!",
            notes: result.rows, 
            totalNotes: result.count, 
            currentPage: page,
            totalPages: totalPages
        })

    } catch (error) {
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
        const { NIDs } = req.body
        const { UID } = req.user

        const notes = await Note.findAll({
            where: {
                NID: {
                    [Op.in]: NIDs
                },
                UID: UID
            }
        })

        if (notes.length > 1) {
            const combinedContent = notes.map(note => `date: (${note.date_create}), content: (${note.content})`).join('\n')
            res.json({
                message: "Show notes successfully!!",
                combinedContent
            })
        } else if (notes.length === 1) {
            res.status(400).json({
                message: "Error: Only one note found, multiple notes are required"
            })
        } else {
            res.status(404).json({
                message: "Show notes unsuccessful, no notes found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Show notes unsuccessful",
            error: error.message
        })
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
    try {
        
        const { offset, limit, page } = req.pagination

        const result = await Note.findAndCountAll({
            where: { status: 'archive' },
            limit: limit,
            offset: offset
        })

        const totalPages = Math.ceil(result.count / limit)

        res.json({
            message: "Show archived notes successfully!!",
            notes: result.rows,
            totalNotes: result.count,
            currentPage: page,
            totalPages: totalPages
        })

    } catch (error) {
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
    try {
        const { offset, limit, page } = req.pagination

        const result = await Note.findAndCountAll({
            where: { status: 'deleted' },
            limit: limit,  
            offset: offset  
        })

        const totalPages = Math.ceil(result.count / limit)

        res.json({
            message: "Show deleted notes successfully!!",
            notes: result.rows,
            totalNotes: result.count,
            currentPage: page,
            totalPages: totalPages
        })

    } catch (error) {
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

const showDeletionCountdown = async (req, res) => {
    const today = new Date()
    const { UID } = req.user 

    try {
        const deletedNotes = await Note.findAll({
            where: {
                UID: UID,
                status: 'deleted'
            }
        })

        const countdownData = deletedNotes.map(note => {
            const dateUpdate = new Date(note.date_update)
            const daysSinceUpdate = Math.floor((today - dateUpdate) / (1000 * 60 * 60 * 24))
            const daysLeft = 30 - daysSinceUpdate  

            return {
                title: note.title,
                daysLeft: daysLeft > 0 ? daysLeft : 0  
            }
        })

        res.json({
            message: "Show Deletion Countdown successfully!",
            countdown: countdownData
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching deletion countdown",
            error: error.message
        })
    }
}

const indexNoteData = async (note) => {
    try {
      await esClient.index({
        index: 'notes',
        id: note.id,  // ใช้ NID ในฐานข้อมูล
        body: {
          title: note.title,
          content: note.content,
          UID: note.UID
        }
      });
      console.log('Note indexed successfully:', note.id);
    } catch (error) {
      console.error('Error indexing note:', error);
    }
  };
  
  // ฟังก์ชันสำหรับลบข้อมูลออกจาก Elasticsearch
  const deleteNoteFromIndex = async (NID) => {
    try {
      await esClient.delete({
        index: 'notes',
        id: NID,
      });
      console.log('Note deleted from index successfully:', NID);
    } catch (error) {
      console.error('Error deleting note from index:', error);
    }
  };

  // ฟังก์ชันสำหรับอัปเดตสถานะใน Elasticsearch
const updateNoteStatusInIndex = async (NID, status) => {
    try {
        // First, check if the document exists
        const exists = await esClient.exists({
            index: 'notes',
            id: NID
        });

        if (exists) {
            // If it exists, update it
            await esClient.update({
                index: 'notes',
                id: NID,
                body: {
                    doc: {
                        status: status,
                    }
                }
            });
            console.log(`Note ${NID} status updated in Elasticsearch to ${status}`);
        } else {
            // If it doesn't exist, index it
            const note = await Note.findByPk(NID);
            if (note) {
                await esClient.index({
                    index: 'notes',
                    id: NID,
                    body: {
                        title: note.title,
                        content: note.content,
                        status: status,
                        UID: note.UID,
                        // Add any other fields you want to index
                    }
                });
                console.log(`Note ${NID} indexed in Elasticsearch with status ${status}`);
            } else {
                console.log(`Note ${NID} not found in database, skipping Elasticsearch indexing`);
            }
        }
    } catch (error) {
        console.error(`Error updating/indexing note ${NID} in Elasticsearch:`, error);
    }
};


    const searchNote = async (req, res) => {
        try {
            const { query } = req.body;  // รับค่าค้นหาจาก request body

            // สร้าง query ที่จะค้นหาจาก title และ content
            const result = await esClient.search({
                index: 'notes',  // ชื่อ index ของ Elasticsearch
                body: {
                    query: {
                        multi_match: {
                            query: query,  // คำค้นหาที่รับมาจากผู้ใช้
                            fields: ['title', 'content'],  // ค้นหาใน field `title` และ `content`
                            fuzziness: "AUTO"  // ใช้ fuzziness เพื่อให้ค้นหาคำที่คล้ายคลึงกันได้
                        }
                    }
                }
            });

            // ตรวจสอบว่าพบผลลัพธ์หรือไม่
            const hits = result.hits.hits;
            if (hits.length > 0) {
                res.json({
                    message: "Search results found!",
                    notes: hits.map(hit => hit._source)  // ดึงข้อมูลของ note จาก _source
                });
            } else {
                res.status(404).json({
                    message: "No notes found for the provided search query."
                });
            }

        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({
                message: "Search notes unsuccessful",
                error: error.message,
                stack: error.stack
            });
        }
    };

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
    resetStatusNote,
    showDeletionCountdown,
    searchNote

}