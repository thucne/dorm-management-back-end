const Requestfix = require('../models/requestfix.js');
const Room = require('../models/room.js');

exports.showAllRequestFix = async(req, res) => {

    await Requestfix.find({})
        .populate("room", "dorm block room")
        .populate("student", "full_name")
        .exec()
        .then(requestfix => res.json({ data: requestfix }));
}

exports.addRequestfix = async(req, res) => {
    const { student, room, fixnote } = req.body;
    if (!room || !fixnote || !student)
        return res.status(422).json({ error: "Please enter your room and fix information" });
    let requestfix = new Requestfix();
    requestfix.room = room;
    requestfix.image = req.body.image;
    requestfix.student = student;
    requestfix.fixnote = fixnote;
    await requestfix.save(function(err, data) {
        if (err)
            return res.status(422).json({ error: "Error occurs while processing, please try again." });
        else
            return res.status(201).json({ msg: "Create request success" });
    });
}

exports.studentCancelRequestFix = (req, res) => {
    Requestfix.deleteOne({ student: req.body._id }, function(err) {
        if (err)
            return res.status(402).json({ msg: "Delete not complete" });
        else
            return res.status(200).json({ msg: "Delete completed" });

    });
}
exports.adminAcceptRequest = (req, res) => {
    let _id = req.params._id;
    Requestfix.updateOne({ _id: _id }, {
        $set: {
            accept: req.body.accept
        }
    }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ data: result });
    })
}
exports.showNonAcceptRequest = async(req, res) => {
    await Requestfix.find({ accept: false })
        .populate('room', 'dorm block room')
        .populate('student', 'full_name')
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}
exports.adminSeeDetail = (req, res) => {
    Requestfix.find({ _id: req.params._id })
        .populate("student", "full_name academic_year")
        .populate("room", "dorm block room")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}

exports.studentCheckRequestFix = (req, res) => {
    Requestfix.find({ student: req.body._id })
        .populate("student", "full_name")
        .populate("room", "dorm block room")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}