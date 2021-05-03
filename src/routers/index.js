const express = require('express')
const verify = require('../middleware/verify')
const router = express.Router()

router.get('/', verify, (req, res) => {
    if (req.user) {
        res.render('welcome', {
            button: 'logout'
        })
    } else {
        res.render('welcome', {
            button: 'register'
        })
    }
    
})

router.get('/register', verify, (req, res) => {
    if (req.user) {
        res.render('dashboard', {
            button: "logout"
        })
    } else {
        res.render('register', {
            button: "login"
        })
    }
    
})

module.exports = router