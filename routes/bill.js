const express=require('express');
const { requireadminLogin,requirestudentLogin } = require('../controllers/auth')
const {checkBill,seeBillOfStudent,seeBillDetail,createBill,showAllBillNonPaid} = require('../controllers/bill');
const router=express.Router()
router.put('/checkBill/:_id',requireadminLogin,checkBill);//update payment status=true
router.get('/seeBillOfStudent:/_id',(requireadminLogin||requirestudentLogin),seeBillOfStudent);//see list of bill of student by its _id
router.get('/seeBillDetail/:_id',seeBillDetail);//see detail of bill
router.post('/createBill',requireadminLogin,createBill);//admin create bill for student
router.get('/showAllBillNonPaid',requireadminLogin,showAllBillNonPaid);//admin get all non paid bill
module.exports = router