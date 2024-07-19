
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define('User' , {
    UID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'user',
    timestamps: false,
}) 

module.exports = User