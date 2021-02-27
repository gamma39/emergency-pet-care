const express = require('express')
const verify = require('../middleware/verify')
const router = express.Router()

router.get('/', verify, (req, res) => {
    res.render('welcome')
})

module.exports = router