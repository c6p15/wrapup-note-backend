
require('dotenv').config()

const express = require('express')
const router = require('../router/routes')
const { db } = require('../config/db')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/', router)

const PORT = process.env.PORT || 8888

const startServer = async () => {
    try {
        await db();  // Await the db function to ensure the connection is established
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit process with failure
    }
};

startServer();