
const { Op } = require('sequelize')
const { Note } = require('../models')
const { Summary } = require('../models')
const { GoogleGenerativeAI } = require("@google/generative-ai")
require('dotenv').config()

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const study_prompt = process.env.STUDY_PROMPT
const health_prompt = process.env.HEALTH_PROMPT
const finance_prompt = process.env.FINANCE_PROMPT
const diary_prompt = process.env.DIARY_PROMPT

const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
}

const summaryNotes = async (req, res) => {
    try {
        const { NIDs, promptType } = req.body // Extract promptType from the request body
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
            
            const fixedPromptType = promptType.charAt(0).toUpperCase() + promptType.slice(1).toLowerCase()

            const prompt = 
                            fixedPromptType === 'Study' ? study_prompt : 
                            fixedPromptType === 'Health' ? health_prompt : 
                            fixedPromptType === 'Finance' ? finance_prompt : 
                            fixedPromptType === 'Diary' ? diary_prompt : ''

            if (!prompt) {
                return res.status(400).json({
                    message: "Error: Invalid prompt type"
                })
            }

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `${prompt}` // Use the selected prompt
            })

            const chatSession = model.startChat({
                generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [
                            { text: `${combinedContent}` },
                        ],
                    },
                ],
            })

            const result = await chatSession.sendMessage("Generate AI response")
            const aiResponse = result.response.text()

            const cleanResponse = aiResponse.replace(/\t+/g, "").replace(/\\t+/g, "").replace(/\n+/g, " ").trim()

            await Summary.create({
                content: cleanResponse,
                status: null,
                label:fixedPromptType,
                date_create: new Date(),
                UID: UID
            })

            res.json({
                promptType: fixedPromptType,
                cleanResponse,
                message: "Summarize successfully!!",
            })
        } else if (notes.length === 1) {
            res.status(400).json({
                message: "Error: Only one note found, multiple notes are required"
            })
        } else {
            res.status(404).json({
                message: "Summarize unsuccessful, no notes found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Summarize unsuccessful",
            error: error.message
        })
    }
}

module.exports = { summaryNotes }
