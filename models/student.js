const mongoose = require('mongoose');

const student = mongoose.Schema({
    full_name: { type: String, require: true },
    identity_card: { type: Number, require: true },
    dob: { type: Date, require: true },
    gender: { type: String, require: true },
    academic_year: { type: Number, require: true },
    field_of_major: { type: String, require: true },
    folk: { type: String, require: true,default:'kinh' },
    email:{
        type:String,
        required: true 
    },
    password:{
        type:String,
        required: true 
    },
    photo: {
        type: String,
        default: "no image",
        minlength: 0,
        maxlength: 500
    },
    religion: {
        type: String,
        require: true,
        default:''
    },
    country: {
        type: String,
        require: true
    },
    insurance: {
        type:Object,
        default:{}

    },
    parentinfo: {
        type: Object,
        default: {}
    },
    residentinfo: {
        type: Object,
        default: {}
    },
    active: {
        type: Boolean,
        default: true
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        default:''
    },
    stayindorm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room'
    }],
});

module.exports = Student = mongoose.model('student', student);