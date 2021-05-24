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
    student: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Student'
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
        type: String
    }


});

module.exports = Requestfix = mongoose.model('Requestfix', requestfix, 'Requestfix');