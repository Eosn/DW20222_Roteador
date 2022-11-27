const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')

const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await new User(username, password).fetch_by_credentials()
        const token = jwt.sign({ "userId": user.id, username }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME })
        return res.status(StatusCodes.OK).json({ username, token })
    } catch (e) {
        return res.status(StatusCodes.FORBIDDEN).json({})
    }
}

const logout = (req, res) => {
    return res.status(StatusCodes.OK).json({ username: null, token: null })
}

module.exports = {
    login,
    logout,
}