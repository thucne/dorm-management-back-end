const express = require('express')
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const { addUtilitybill, getUtilityById, deletebill, updatePaymentBill, showNonPaidBill } = require('../controllers/UtilityBill')
const router = express.Router()

router.post('/addUtilityBill', requireadminLogin, addUtilitybill);
router.get('/getUtilityById/:_id', getUtilityById);
router.delete('/deletebill/:_id', requireadminLogin, deletebill);
router.put('/updatePaymentBill/:_id', requireadminLogin, updatePaymentBill);
// router.post('/getUtilityByRoom', getUtilityByRoom);
router.get('/showNonPaidBill', showNonPaidBill);
module.exports = router