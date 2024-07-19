
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Summary = sequelize.define('Summary', {
    SID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    date_create: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    UID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'user',
            key: 'UID',
        }
    }
}, {
    tableName: 'summary',
    timestamps: false,
});

module.exports = Summary
