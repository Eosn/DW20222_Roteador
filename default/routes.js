const express = require("express")
const router = express.Router()
const { defaultroute } = require('./controller')

router.get('*', defaultroute)

module.exports = router