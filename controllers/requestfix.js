const Requestfix = require('../models/requestfix.js');
const Room = require('../models/room.js');

exports.showAllRequestFix = async(req, res) => {

    await Requestfix.find({})
        .populate("room", "dorm block room")
        .sort({"sendDate":-1})
        .exec()
        .then(requestfix => res.json({ data: requestfix }));
}

exports.addRequestfix = async(req, res) => {
    const {room,fixnote,image } = req.body;
    let requestfix = new Requestfix();
    requestfix.room = room;
    requestfix.image = image;
    requestfix.fixnote = fixnote;
    await requestfix.save(function(err, data) {
        if (err)
            return res.status(422).json({ error: "Error occurs while processing, please try again." });
        else
            return res.status(201).json({ msg: "Create request success" });
    });
}

exports.cancelRequestFix = (req, res) => {
    Requestfix.deleteOne({ _id: req.params._id }, function(err) {
        if (err)
            return res.status(402).json({ msg: "Delete not complete" });
        else
            return res.status(200).json({ msg: "Delete completed" });

    });
}
exports.adminAcceptRequest = (req, res) => {
    let _id = req.params._id;
    Requestfix.updateOne({ _id: _id }, {
        accept:true
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
        .sort({"sendDate":1})
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}
exports.seeDetail = (req, res) => {
    Requestfix.find({ _id: req.params._id })
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
    Requestfix.find({room: req.body._id })
        .populate("room", "dorm block room")
        .sort({"sendDate":-1})
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}