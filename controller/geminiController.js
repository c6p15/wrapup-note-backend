
const { Op } = require('sequelize');
const { Note } = require('../models');
const { Summary } = require('../models'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const prompt = "Your task is to summerize the note for the worldwide student who wants to order the note but not have time to do.\nCan you summerize everything clearly and understandable with the suggestion? \nWe need you to wrap things up from these notes.\nThe context has date, content that you need to summarize, tag that will be define in the context.\n\nwe want you to : \n- Respones to only html pattern to be working for putting in nodemailer's form (no additional messages before and after the answer)\n- Combine the note that have the same date to the same line\n- Summarize the content understandable, easy to read and related to the tag for less than 100 words\n- If there are duplicated tags but in the same date, summarize all content in the same section\n- Separate each tag and the content about tag.\n- If there's already has the content that has been summarize in the previous section, do not add them to other section.\n- The suggestion will be at the end of the summary.\n- Suggestion needs to be one line, The Suggestion has to be 5.\n- Order every section by date.\n- Using the note's languages.\nfor the pattern we want :\n\n<h1> Summarize note </h1>\n<p>(date1)</p>\n<ul> \n\t<li>(tag1) : (summary)</li>\n\t<li>(tag2) : (summary)</li>\n</ul>\n<p>(date2)</p>\n<ul> \n\t<li>(tag1) : (summary)</li>\n\t<li>(tag2) : (summary)</li>\n</ul>\n\n(add every tag and note in the context till ran out of tag)\n\n<h2>Suggestion</h2>\n    <li>(suggestion)</li>\n    <li>(suggestion)</li>\n"

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: prompt // Define your system prompt
});

const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const summaryNotes = async (req, res) => {
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
            const combinedContent = notes.map(note => `date: ${note.date_create} content: ${note.content}`).join('/n ');

            const chatSession = model.startChat({
                generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [
                            { text: `This is the combined note content: \n${combinedContent}` },
                        ],
                    },
                ],
            });

            const result = await chatSession.sendMessage("Generate AI response");
            const aiResponse = result.response.text()

            await Summary.create({
                content: aiResponse,
                date_create: new Date(),
                UID: UID
            });
            
            res.json({
                aiResponse,
                message: "Show notes successfully!!",
                
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
};

module.exports = { summaryNotes };
