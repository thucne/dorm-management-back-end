const Admin = require('../models/admin')
const Student = require('../models/student')
const Room = require('../models/room')
const Requestreturn = require('../models/requestreturn')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
exports.studentRequestReturn = async (req, res) => {
	const { room,date,student,reason } = req.body;
	if (!room || !date||!student||!reason)
		return res.status(422).json({ error: "Please enter all the  fields" });
	let user = {};
	user.room = room;
	user.sendDate = date
	user.student = student;
    user.reason=reason;
		//.catch(err=>console.log(err));
	let request = new Requestreturn(user);
	await request.save(function (err, data) {
		if (err)
			return res.status(422).json({ error: "Error occurs while processing, please try again." });
		else
			return res.status(201).json({ msg: "Create request success" });
	});
}
exports.studentCheckRequestReturn = (req, res) => {
	Requestreturn.find({student:req.body._id}).populate("student","full_name").populate("room","room")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
exports.studentCancelRequestReturn = (req, res) => {
	Requestreturn.deleteOne({ student: req.body._id }, function (err) {
        if (err) return res.status(402).json({ msg: "Delete not complete" });
        else return status(200).json({ msg: "delete completed" });
        // deleted at most one tank document
    });
}
exports.showAllRequestReturn = async (req, res) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    await Requestreturn.find({}).limit(limit).skip((page - 1) * limit)
        .sort({ "sendDate": -1 })
        .populate('room','room block')
        .populate('student','_id full_name').exec((err, form) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: form })
        })
}
exports.adminAcceptRequest = (req, res) => {
	let _id = req.params._id;
    Requestreturn.updateOne({_id:_id} , {
       accept:!accept
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
       res.json({result});
    })
}
exports.showNonAccept = async (req, res) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    await Requestreturn.find({accept:false}).limit(limit).skip((page - 1) * limit)
        .sort({ "sendDate": -1 })
        .populate('room','room block')
        .populate('student','_id full_name').exec((err, form) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: form })
        })
}
exports.adminSeeDetail = (req, res) => {
    Requestreturn.find({_id:req.params._id}).populate("student","full_name photo academic_year").populate("room","room block dorm")
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data:result})
    })
}