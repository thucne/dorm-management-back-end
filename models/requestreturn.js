const mongoose = require('mongoose');
const requestreturn = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
    sendDate: { type: Date ,default:Date.now()},
    student:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'student'
    },
    accept:{
        type:Boolean,
        default:false
    },
    reason:{type:String,require:true,default:''},


});

module.exports = Requestreturn = mongoose.model('requestreturn', requestreturn);