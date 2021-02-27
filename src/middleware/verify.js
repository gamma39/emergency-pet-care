//Middleware that checks if user exists without needing to authorize. 
//This allows for setting res.locals for use in ejs template for homepage

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verify = async (req, res, next) => {
        const token = req.cookies['auth_token'] || null

        if(token !== null) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            req.user = user
            res.locals.currentUser = req.user
        } else {
            res.locals.currentUser = null
        }
        next() 
}

module.exports = verify