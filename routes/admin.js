const express=require('express');
const { requireadminLogin } = require('../controllers/auth')
const {adminRegister,adminLogin,adminSeeStudent,adminSearchStudentByName,adminUpdateActiveStudent,getStudentList,getAdminAccount,editAccount,getAdminInfo,editInfo,createAdminAccount} = require('../controllers/admin');
const router=express.Router()
router.post('/register',adminRegister);//admin register
router.post('/createAdminAccount',requireadminLogin,createAdminAccount);//create admin account
router.post('/login/:remember',adminLogin);//admin login
router.post('/edit/account/:_id',requireadminLogin,editAccount);//admin edit account(re new password)
router.get('/getStudentList',requireadminLogin,getStudentList);//admin get student list
router.get('/get/info/:_id',requireadminLogin,getAdminInfo);//get admin info
router.get('/get/account',requireadminLogin,getAdminAccount);//admin get account
router.get('/seeStudent/:_id',requireadminLogin,adminSeeStudent);// admin see detail information of student given its id
router.get('/searchStudentByName/:name',requireadminLogin,adminSearchStudentByName);//admin search student by name pattern
router.put('/updateActiveStudent/:_id',requireadminLogin,adminUpdateActiveStudent);//update active or not of one student account
router.put('/edit/info/:_id',requireadminLogin,editInfo);//edit admin info
module.exports = router