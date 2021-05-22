const express=require('express');
const { requireadminLogin,requirestudentLogin } = require('../controllers/auth')
const {studentRequestReturn,studentCancelRequestReturn,studentCheckRequestReturn,showAllRequestReturn,adminAcceptRequest,showNonAccept,adminSeeDetail} = require('../controllers/requestreturn');
const router=express.Router()
router.post('/studentRequestReturn',requirestudentLogin,studentRequestReturn);
router.post('/studentCheckRequestReturn',requirestudentLogin,studentCheckRequestReturn);
router.delete('/studentCancelRequestReturn',requirestudentLogin,studentCancelRequestReturn);
router.get('/showAllRequestReturn',requireadminLogin,showAllRequestReturn);
router.get('/showNonAccept',requireadminLogin,showNonAccept);
router.put('/adminAcceptRequest/:_id',requireadminLogin,adminAcceptRequest);
router.get('/adminSeeDetail/:_id',requireadminLogin,adminSeeDetail);
module.exports = router