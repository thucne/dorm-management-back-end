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
exports.adminSeeBillOfStudent = (req, res) => {
    let _id = req.params._id;
	Bill.find({own:_id}).populate("own","_id full_name photo").sort({ "createAt": -1 })
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
	Bill.findById(_id).populate("own","_id full_name photo").populate("cashier","_id name").sort({ "createAt": -1 })
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
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
}
exports.createBillForStudent = (req, res) => {
    const { semester,duration,own,createAt,cashier,total,content } = req.body;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !password||!gender||!name||!tel)
		return res.status(422).json({ error: "Please enter all the  fields" });
	if (re.test(String(email).toLowerCase()) == false)
		return res.status(422).json({ error: "Invalid email" });

	Admin.findOne({ email }, async(err, existedUser) => {
		if (existedUser) {
			return res.status(401).json({
				error: "Email is already existed"
			})
		}
		let user = {};
		user.email = email;
		user.password = bcrypt.hashSync(password, 10);
		user.name = name;
        user.gender=gender;
        user.tel=tel;
		//.catch(err=>console.log(err));
		let adminModel = new Admin(user);
		await adminModel.save(function (err, data) {
			if (err)
				return res.status(422).json({ error: "Error occurs while processing, please try again." });
			else
				return res.status(201).json({ msg: "Register account for admin successly" });
		});
	})
}

