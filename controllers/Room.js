const Room = require('../models/room.js');
const Admin = require('../models/admin.js');
const Student = require('../models/student.js');

exports.addRoom = async(req, res) => {

    let room = new Room();



    room.dorm = req.body.dorm;
    room.block = req.body.block;
    room.room = req.body.room;
    room.room_type = req.body.room_type;
    room.dorm_ID = req.body.dorm_ID;
    room.floor = req.body.floor;
    room.note = req.body.note;

    if (room.room_type == 2) {
        return room.studentlist.length <= 2;
    } else if (room.room_type == 4) {
        return room.studentlist.length <= 4;
    } else if (room.room_type == 6) {
        return room.studentlist.length <= 6;
    }




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

exports.addStudent = async(req, res) => {
    let studentlist = req.body.studentlist
    await Room.findById(req.params._id)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            studentlist.map((student, index) => {
                result.studentlist.push(student)
            });
            result.save(function(err, data) {
                if (err) {
                    console.log(err);
                    return res.status(404).json({ error: err });
                } else {
                    return res.status(201).json({
                        msg: "Add student successly"
                    })

                }
            })
        })
}

exports.showAllRoom = async(req, res) => {
    await Room.find({}).exec().then(room => res.json({ data: room }));

};
exports.showResidentRoom = async(req, res) => {
    let _id = req.params._id;
    await Room.findById(_id)
        .populate("studentlist._id", "full_name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
};

exports.deleteRoom = async(req, res) => {
    Room.deleteOne({ _id: req.params._id }, function(err) {
        if (err)
            return res.status(400).json({ msg: "Delete not complete" });
        else
            return res.status(200).json({ msg: "Delete completed" });
    });
}

exports.updateRoom = async(req, res) => {
    Room.updateOne({ _id: req.params._id })
        .exec((err, result) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.json({ data: result });
        })

}

exports.adminSeeRoomByDorm = async(req, res) => {
    Room.find({ dorm: req.body.dorm })
        .exec((err, result) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.json({ data: result });
        })
}

exports.adminSeeRoomByDormBlock = async(req, res) => {
    Room.find({ dorm: req.body.dorm, block: req.body.block })
        .exec((err, result) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.json({ data: result });
        })
}

exports.adminSeeRoomType = async(req, res) => {
    Room.find({ room_type: req.body.room_type })
        .exec((err, result) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.json({ data: result });
        })
}