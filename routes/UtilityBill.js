const express = require('express')
const { requireadminLogin, requirestudentLogin } = require('../controllers/auth')
const { addUtilitybill, getUtilityById, deletebill, updatePaymentBill, showNonPaidBill, DeleteUtilityWithDate, showNonPaidBillByDate } = require('../controllers/UtilityBill')
const router = express.Router()

router.post('/addUtilityBill', requireadminLogin, addUtilitybill);
router.get('/getUtilityById/:_id', getUtilityById);
router.delete('/adminDeleteBill/:_id', requireadminLogin, deletebill);
router.put('/updatePaymentBill/:_id', requireadminLogin, updatePaymentBill);
// router.post('/getUtilityByRoom', getUtilityByRoom);
router.get('/showNonPaidBill', requireadminLogin, showNonPaidBill);
router.delete('/deleteUtilityWithDate', requireadminLogin, DeleteUtilityWithDate);
router.get('/showNonPaidBillByDate', requireadminLogin, showNonPaidBillByDate);


module.exports = router