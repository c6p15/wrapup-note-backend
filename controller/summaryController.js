
const { Summary } = require('../models')

const getSummary = async (req, res) => {
    try{
        const { UID } = req.user
        const result = await Summary.findAll({
            where: {UID:UID}
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