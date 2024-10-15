
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
        const { username, password, rememberMe } = req.body
        
        const rememberMeBoolean = Boolean(rememberMe)

        const user = await User.findOne({ where: { username }})
        if (!user){
            return res.status(400).json({ message: 'Login incomplete...(user not found)'})
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match){
            return res.status(400).json({ message: 'Login incomplete...(wrong password)'})
        }

        const tokenExpiry = rememberMeBoolean ? '30d' : '1d'

        const token = jwt.sign({ UID: user.UID }, process.env.SECRET, { expiresIn: tokenExpiry })
        res.cookie('token', token, {
            maxAge: rememberMeBoolean ? 2592000000 : 86400000 ,
            secure: false,
            httpOnly: true,
            sameSite: "none",
        })
        res.json({
            message: 'Login complete!',
            user: user.username,
            tokenExpiry: tokenExpiry,
        })

    }catch(error){
        res.status(500).json({
            message: 'Login incomplete...',
            error: error.message
        })
    }
}

const Logout = (req, res) => {
    try {
        res.cookie('token', '', { 
            maxAge: 0,  
            secure: false,
            httpOnly: true,
            sameSite: "none"
        });

        if (!req.cookies || !req.cookies.token) {
            return res.status(400).json({ message: 'No token found. Already logged out or not logged in.' });
        }
        res.status(200).json({ message: 'Logout complete!' })

    } catch (error) {
        res.status(500).json({ 
            message: 'Logout failed...', 
            error: error.message 
        })
        
    }
}

const updateUser = async (req, res) => {
    try {
        const { UID } = req.user 
        const { oldPassword, newPassword } = req.body

        const user = await User.findOne({ where: { UID } })
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            return res.status(400).json({ message: 'Old password is incorrect.' })
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)

        user.password = newPasswordHash
        await user.save()

        res.json({
            message: 'Password updated successfully!',
            user: user.username
        })
    } catch (error) {
        res.status(500).json({
            message: 'Password update failed...',
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

const getToken = async (req, res) => {
    
    const token = req.cookies.token;

    try {
        jwt.verify(token, process.env.SECRET);
        res.json({ hasToken: true });
    } catch (error) {
        res.json({ hasToken: false });
    }
};

module.exports = {
    getAlluser,
    Register,
    Login,
    Logout,
    updateUser,
    getToken
}