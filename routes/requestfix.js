const express = require('express');
const { showAllRequestFix, addRequestfix, studentCancelRequestFix, adminAcceptRequest, showNonAcceptRequest, adminSeeDetail, studentCheckRequestFix } = require('../controllers/requestfix')

const router = express.Router()

router.get('/showAllRequestFix', showAllRequestFix);
router.post('/addRequestfix', addRequestfix);
router.delete('/studentCancelRequestFix', studentCancelRequestFix);
router.put('/adminAcceptRequest/:_id', adminAcceptRequest);
router.get('/showNonAcceptRequest', showNonAcceptRequest);
router.get('/adminSeeDetail/:_id', adminSeeDetail);
router.get('/studentCheckRequestFix', studentCheckRequestFix);

module.exports = router;