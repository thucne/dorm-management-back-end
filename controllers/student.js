const Student = require('../models/student')
const Room=require('../models/room')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
//const _ = require('lodash');
exports.studentRegister = async (req, res) => {
	const { full_name,identity_card,dob, gender,academic_year,field_of_major,folk,email,password,religion,country,brandname,parentname,address,telparent,tel } = req.body;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !password||!gender||!full_name||!tel||!identity_card||!dob||!academic_year||!field_of_major||!folk||!religion||!country||!brandname||!parentname||!telparent||!address)
		return res.status(422).json({ error: "Please enter all the  fields" });
	if (re.test(String(email).toLowerCase()) == false)
		return res.status(422).json({ error: "Invalid email" });

	Student.findOne({ email }, async(err, existedUser) => {
		if (existedUser) {
			return res.status(401).json({
				error: "Email is already existed"
			})
		}
		let user = {};
		user.email = email;
		user.password = bcrypt.hashSync(password, 10);
		user.full_name = full_name;
        user.gender=gender;
        user.residentinfo={telephone:tel};
        user.parentinfo={name:parentname,address:address,tel:telparent}
        user.academic_year=academic_year
        day=new Date(dob+"Z")
        user.dob=day
        user.identity_card=identity_card
        user.field_of_major=field_of_major
        user.folk=folk
        user.religion=religion
        user.country=country
        user.insurance={brand:brandname}
		//.catch(err=>console.log(err));
		let studentModel = new Student(user);
		await studentModel.save(function (err, data) {
			if (err)
				return res.status(422).json({ error: err });
			else
				return res.status(201).json({ msg: "Register account for student successly" });
		});
	})


};
exports.studentLogin = async (req, res) => {
	let user = {};
	user.email = req.body.email;
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//let userModel = new student(user);
	const result = await Student.findOne({
		email: user.email
	});
	if (result && bcrypt.compareSync(req.body.password, result.password)) {
		const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
		res.cookie('token', token, { expiresIn: '10d' })
		const { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,photo,religion,country,insurance,parentinfo,residentinfo,stayindorm } = result
		return res.json({
			token: token,
			student: { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,photo,religion,country,insurance,parentinfo,residentinfo,stayindorm}
		});

	}
	else
		res.status(404).send({ error: "Email address or password is incorrect!" })
};

exports.studentSeeRoommate = async (req, res) => {
    await Room.find({studentlist: { $in: req.body._id }}).populate('studentlist','_id full_name photo').exec().then(studentlist => res.json({ data: studentlist }));
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
			const { full_name,dob, gender,academic_year,field_of_major,folk,email,religion,country,tel } = result
			res.json({student:{full_name,dob, gender,academic_year,field_of_major,folk,email,religion,country,tel} })
		})
}
exports.studentSeeHistory = (req, res) => {
	Student.findById(req.body._id).populate("stayindorm","room block floor")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({data:result})
		})
}
exports.studentUpdate = async (req, res) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	Student.findById(req.params._id).exec((err, oldUser) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		let user = {};
		let form = new formidable.IncomingForm();
		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: err })
			}
			//let bookSlugBeforeMerge = oldBook.slug
			//  oldUser = _.merge(oldUser, fields)
			//oldUser = _.merge(oldUser, fields)

			var {url, email, username, oldpassword, newpassword, reenterpassword } = fields
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
			if (email != null) {
				if (re.test(String(email).trim().toLowerCase()) == false)
					return res.status(400).json({ error: "Email format failed" })
				oldUser.email = String(email).trim();
			}
			if (username != null) {
				if (String(username).trim().length == 0)
					return res.status(400).json({ error: "Please enter new username" })
				oldUser.username = String(username).trim();
			}
			if(url!=null)
			{
				if(String(url).trim().length>0)
				{
					oldUser.photo=String(url);
				}
			}
			oldUser.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err
					})
				}
				res.json({ msg: 'Update student information sucessfully', data: oldUser })
			})

		})
	})

};