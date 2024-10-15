const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    logging: false,
  }
);


const db = async () => {
    try {
        await sequelize.authenticate()
        console.log('Database connected successfully!')
    } catch (error) {
        console.error('Error connecting to the database:', error)
        throw error;
    }
}

module.exports = { sequelize, db }
