const mongoose = require("mongoose");
const utilitySchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    recorddate: { type: String, require: true },
    power: [{
        lastrecord: { type: Number, require: true },
        recentrecord: { type: Number, require: true }
    }],
    water: [{
        lastrecord: { type: Number, require: true },
        recentrecord: { type: Number, require: true },

    }],
    paymentstatus: {
        type: Boolean,
        require: true,
        default: false
    },
    note: { type: String, default: '' }

});

module.exports = UtilityBill = mongoose.model("UtilityBill", utilitySchema, 'UtilityBill');