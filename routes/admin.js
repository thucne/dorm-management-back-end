const express=require('express');
const { requireadminLogin } = require('../controllers/auth')
const {adminRegister,adminLogin,adminSeeStudent,adminSeeRoomByBlock,adminSeeStudentByRoom,adminSearchStudentByName,adminUpdateActiveStudent} = require('../controllers/admin');
const router=express.Router()
router.post('/register',adminRegister);
router.post('/login',adminLogin);
router.post('/seeRoomByBlock',requireadminLogin,adminSeeRoomByBlock);
router.post('/seeStudent/:_id',requireadminLogin,adminSeeStudent);
router.post('/searchStudentByName/:name',requireadminLogin,adminSearchStudentByName);
router.post('/seeStudentByRoom',requireadminLogin,adminSeeStudentByRoom);
router.put('/updateActiveStudent/:_id',requireadminLogin,adminUpdateActiveStudent);
module.exports = router