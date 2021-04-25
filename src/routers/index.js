const express = require('express')
const verify = require('../middleware/verify')
const router = express.Router()

router.get('/', verify, (req, res) => {
    res.render('welcome')
})

router.get('/register', verify, (req, res) => {
    res.render('register')
})

module.exports = router