const express=require('express');
const { requirestudentLogin } = require('../controllers/auth')
const {studentRegister,studentLogin,studentSeeRoommate,studentSeeStudent,studentSeeHistory,studentUpdate} = require('../controllers/student');
const router=express.Router()
router.post('/register',studentRegister);
router.post('/login',studentLogin);
router.post('/seeRoomate',requirestudentLogin,studentSeeRoommate);
router.post('/seeStudent/:_id',requirestudentLogin,studentSeeStudent);
router.post('/seeHistory',requirestudentLogin,studentSeeHistory);
router.put('/studentUpdate/:_id',requirestudentLogin,studentUpdate);
module.exports = router