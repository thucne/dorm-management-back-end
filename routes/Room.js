const express = require('express')
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const {createRoom, showAllRoom, deleteRoom, updateRoom,addStudentToRoom,seeRoomDetail,showAvailableRoom,removeStudentFromRoom } = require('../controllers/Room')
const router = express.Router()
router.post('/createRoom',requireadminLogin,createRoom);//create new room
router.get('/showAllRoom', requireadminLogin,showAllRoom);//show all room in dorm
router.get('/deleteRoom/:_id',requireadminLogin,deleteRoom);//deleteroom base its _id
router.get('/updateRoom/:_id', requireadminLogin,updateRoom);//update room info
router.get('/showAvailableRoom/:room_type',showAvailableRoom);//show all room can add more
router.put('/addStudentToRoom/:_id', requireadminLogin,addStudentToRoom);//add list of student to room
router.delete('/seeRoomDetail/:_id', requireadminLogin,seeRoomDetail);//see Room detail by its _id
router.put('/removeStudentFromRoom/:_id/:student', requireadminLogin,removeStudentFromRoom);//remove student from room
module.exports = router