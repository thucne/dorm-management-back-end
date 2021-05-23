const mongoose = require("mongoose");
const billSchema = mongoose.Schema({
    receipt: { type: Number, require: true },
    semester: {
        type: String,
        require: true,
        ref: 'Student'
    },
    duration: {
        type: String,
        require: true
    },
    own: {
        type: Object,
        default: {},
        ref: 'Student'
    },
    cashier: {
        type: Object,
        default: {},
        ref: 'cashier'
    },
    total: {
        type: Number,
        require: true
    },
    paymentstatus: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }

});

module.exports = Bill = mongoose.model("Bill", billSchema, 'Bill');