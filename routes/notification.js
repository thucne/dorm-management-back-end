const express=require('express');
const { requirestudentLogin,requireadminLogin } = require('../controllers/auth')
const {createNotification,studentGetAnnouncementAndEmail,adminGetAnnouncementAndEmail,seeDetailNotification,updateNotification,deleteNotification} = require('../controllers/notification');
const router=express.Router()
router.post('/create',requireadminLogin,createNotification);
router.get('/studentget',requirestudentLogin,studentGetAnnouncementAndEmail);
router.get('/adminget',requireadminLogin,adminGetAnnouncementAndEmail);
router.get('/seeDetail/:_id',seeDetailNotification);
router.put('/update/:_id',requireadminLogin,updateNotification);
router.delete('/delete/_id',requireadminLogin,deleteNotification);
module.exports = router