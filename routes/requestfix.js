const express = require('express');
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const { showAllRequestFix, addRequestfix, cancelRequestFix, adminAcceptRequest, showNonAcceptRequest, seeDetail, studentCheckRequestFix } = require('../controllers/requestfix')

const router = express.Router()

router.get('/showAllRequestFix', requireadminLogin, showAllRequestFix);//show all request fix for admin dashboard
router.post('/addRequestfix', requirestudentLogin, addRequestfix);//student create request fix
router.delete('/cancelRequestFix/:_id', (requirestudentLogin||requireadminLogin),cancelRequestFix);//student or admin cancel request fix
router.put('/adminAcceptRequest/:_id', requireadminLogin, adminAcceptRequest);//admin update accpet status for request
router.get('/showNonAcceptRequest', requireadminLogin, showNonAcceptRequest);//show all request in queue
router.get('/seeDetail/:_id', (requireadminLogin||requirestudentLogin),seeDetail);//see detail of request fix
router.get('/studentCheckRequestFix', requirestudentLogin, studentCheckRequestFix);//student see list of request fix of his/her room

module.exports = router;