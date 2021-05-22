const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    full_name: { type: String, require: true },
    identity_card: { type: Number, require: true },
    dob: { type: String, require: true },
    gender: { type: String, require: true },
    academic_year: { type: Number, require: true },
    field_of_major: { type: String, require: true },
    folk: { type: String, require: true },
    religion: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    insurance: {
        type: Object,
        default: {}
    },
    parentinfo: {
        type: Object,
        default: {}
    },
    residentinfo: {
        type: Object,
        default: {}
    },
    stayindorm: {
        type: Object,
        default: {}
    }
});

const Student = mongoose.model("Student", studentSchema, 'Student');