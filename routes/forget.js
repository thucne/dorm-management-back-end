const express = require('express');
const { forgetPassword,checkCode,updatePassword } = require('../controllers/forget')

const router = express.Router()
router.post('/password',forgetPassword);
router.post('/checkCode',checkCode);
router.put('/updatePassword',updatePassword);

module.exports = router