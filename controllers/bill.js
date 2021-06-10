const Admin = require('../models/admin')
const Student = require('../models/student')
const Bill = require('../models/bill')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.checkBill = (req, res) => {
	let _id = req.params._id;
    Bill.updateOne({_id:_id} , {
       paymentstatus:true
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
       res.json({result});
    })
}
exports.seeBillOfStudent = (req, res) => {
    let _id = req.params._id;
	Bill.find({own:_id}).sort({ "createOn": -1 })
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
exports.seeBillDetail = (req, res) => {
    let _id = req.params._id;
	Bill.findById(_id).populate("own","_id full_name email room ").populate("cashier","_id name email")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
/*
exports.showAllBillBySemester = (req, res) => {
    semester=req.params.semester
    let limit = parseInt(req.query.limit) || 20
    let page = parseInt(req.query.page) || 1
    await Bill.find({semester:semester}).limit(limit).skip((page - 1) * limit)
        .sort({ "createAt": -1 })
        .populate('own','_id full_name')
        .populate('cashier','_id name').exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}
exports.showAllBillNonPaidBySemester = (req, res) => {
    semester=req.params.semester
    let limit = parseInt(req.query.limit) || 20
    let page = parseInt(req.query.page) || 1
    await Bill.find({semester:semester,paymentstatus:false}).limit(limit).skip((page - 1) * limit)
        .sort({ "createAt": -1 })
        .populate('own','_id full_name')
        .populate('cashier','_id name').exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}*/
exports.createBill = async(req, res) => {
    const {receipt,semester,duration,own,cashier,total,paymentstatus,content} = req.body;
	let b={}
	b.receipt=receipt
	b.semester=semester
	b.duration=duration
	b.own=own
	b.cashier=cashier
	b.total=total
	b.paymentstatus=paymentstatus
	b.content=content
	let billModel = new Bill(b);
	await billModel.save(function (err, data) {
		if (err)
			return res.status(422).json({ error: "Error occurs while processing, please try again." });
		else
			return res.status(201).json({ msg: "Created bill successly" });
		});
}
exports.showAllBillNonPaid = async (req, res) => {
    await Bill.find({paymentstatus:false})
        .sort({ "createOn": -1 })
        .populate('own','_id full_name room')
        .populate('cashier','_id name').exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}

