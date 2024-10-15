// pagination.js

const paginateResults = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        req.pagination = {
            offset,
            limit,
            page
        }

        next();
    } catch (error) {
        next(error)
    }
}

module.exports = paginateResults
