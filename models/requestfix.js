const mongoose = require('mongoose');
const requestfix = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    sendDate: {
        type: Date,
        default: Date.now()
    },
    accept: {
        type: Boolean,
        default: false
    },
    fixnote: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default:''
    }


});

module.exports = Requestfix = mongoose.model('Requestfix', requestfix, 'Requestfix');