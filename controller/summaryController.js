
const { Op } = require('sequelize')
const { Summary } = require('../models')

const getSummary = async (req, res) => {
    try {
        const { UID } = req.user
        const { label } = req.query

        let labelCondition = {}
        if (label) {
            const validLabels = ['study', 'health', 'finance', 'diary']
            if (validLabels.includes(label)) {
                labelCondition = { label: label }
            }
        }

        const { offset, limit, page } = req.pagination

        const result = await Summary.findAndCountAll({
            where: {
                UID: UID,
                status: {
                    [Op.ne]: 'deleted',
                },
                ...labelCondition
            },
            limit: limit,
            offset: offset
        })

        const totalPages = Math.ceil(result.count / limit)

        res.json({
            message: "Show summaries successfully!!",
            summaries: result.rows,
            totalSummaries: result.count,
            currentPage: page,
            totalPages: totalPages
        })
    } catch (error) {
        res.status(500).json({
            message: "Show summaries unsuccessful",
            error: error.message
        })
    }
}


const deleteSummary = async (req, res) => {
    try{
        
        const SID = req.params.id

        const result = await Summary.destroy({
            where: {SID : SID}
        })
        if (result === 1) {
            res.json({
                message: "Summary deleted successfully!!",
            })
        } else {
            res.json({
                message: "Summary not found",
            })
        }
    }catch(error){
        res.status(500).json({
            message: "Summary deleted unsuccessful",
            error: error.message
        })
    }
}

const getSummarybySID = async (req, res) => {
    try {
        const { id: SID } = req.params; // Use 'id' if that's the route parameter
        const { UID } = req.user;

        const result = await Summary.findOne({
            where: {
                SID: SID,
                UID: UID
            }
        });

        if (result) {
            res.json({
                message: "Show summary successfully!!",
                summary: result
            });
        } else {
            res.status(404).json({
                message: "No summary found for the provided SID.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Show summary unsuccessful",
            error: error.message
        });
    }
}

module.exports = {
    getSummary,
    deleteSummary,
    getSummarybySID
}