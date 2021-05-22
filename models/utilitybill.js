const mongoose = require("mongoose");
const utilitySchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    recorddate: { type: String, require: true },
    power: { type: Object, default: {} },
    water: { type: Object, default: {} },
    paymentstatus: { type: Boolean, require: true },
    note: { type: String, default: '' }

});

const UtilityBill = mongoose.model("Utility", utilitySchema, 'UtilityBill');