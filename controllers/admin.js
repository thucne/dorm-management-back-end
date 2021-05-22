const Admin = require('../models/admin')
const Student = require('../models/student')
const Room = require('../models/room')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
//const _ = require('lodash');
exports.adminRegister = async (req, res) => {
	const { name,gender,email, password,tel } = req.body;
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


};
exports.adminLogin = async (req, res) => {
	let user = {};
	user.email = req.body.email;
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//let userModel = new admin(user);
	const result = await Admin.findOne({
		email: user.email
	});
	if (result && bcrypt.compareSync(req.body.password, result.password)) {
		const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
		res.cookie('token', token, { expiresIn: '10d' })
		const { _id, name,email,tel } = result
		return res.json({
			token: token,
			user: {_id,name,email,tel}
		});

	}
	else
		res.status(404).send({ error: "Email address or password is incorrect!" })
};
exports.adminSearchStudentByName = (req, res) => {
	const name = String(req.params.name).trim();
	Student.find({$or: [{ full_name: { $regex: name, $options: 'i' }}]})
	.select("_id full_name photo room").populate('room', "_id room").exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}

exports.adminSeeRoomByBlock = (req, res) => {
	Room.find({block:req.body.block})
	.select('_id room')
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({name:req.body.block,number:result.length,rooms:result})
		})
}
exports.adminSeeStudentByRoom = (req, res) => {
	Room.findById(req.body._id)
	.populate("studentlist","_id full_name photo")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({room:result.room,data:result.studentList})
		})
}
exports.adminSeeStudent = (req, res) => {
	let _id = req.params._id;
	Student.findById(_id)
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			const { full_name,identity_card,dob, gender,academic_year,field_of_major,folk,email,religion,country,brandname,parentname,address,telparent,tel } = result
			res.json({student:{full_name,identity_card,dob, gender,academic_year,field_of_major,folk,email,religion,country,brandname,parentname,address,telparent,tel} })
		})
}
exports.adminUpdateActiveStudent = (req, res) => {
	let _id = req.params._id;
    Student.updateOne({_id:_id} , {
       active:!active
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
       res.json({result});
    })
}