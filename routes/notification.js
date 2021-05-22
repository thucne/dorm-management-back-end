const express=require('express');
const { requirestudentLogin,requireadminLogin } = require('../controllers/auth')
const {createNotification,showAllNotification,seeDetailNotification,updateNotification,deleteNotification} = require('../controllers/notification');
const router=express.Router()
router.post('/create',requireadminLogin,createNotification);
router.get('/show',showAllNotification);
router.get('/seeDetail/:_id',seeDetailNotification);
router.put('/update/:_id',requireadminLogin,updateNotification);
router.delete('/delete/_id',requireadminLogin,deleteNotification);
module.exports = router