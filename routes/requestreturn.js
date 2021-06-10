const express=require('express');
const { requireadminLogin,requirestudentLogin } = require('../controllers/auth')
const {studentRequestReturn,cancelRequestReturn,seeDetailRequestReturn,showAllRequestReturn,adminAcceptRequest,showNonAccept,studentGetForm} = require('../controllers/requestreturn');
const router=express.Router()
router.post('/studentRequestReturn',requirestudentLogin,studentRequestReturn);
router.delete('/cancelRequestReturn/:_id',(requirestudentLogin || requireadminLogin),cancelRequestReturn);
router.get('/seeDetailRequestReturn/:_id',(requirestudentLogin || requireadminLogin),seeDetailRequestReturn);
router.get('/showAllRequestReturn',requireadminLogin,showAllRequestReturn);
router.get('/studentGetForm/:_id',requirestudentLogin,studentGetForm);
router.get('/showNonAccept',requireadminLogin,showNonAccept);
router.put('/adminAcceptRequest/:_id',requireadminLogin,adminAcceptRequest);
module.exports = router