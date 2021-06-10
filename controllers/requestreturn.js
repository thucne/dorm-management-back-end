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
exports.seeDetailRequestReturn = (req, res) => {
	Requestreturn.find({_id:req.params._id}).populate("student","full_name").populate("room","room")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
exports.cancelRequestReturn = (req, res) => {
	Requestreturn.deleteOne({_id: req.params._id }, function (err) {
        if (err) return res.status(402).json({ msg: "Delete not complete" });
        else return status(200).json({ msg: "delete completed" });
        // deleted at most one tank document
    });
}
exports.showAllRequestReturn = async (req, res) => {
    await Requestreturn.find({})
        .sort({ "sendDate": -1 })
        .populate('room','room block dorm_ID')
        .populate('student','_id full_name email').exec((err, form) => {
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
       accept:true
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
    await Requestreturn.find({accept:false})
        .sort({ "sendDate": -1 })
        .populate('room','room block')
        .populate('student','_id full_name email').exec((err, form) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: form })
        })
}
exports.studentGetForm=async(req,res)=>{
    Requestreturn.find({student:req.params._id}).populate("student","full_name email").populate("room","room dorm_ID")
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data:result})
    })

}