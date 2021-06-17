const Admin = require('../models/admin');
const Student = require('../models/student')
const Room = require('../models/room')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {random,floor}= require('mathjs');
const formidable = require('formidable');
const Utility = require('../models/utilitybill');
const Bill = require('../models/bill');
const Requestfix = require('../models/requestfix');
const Requestreturn = require('../models/requestreturn');

//const _ = require('lodash');
exports.adminRegister = async (req, res) => {
	const { name, gender, email, password, tel } = req.body;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !password || !gender || !name || !tel)
		return res.status(422).json({ error: "Please enter all the  fields" });
	if (re.test(String(email).toLowerCase()) == false)
		return res.status(422).json({ error: "Invalid email" });

	Admin.findOne({ email }, async (err, existedUser) => {
		if (existedUser) {
			return res.status(401).json({
				error: "Email is already existed"
			})
		}
		let user = {};
		user.email = email;
		user.password = bcrypt.hashSync(password, 10);
		user.name = name;
		user.gender = gender;
		user.tel = tel;
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
exports.createAdminAccount = async (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: err })
		}
		var { name, gender, email, password, tel } = fields
		let user = {}
		user.name = name;
		user.gender = gender;
		user.email = email;
		user.tel = tel;
		user.password = bcrypt.hashSync(password, 10);
		let adminModel = new Admin(user);
		adminModel.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ msg: 'Send request successfully' })
		})

	})
}
exports.adminLogin = async (req, res) => {
	let user = {};
	user.email = req.body.email;
	// if (!user.email) return res.status(404).json({error: 'Unauthorized access!'});
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//let userModel = new admin(user);
	const result = await Admin.findOne({
		email: user.email
	});

	if (!result) return res.status(404).json({ error: 'Admin not found!' });

	if (result && bcrypt.compareSync(req.body.password, result.password)) {
		var re = req.params.remember
		if (!re === 'remember') {
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
			const { _id, name, email, tel } = result
			console.log("pass");
			return res.json({
				token: token,
				user: { _id, name, email, tel },
				role: 1
			});
		}
		else {
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);
			//res.cookie('token', token, { expiresIn: '10d' })
			const { _id, name, email, tel } = result
			console.log("sada");

			return res.json({
				token: token,
				user: { _id, name, email, tel },
				role: 1
			});
		}

	}
	else
		res.status(404).send({ error: "Email address or password is incorrect!" })
};
exports.adminSearchStudentByName = (req, res) => {
	const name = String(req.params.name).trim();
	Student.find({ $or: [{ full_name: { $regex: name, $options: 'i' } }] })
		.select("_id full_name photo room").populate('room', "_id room").exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ data: result })
		})
}
exports.adminSeeStudent = (req, res) => {
	let _id = req.params._id;
	Student.findById(_id).populate("room", "_id room dorm_ID").populate("stayindorm", "_id room")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ student: result })
		})
}
exports.adminUpdateActiveStudent = (req, res) => {
	let _id = req.params._id;
	Student.updateOne({ _id: _id }, {
		active: !active
	}, { new: true }).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({ result });
	})
}
exports.getStudentList = (req, res) => {
	Student.find({}).populate("room", "_id room dorm_ID").populate("stayindorm", "_id room").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({ data: result })
	})
}
exports.getAdminAccount = (req, res) => {
	const { _id } = req.user;
	console.log('user', req.user);
	console.log(_id);
	Admin.findById(_id).select("email name").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		console.log(result)
		res.json(result);
	})
}
exports.getAdminInfo = (req, res) => {
	const { _id } = req.user;

	Admin.findById(_id).select("name gender email tel").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json(result);
	})
}
exports.editAccount = (req, res) => {
	const { _id } = req.user;

	Admin.findById(_id).exec((err, oldUser) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}

		const { oldPassword, newPassword } = req.body;

		if (oldPassword != null && String(oldPassword).trim().length > 0) {

			if (bcrypt.compareSync(oldPassword, oldUser.password) == false)
				return res.status(400).json({ error: "Password wrong" })
			else {
				if (newPassword == null || String(newPassword).trim().length == 0)
					return res.status(400).json({ error: "You should decleare new password" })

				oldUser.password = bcrypt.hashSync(String(newPassword).trim(), 10);
			}
		}
		oldUser.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json(oldUser)
		})
	})

}
exports.editInfo = async (req, res) => {
	const { _id } = req.user;
	try {
		Admin.findById(_id).exec( async (err, oldUser) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			const { name, gender, tel } = req.body;
			console.log(req.body);
			if (name !== "" && name !== undefined) {
				await Admin.findByIdAndUpdate(_id, { $set: { name } }, { new: true });
			}
			if (gender !== "" && gender !== undefined) {
				await Admin.findByIdAndUpdate(_id, { $set: { gender } }, { new: true });
			}
			if (tel !== "" && tel !== undefined) {
				await Admin.findByIdAndUpdate(_id, { $set: { tel } }, { new: true });
			}

			const newUser = await Admin.findById(_id);
			return res.json(newUser);
		})
	} catch (error) {
		res.status(409).json({ error: 'Failed to update!' })
	}
}

