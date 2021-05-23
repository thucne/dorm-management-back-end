const express = require('express')
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const { showResidentRoom, addRoom, showAllRoom, deleteRoom, updateRoom } = require('../controllers/Room')
const router = express.Router()
router.post('/addRoom', requireadminLogin, addRoom);
router.get('/resident/:_id', showResidentRoom);
router.get('/showAllRoom', requireadminLogin, showAllRoom);
router.put('/updateRoom/:_id', requireadminLogin, updateRoom);
router.delete('/deleteRoom/:_id', requireadminLogin, deleteRoom);
module.exports = router