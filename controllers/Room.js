const Room = require('../models/room.js');
const Admin = require('../models/admin.js');
const Student = require('../models/student.js');
exports.createRoom = async (req, res) => {
    const { dorm, block, floor, room, room_type, note } = req.body;
    let r = {}
    r.dorm = dorm
    r.block = block
    r.floor = floor
    r.room = room
    r.room_type = room_type
    r.note = note
    r.dorm_ID = r.dorm.concat(r.block).concat(r.room)
    r.note = note
    r.studentlist = []
    let newroom = new Room(r);
    await newroom.save(function (err, data) {
        if (err)
            return res.status(422).json({ error: "Error occurs while processing, please try again." });
        else
            return res.status(201).json({ msg: "Add new room success" });
    });
}
exports.addStudentToRoom = async (req, res) => {
    var students = req.body.students

    await Room.findById(req.params._id)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            present = result.studentlist.length
            limit = result.room_type
            if (present + students.length > limit) {
                return res.status(400).json({
                    error: "Exceed limit of room"
                })
            }
            students.map((student, index) => {
                result.studentlist.push(student)
                Student.findOneAndUpdate({ _id: student }, {
                    $push: { stayindorm: req.params._id }
                }, { new: true }).exec((err, student) => {
                    if (err || !student) {
                        return res.status(400).json({
                            error: "There are error. Please try again"
                        })
                    }
                })
            })
            result.save(function (err, data) {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: err });
                } else {
                    return res.status(201).json({
                        msg: "Add student to room successly"
                    })

                }
            })
        })

};
exports.showAllRoom = async (req, res) => {
    await Room.find({}).sort({ "block": 1 }).exec().then(room => res.json({ data: room }));

};
exports.showAvailableRoom = async (req, res) => {
    var room_type = req.params.room_type;

    // dorm: { type: String, require: true },
    // block: { type: String, require: true },
    // floor: { type: Number, require: true },
    // room: { type: String, require: true },
    // room_type: { type: Number, require: true },
    // dorm_ID: { type: String, require: true },
    // studentlist: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Student'
    // }],
    // note: {
    //     type: String,
    //     default: ''
    // }
    // var idx = room_type - 1
    Room.find({ room_type: room_type })
        .select("_id room dorm_ID studentlist")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            arr = []
            for (var i = 0; i < result.length; i++) {
                if (result[i].studentlist.length < room_type) {
                    arr.push(result[i])
                }
            }
            res.json({ numRequest: room_type, number: arr.length, data: arr })
        });
}
exports.seeRoomDetail = async (req, res) => {
    var _id = req.params._id
    await Room.findById(_id).populate("studentlist", "_id full_name email")
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({ error: err })
            }
            res.json({ data: result })
        })
};
exports.deleteRoom = async (req, res) => {
    Room.deleteOne({ _id: req.params._id }, function (err) {
        if (err)
            return res.status(400).json({ msg: "Delete not complete" });
        else
            return res.status(200).json({ msg: "Delete completed" });
    });
}

exports.updateRoom = async (req, res) => {
    Room.updateOne({ _id: req.params._id })
        .exec((err, result) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.json({ data: result });
        })
}
exports.removeStudentFromRoom = async (req, res) => {
    Room.findOneAndUpdate({ _id: req.params._id }, {
        $pull: { studentlist: req.params.student }
    }, { new: true }).exec((err, room) => {
        if (err || !room) {
            return res.status(400).json({
                error: "There are error. Please try again"
            })
        }
    })
}