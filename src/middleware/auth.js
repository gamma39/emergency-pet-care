
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        res.locals.currentUser = req.user
        next()

    } catch (e) {
        req.session.error = 'Please authenticate'
        res.status(401).redirect("/")

    } 
}

module.exports = auth