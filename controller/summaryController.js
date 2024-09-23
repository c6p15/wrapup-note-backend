
const { Op } = require('sequelize')
const { Summary } = require('../models')

const getSummary = async (req, res) => {
    try{
        const { UID } = req.user
        const { label } = req.query

        let labelCondition = {}
        if (label) {
            const validLabels = ['study', 'health', 'finance', 'diary']
            if (validLabels.includes(label)) {
                labelCondition = { label: label }
            }
        }

        const result = await Summary.findAll({
            where: {
                UID: UID,
                status: { 
                    [Op.ne]: 'deleted', 
                },
                ...labelCondition
            
            }
        })

        res.json({
            message: "Show summaries succesfully!!",
            summary: result
        })
    }catch(error){
        res.status(500).json({
            message: "Show summaries unsuccesful",
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

module.exports = {
    getSummary,
    deleteSummary
}