const express = require('express')
const router = express.Router()

router.use('/api/customer', require('./customer-routes'))
router.use('/api/orders', require('./order-routes'))

module.exports = router