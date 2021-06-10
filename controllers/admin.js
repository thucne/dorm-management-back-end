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
exports.createAdminAccount=async(req,res)=>{
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: err })
		}
		var {name,gender,email,password,tel} = fields
		let user={}
		user.name=name;
		user.gender=gender;
		user.email=email;
		user.tel=tel;
		user.password=bcrypt.hashSync(password, 10);
		let adminModel=new Admin(user);
		adminModel.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ msg: 'Send request successfully'})
		})

		})
}
exports.adminLogin = async (req, res) => {
	let user = {};
	user.email = req.body.email;
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//let userModel = new admin(user);
	const result = await Admin.findOne({
		email: user.email
	});
	if (result && bcrypt.compareSync(req.body.password, result.password)) {
		var re=req.params.remember
		if(re){
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
			const { _id, name,email,tel } = result
			return res.json({
				token: token,
				user: {_id,name,email,tel},
				role:1
			});
		}
		else{
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);
			//res.cookie('token', token, { expiresIn: '10d' })
			const { _id, name,email,tel } = result
			return res.json({
				token: token,
				user: {_id,name,email,tel},
				role:1
			});
		}

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
exports.adminSeeStudent = (req, res) => {
	let _id = req.params._id;
	Student.findById(_id).populate("room","_id room dorm_ID").populate("stayindorm","_id room")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({student:result})
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
exports.getStudentList=(req,res)=>{
	Student.find({}).populate("room","_id room dorm_ID").populate("stayindorm","_id room").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({data:result})
	})
}
exports.getAdminAccount=(req,res)=>{
	Admin.find({_id:req.body._id}).select("email name").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({data:result})
	})
}
exports.getAdminInfo=(req,res)=>{
	Admin.find({_id:req.params._id}).select("name gender email tel").exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		res.json({data:result})
	})
}
exports.editAccount=(req,res)=>{
	Admin.findById(req.params._id).exec((err, oldUser) => {
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
			var {email, oldpassword, newpassword, reenterpassword } = fields
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
				res.json({ msg: 'Update admin account sucessfully', data: oldUser })
			})

		})
	})

}
exports.editInfo=(req,res)=>{
	Admin.findById(req.params._id).exec((err, oldUser) => {
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
			var {name,gender,tel } = fields
			oldUser.name=name;
			oldUser.gender=gender;
			oldUser.tel=tel;
			oldUser.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err
					})
				}
				res.json({ msg: 'Update admin info sucessfully', data: oldUser })
			})

		})
	})

}
