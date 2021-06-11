const Student = require('../models/student')
const Room = require('../models/room')
const Bill = require('../models/bill')
const UtilityBill = require('../models/utilitybill')
const Requestreturn = require('../models/requestreturn')
const RequestFix = require('../models/requestfix')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const { request } = require('express')
const dotenv = require('dotenv');

const cloudinary = require('cloudinary');
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const httpToHTTPS = (oldURL) => {
	if (oldURL.indexOf('s') === 4) return oldURL;
	return oldURL.substring(0, 4) + 's' + oldURL.substring(4);
}

const uploadToCloud = async (data) => {
	let url = "";
	await cloudinary.v2.uploader.upload(data)
		.then((result) => {
			console.log(result.url);
			url = result.url;
		}).catch((error) => {
			console.log(error);
			url = 'https://res.cloudinary.com/katyperrycbt/image/upload/v1615115485/filewastoolarge_kwwpt9.png'
		});

	return httpToHTTPS(url);
}

//const _ = require('lodash');
exports.studentRegister = async (req, res) => {
	try {
		const { folk,
			photo,
			religion,
			// stayindorm: [],
			email,
			password,
			full_name,
			gender,
			residentinfo,
			parentinfo,
			academic_year,
			dob,
			identity_card,
			field_of_major,
			country,
			insurance,
			room,
			from,
			to
		} = req.body;
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!email || !password || !gender || !full_name || !identity_card || !dob || !academic_year || !field_of_major || !folk || !religion || !country)
			return res.status(422).json({ error: "Please enter all the  fields" });
		if (re.test(String(email).toLowerCase()) == false)
			return res.status(422).json({ error: "Invalid email" });
	
		Student.findOne({ email }, async (err, existedUser) => {
			if (existedUser) {
				return res.status(401).json({
					error: "Email is already existed"
				})
			}
			let user = {};
			user.email = email;
			user.password = bcrypt.hashSync(password, 10);
			user.full_name = full_name;
			user.gender = gender;
			user.residentinfo = residentinfo;
			user.parentinfo = parentinfo
			user.academic_year = academic_year;
			user.dob = dob;
			user.identity_card = identity_card;
			user.field_of_major = field_of_major;
			user.folk = folk;
			user.religion = religion;
			user.country = country;
			user.room = room;
			user.insurance = insurance;
			user.stayindorm = [];
			user.stayindorm.push(room);
			//.catch(err=>console.log(err));
			let studentModel = new Student(user);
			await studentModel.save(function (err, data) {
				if (err) {
					return res.status(422).json({ error: err })
				} else {
					Room.findOneAndUpdate({ _id: room }, {
						$push: { studentlist: data._id }
					}, { new: true }).exec((err, room) => {
						if (err || !room) {
							return res.status(400).json({
								error: "There are error. Please try again"
							})
						}
					})
					return res.status(201).json(data);
				}
			});
		})
	
	} catch (error) {
		res.status(409).json({error: 'Something went wrong!'})
	}
};
exports.studentLogin = async (req, res) => {
	let user = {};
	user.email = req.body.email;
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//let userModel = new student(user);
	const result = await Student.findOne({
		email: user.email
	});

	if (!result) return res.status(404).json({ error: 'Not found!' });

	if (result && bcrypt.compareSync(req.body.password, result.password)) {
		var re = req.params.remember // remember
		console.log(re);
		if (!re === 'remember') {
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
			const { _id, full_name, identity_card, gender, academic_year, field_of_major, folk, email, photo, religion, country, insurance, parentinfo, residentinfo, stayindorm } = result
			return res.json({
				role: 0,
				token: token,
				user: { _id, full_name, identity_card, gender, academic_year, field_of_major, folk, email, photo, religion, country, insurance, parentinfo, residentinfo, stayindorm }
			});
		}
		else {
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);
			const { _id, full_name, identity_card, gender, academic_year, field_of_major, folk, email, photo, room, religion, country, insurance, parentinfo, residentinfo, stayindorm } = result
			return res.json({
				role: 0,
				token: token,
				user: { _id, full_name, identity_card, gender, academic_year, field_of_major, folk, email, room, photo, religion, country, insurance, parentinfo, residentinfo, stayindorm }
			});
		}

	}
	else
		res.status(404).send({ error: "Email address or password is incorrect!" })
};

exports.studentSeeRoommate = async (req, res) => {
	await Room.find({ studentlist: { $in: req.body._id } }).populate('studentlist', '_id full_name photo').exec().then(studentlist => res.json({ data: studentlist }));
}

