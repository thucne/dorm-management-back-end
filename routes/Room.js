const express = require('express')
const { showResidentRoom, showRoomate, addRoom } = require('../controllers/Room')
const router = express.Router()
router.post('/addRoom', addRoom);
router.get('/resident', showResidentRoom);
router.get('/roomate', showRoomate);
module.exports = router