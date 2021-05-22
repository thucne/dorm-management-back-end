const mongoose = require('mongoose');
const bill = mongoose.Schema({
    semester: {
        type: String,
        require: true,
    },
    duration: {
        type: Number,
        require: true
    },
    own: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    total: {
        type: Number,
        require: true
    },
    paymentstatus: {
        type: Boolean,
        require: true,
        default:false
    },
    content: {
        type: String,
        require: true
    }

});

module.exports = Bill = mongoose.model('bill', bill);