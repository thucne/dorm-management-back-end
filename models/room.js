import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    dorm: { type: String, require: true },
    block: { type: String, require: true },
    floor: { type: Number, require: true },
    room: { type: String, require: true },
    room_type: { type: String, require: true },
    dorm_ID: { type: String, require: true },
    studentlist: {
        type: Array,
        ref: 'Student',
        default: []
    },
    note: {
        type: String,
        default: ''
    }

});

const Room = mongoose.model("Room", roomSchema, 'Room');
export default Room;