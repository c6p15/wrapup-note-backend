
const User = require('./user')
const Note = require('./note')
const Summary = require('./summary')

User.hasMany(Note, { foreignKey: 'UID' })
Note.belongsTo(User, { foreignKey: 'UID' })

User.hasMany(Summary, { foreignKey: 'UID' })
Summary.belongsTo(User, { foreignKey: 'UID' })

module.exports = {
    User,
    Note,
    Summary
}