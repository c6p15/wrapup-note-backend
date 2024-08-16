
require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { User } = require('../models')

const Register = async (req, res) => {
    try{
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ where: { username }})
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.'})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: passwordHash
        })

        res.json({
            message: 'Registration complete!',
            user: newUser
        })
    }catch(error){
        res.status(500).json({
            message: 'Registration incomplete...',
            error: error.message
        })
    }
}

const Login = async (req, res) => {
    try{
        const { username, password } = req.body
        
        const user = await User.findOne({ where: { username }})
        if (!user){
            return res.status(400).json({ message: 'Login incomplete...(user not found)'})
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match){
            return res.status(400).json({ message: 'Login incomplete...(wrong password)'})
        }

        const token = jwt.sign({ UID: user.UID }, process.env.SECRET, { expiresIn: '1h'})
        res.cookie('token', token, {
            maxAge: 3600000,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        res.json({
            message: 'Login complete!',
            user: user.username
        })

    }catch(error){
        res.status(500).json({
            message: 'Login incomplete...',
            error: error.message
        })
    }
}

const getAlluser = async (req, res) => {
    try{
        const result = await User.findAll({
            attributes: ['UID','username','email']
        })

        res.json({
            message: 'Show users Successfully!!',
            user: result,
            
        })
    }catch(error){
        res.json({
            message: 'error',
            error: error.message
        })
    }
}

module.exports = {
    getAlluser,
    Register,
    Login

}