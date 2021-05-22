const Room = require('../models/room');
const Admin = require('../models/admin.js');
const Student = require('../models/student');

exports.addRoom = async(req, res) => {

    let room = new Room();



    room.dorm = req.body.dorm;
    room.block = req.body.block;
    room.room = req.body.room;
    room.room_type = req.body.room_type;
    room.dorm_ID = req.body.dorm_ID;
    room.floor = req.body.floor;
    room.note = req.body.note;
    var studentlist = req.body.studentlist;
    if (room.room_type == 2) {
        return studentlist.length <= 2;
    } else if (room.room_type == 4) {
        return studentlist.length <= 4;
    } else if (room.room_type == 6) {
        return studentlist.length <= 6;
    }
    studentlist.map((student, index) => {
        room.studentlist.push(student)
    });


    await room.save(function(err, data) {
        if (err) {
            console.log(err);
            return res.status(404).json({ error: err });
        } else {
            return res.status(201).json({
                msg: "Add Room successly"
            })

        }
    })

};
exports.showResidentRoom = async(req, res) => {
    let student = req.params.studentlist;
    Room.findOne({ student })
        .populate('studentlist', 'semester from to')


    .exec((err, room) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(room)
    })
};
exports.showRoomate = async(req, res) => {
    let student = req.params.studentlist;
    Room.find({ student })
        .populate('studentlist', 'full_name gender academic_year field_of_major')
        .exec((err, room) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
                res.json(room)
            }
        })
};
exports.returnRoom = async(req, res) => {
    let name = req.body.full_name;
    let id = req.body.identity_card;
    let gender = req.body.gender;
    let room = req.body.room;
    let date = req.body.date;
    let note = req.body.note;

}