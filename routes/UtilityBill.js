const express = require('express')
const { addUtilitybill, getUtilityByRoom } = require('../controllers/UtilityBill')
const router = express.Router()

router.post('/addUtilityBill', addUtilitybill);
router.get('/getUtilityByRoom', getUtilityByRoom);

module.exports = router