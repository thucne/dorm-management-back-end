const Student = require('../models/student')
const Room=require('../models/room')
const Bill=require('../models/bill')
const UtilityBill=require('../models/utilitybill')
const Requestreturn=require('../models/requestreturn')
const RequestFix=require('../models/requestfix')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const { request } = require('express')
//const _ = require('lodash');
exports.studentRegister = async (req, res) => {
	const { full_name,identity_card,dob, gender,academic_year,field_of_major,folk,email,password,religion,country,insurance_number,date_of_issue,valid_from,valid_to,parentname,address,telparent,tel,room,provincecity,district,ward } = req.body;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !password||!gender||!full_name||!tel||!identity_card||!dob||!academic_year||!field_of_major||!folk||!religion||!country||!parentname||!telparent||!address)
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
        user.residentinfo={provincecity:provincecity,district:district,ward:ward};
        user.parentinfo={Contact_name:parentname,Address:address,Contact_telephone:telparent}
        user.academic_year=academic_year
        day=dob
        user.dob=dob
        user.identity_card=identity_card
        user.field_of_major=field_of_major
        user.folk=folk
        user.religion=religion
        user.country=country
		user.room=romm
        if(insurance_number.length>0 && date_of_issue && valid_from && valid_to)
		{
			user.insurance={Number:insurance_number,date_of_issue:date_of_issue,valid_from:valid_from,valid_to:valid_to}
		}
		user.stayindorm=[]
		user.stayindorm.push(room)
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
		var re=req.params.remember
		if(re)
		{
			const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
			const { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,photo,religion,country,insurance,parentinfo,residentinfo,stayindorm } = result
			return res.json({
				role:0,
				token: token,
				student: { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,photo,religion,country,insurance,parentinfo,residentinfo,stayindorm}
			});
	}
	else
	{
		const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);
			const { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,photo,room,religion,country,insurance,parentinfo,residentinfo,stayindorm } = result
			return res.json({
				role:0,
				token: token,
				student: { _id,full_name,identity_card,gender,academic_year,field_of_major,folk,email,room,photo,religion,country,insurance,parentinfo,residentinfo,stayindorm}
			});
	}

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
exports.getStudentInfo=(req,res)=>{
	let _id = req.params._id;
	Student.findById(_id).populate("room","_id dorm block floor room room_type dorm_ID").populate("stayindorm","_id room")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({student:result})
		})
}
exports.getStudentAccount=(req,res)=>{
	let _id=req.params._id;
	Student.findById(_id)
	.exec((err,result)=>{
		if(err)
		{
			return res.status(400).json({error:err})
		}
		const {email,full_name} = result
		res.json({account:{email,full_name} })

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
			var {email,oldpassword, newpassword, reenterpassword } = fields
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
exports.getRequestReturn=async(req,res)=>{
    Requestreturn.find({student:req.params._id}).populate("student","full_name email").populate("room","room dorm_ID")
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data:result})
    })

};
exports.getBill=async(req,res)=>{
    Bill.find({own:req.params._id}).populate("own","_id full_name email").populate("room","room dorm_ID").populate("cashier","name email tel").sort({"createOn":-1})
    .exec((err, resultBill) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
			UtilityBill.find({room:req.params.room_id}).populate("room","_id block floor room").sort({"createAt":-1}).exec((err,resultUtility)=>{
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({bill:resultBill,utilityBill:resultUtility})
		})
    })
};
exports.getRequestFix=async(req,res)=>{
    RequestFix.find({room:req.body.room_id}).populate("room","_id block floor room").sort({"sendDate":-1})
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data:result})
    })

};
exports.requestFix = async (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: err })
		}
		var {room,fixnote,image} = fields
		request={}
		request.room=room;
		request.fixnote=fixnote;
		request.image=image;
		let requestFix=new RequestFix(request);
		requestFix.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ msg: 'Send request successfully'})
		})

		})
	}
exports.requestReturn = async (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: err })
		}
		var {room,student,reason} = fields
		request={}
		request.room=room;
		request.student=student;
		request.reason=reason;
		let requestReturn=new Requestreturn(request);
		requestReturn.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				})
			}
			res.json({ msg: 'Send request successfully'})
		})

		})
	}
