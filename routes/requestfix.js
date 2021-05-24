const express = require('express');
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const { showAllRequestFix, addRequestfix, studentCancelRequestFix, adminAcceptRequest, showNonAcceptRequest, adminSeeDetail, studentCheckRequestFix } = require('../controllers/requestfix')

const router = express.Router()

router.get('/showAllRequestFix', requireadminLogin, showAllRequestFix);
router.post('/addRequestfix', requirestudentLogin, addRequestfix);
router.delete('/studentCancelRequestFix', requirestudentLogin, studentCancelRequestFix);
router.put('/adminAcceptRequest/:_id', requireadminLogin, adminAcceptRequest);
router.get('/showNonAcceptRequest', requireadminLogin, showNonAcceptRequest);
router.get('/adminSeeDetail/:_id', requireadminLogin, adminSeeDetail);
router.get('/studentCheckRequestFix', requirestudentLogin, studentCheckRequestFix);

module.exports = router;