const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Note = sequelize.define('Note', {
    NID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    label: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    pin: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('default', 'archive', 'deleted', 'schedule', 'summarized'),
        defaultValue: 'default',
    },
    date_create: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    date_update: {
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
    tableName: 'note',
    timestamps: false,
});

module.exports = Note
