const mongoose = require("mongoose");
const utilitySchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    createAt:{
        type:Date,default:Date.now()
    },
    recorddate: { type: Date, default:Date.now() },
    power: {type:Object,default:{},require:true},
    water: {type:Object,default:{},require:true},
    paymentstatus: {
        type: Boolean,
        default: false
    },
    note: { type: String, default: '' }

});

module.exports = UtilityBill = mongoose.model("UtilityBill", utilitySchema, 'UtilityBill');