exports.getDatabase = async (req, res) => {
	const { whatDatabase } = req.params;
	if (!whatDatabase) return res.status(404).json({ error: 'No database specified!' });
	let data = [];
	let temp = [];
	switch (whatDatabase) {
		case 'student-information':
			data = await Student.find({});
			return res.json(data);
		case 'utility':
			data = await Utility.find({});
			return res.json(data);
		case 'resident':
			data = await Bill.find({});
			return res.json(data);
		case 'admin-accounts':
			data = await Admin.find({});
			return res.json(data);
		case 'fix-request':
			data = await Requestfix.find({});
			return res.json(data);
		case 'return-request':
			data = await Requestreturn.find({});
			return res.json(data);
		case 'room':
			data = await Room.find({});
			return res.json(data);
		case 'residentinfo':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Student.find({});
			for (let i = 0; i < data.length; i++) {
				temp.push(data[i].residentinfo);
			}
			return res.json(temp);
		case 'parentinfo':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Student.find({});

			for (let i = 0; i < data.length; i++) {
				temp.push(data[i].parentinfo);
			}
			return res.json(temp);
		case 'insurance':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Student.find({});

			for (let i = 0; i < data.length; i++) {
				temp.push(data[i].insurance);
			}
			return res.json(temp);
		case 'studentlist':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Room.find({});

			for (let i = 0; i < data.length; i++) {
				temp.push({ 'room name': data[i].dorm_ID, 'number of student': data[i].studentlist.length });
			}
			return res.json(temp);
		case 'insurance':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Student.find({});

			for (let i = 0; i < data.length; i++) {
				temp.push({ 'student_name': data[i].full_name, ...data[i].insurance });
			}
			return res.json(temp);
		case 'power':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Utility.find({});
			for (let i = 0; i < data.length; i++) {
				console.log(data[i]);
				temp.push({ 'room': data[i].room, ...data[i].power });
			}
			return res.json(temp);
		case 'water':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Utility.find({});
			for (let i = 0; i < data.length; i++) {
				console.log(data[i]);
				temp.push({ 'room': data[i].room, ...data[i].water });
			}
			return res.json(temp);
		case 'stayindorm':
			// var fields = { 'residentinfo.telephone': 1, 'residentinfo.province': 1,  'residentinfo.ward': 1,  'residentinfo.district': 1};
			data = await Student.find({}).populate("stayindorm", "dorm_ID");

			for (let i = 0; i < data.length; i++) {
				let str = null;
				for (let k = 0; k < data[i].stayindorm.length; k++) {
					console.log(data[i].stayindorm[k]);
					str = [str, data[i].stayindorm[k].dorm_ID].join("  ");
				}
				console.log(str);
				temp.push({ 'student name': data[i].full_name, 'list of room': str });
			}
			return res.json(temp);
		default:
			return res.json([]);
	}
}
