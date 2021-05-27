const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    folk: { type: String, require: true },
    photo: { type: String, default: "no image" },
    religion: {
        type: String,
        require: true
    },
    stayindorm: {
        type: Object,
        default: {}
    },
    email: { type: String, require: true },
    password: { type: String, require: true },
    full_name: { type: String, require: true },
    gender: { type: String, require: true },
    residentinfo: {
        type: Object,
        default: {}
    },
    parentinfo: {
        type: Object,
        default: {}
    },
    academic_year: { type: Number, require: true },
    dob: { type: String, require: true },
    identity_card: { type: Number, require: true },
    field_of_major: { type: String, require: true },
    insurance: {
        type: Object,
        default: {}
    },



});

module.exports = student = mongoose.model("students", studentSchema, 'students');