exports.studentSeeStudent = (req, res) => {
	let _id = req.params._id;
	Student.findById(_id)
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			const { full_name, dob, gender, academic_year, field_of_major, folk, email, religion, country, tel } = result
			res.json({ student: { full_name, dob, gender, academic_year, field_of_major, folk, email, religion, country, tel } })
		})

}
exports.getStudentInfo = (req, res) => {
	let { _id } = req.user;
	Student.findById(_id).populate("room", "_id dorm block floor room room_type dorm_ID").populate("stayindorm", "_id dorm block floor room room_type dorm_ID")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json(result);
		})
}
exports.getStudentAccount = (req, res) => {
	let _id = req.params._id;
	Student.findById(_id)
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({ error: err })
			}
			const { email, full_name } = result
			res.json({ account: { email, full_name } })

		})
}
exports.studentEditAccount = async (req, res) => {
	Student.findById(req.params._id).exec((err, oldUser) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		let form = new formidable.IncomingForm();
		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: err })
			}
			var { email, oldpassword, newpassword, reenterpassword } = fields
			/* if(re.test(String(email).toLocaleLowerCase())==false||String(username).trim().length==0||String(newpassword).trim()!=String(reenterpassword).trim()||(String(oldpassword).trim().length>0&&String(newpassword).trim().length==0)||(String(oldpassword).trim().length==0&&String(newpassword).trim().length>0))
			  return res.status(400).json({ error: "Something wrong while updating data, Please try again later" })*/
			if (oldpassword != null && String(oldpassword).trim().length > 0) {
				let hash = bcrypt.hashSync((oldpassword), 10);
				if (bcrypt.compareSync(oldpassword, oldUser.password) == false)
					return res.status(400).json({ error: "Password wrong" })
				else {
					if (newpassword == null || String(newpassword).trim().length == 0)
						return res.status(400).json({ error: "You should decleare new password" })
					else if (reenterpassword == null || String(newpassword).trim() != String(reenterpassword).trim())
						return res.status(400).json({ error: "Reenter password not correct" })
					oldUser.password = bcrypt.hashSync(String(newpassword).trim(), 10);
				}
			}
			oldUser.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err
					})
				}
				res.json({ msg: 'Update student account sucessfully', data: oldUser })
			})

		})
	})

};
exports.studentEditInfo = async (req, res) => {
	Student.findById(req.params._id).exec((err, oldUser) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		let form = new formidable.IncomingForm();
		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: err })
			}
			oldUser = _.merge(oldUser, fields)
			oldUser.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err
					})
				}
				res.json({ msg: 'Update student info sucessfully', data: oldUser })
			})

		})
	})

};
exports.getRequestReturn = async (req, res) => {
	const { _id } = req.user;
	Requestreturn.find({ student: _id }).populate("student", "full_name email").populate("room", "room dorm_ID")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json(result)
		})

};
exports.getBill = async (req, res) => {
	const { _id } = req.user;
	console.log('id is ', _id, 'room id is ', req.params.room_id)
	Bill.find({ own: _id }).populate("own", "_id full_name email").populate("room", "room dorm_ID").populate("cashier", "name email tel").sort({ "createOn": -1 })
		.exec((err, resultBill) => {
			if (err) {
				console.log('err Bill', err);
				return res.status(400).json({
					error: err
				})
			}
			UtilityBill.find({ room: req.params.room_id }).populate("room", "_id block floor room").sort({ "createAt": -1 }).exec((err, resultUtility) => {
				if (err) {
					console.log('utility Bill', err);
					return res.status(400).json({
						error: err
					})
				}
				res.json({ bill: resultBill, utilityBill: resultUtility })
			})
		})
};
exports.getRequestFix = async (req, res) => {
	const { room } = req.user;

	RequestFix.find({ room: room }).populate("room", "_id block floor room").sort({ "sendDate": -1 })
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json(result)
		})

};
exports.requestFix = async (req, res) => {
	const { room } = req.user;

	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	const { fixnote, image } = req.body;

	const urlImage = await uploadToCloud(image);

	console.log(urlImage)

	const request = {
		room: room,
		fixnote: fixnote,
		image: urlImage
	}

	let requestFix = new RequestFix(request);
	requestFix.save((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({ msg: 'Send request successfully' })
	})

	// form.parse(req, (err, fields, files) => {
	// 	if (err) {
	// 		return res.status(400).json({ error: err })
	// 	}
	// 	var { fixnote, image } = fields
	// 	request = {}
	// 	request.room = room;
	// 	request.fixnote = fixnote;
	// 	request.image = uploadToCloud(image);

	// 	console.log(request.image);



	// })
}
exports.requestReturn = async (req, res) => {
	const { room } = req.user;
	const { _id } = req.user;
	const { reason, leavingDate } = req.body;

	const request = {
		room,
		student: _id,
		reason,
		sendDate: leavingDate
	}

	console.log(request);

	let requestReturn = new Requestreturn(request);
	requestReturn.save((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({ msg: 'Send request successfully' })
	})
}
