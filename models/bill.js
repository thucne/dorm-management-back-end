const mongoose = require("mongoose");
const billSchema = mongoose.Schema({
    receipt: { type: String, require: true },
    semester: {
        type: String,
        require: true
    },
    createOn:{
        type:Date,
        default:Date.now()
    },
    duration: {
        type: String,
        require: true
    },
    own: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    total: {
        type: Number,
        require: true
    },
    paymentstatus: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        require: true
    }

});

module.exports=Bill = mongoose.model("Bill", billSchema, 'Bill');