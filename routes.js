const express = require("express")
const router = express.Router()
const { quote, defaultroute } = require('./controller')

router.get('/', quote)

router.get('*', defaultroute)

module.exports = router