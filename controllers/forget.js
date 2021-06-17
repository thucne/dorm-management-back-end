const Admin = require('../models/admin');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const {random,floor}= require('mathjs');
exports.forgetPassword = async (req, res) => {
	const email = req.body.email;

	Admin.findOne({email:email}).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		if(!result)
		{
			Student.findOne({email:email}).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if(!result_student)
                {
                    return res.status(400).json({
                        error: "Email do not exist"
                    })
                }
        
                if (result_student.recovery_code!="") {
                    return res.json(result_student.recovery_code)
                }
                else
                {
                    var code           = '';
                    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < 10; i++ ) {
                          code += characters.charAt(floor(random() * charactersLength));
                       }
                    result_student.recovery_code=code;
                    result_student.save((err,newStudent) => {
                        if (err) {
                            console.log("kde");
                            return res.status(400).json({
                                error: err
                            })
                        }
                        return res.json(newStudent.recovery_code)
                    })
                       
                }
            
            })
		}

		if (result.recovery_code!="") {
			console.log(email)
			return res.json(result.recovery_code)
		}
		else
		{
			var code           = '';
    		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    		var charactersLength = characters.length;
    		for ( var i = 0; i < 10; i++ ) {
      			code += characters.charAt(floor(random() * charactersLength));
   			}
			result.recovery_code=code;
			result.save((err,newuser) => {
				if (err) {
					console.log("kde");
					return res.status(400).json({
						error: err
					})
				}
				return res.json(newuser.recovery_code)
			})
   			
		}
	
	})
}
exports.checkCode = async (req, res) => {
	const code = req.body.code;
    Admin.findOne({recovery_code:code}).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		if(!result)
		{
			Student.findOne({recovery_code:code}).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if(!result_student)
                {
                    return res.status(400).json({
                        error: "Your code is wrong , try again"
                    })
                }
        
               return res.json(result_student.email)
            
            })
		}
        else
        {

		    return res.json(result.email);}
	
	})
};
exports.updatePassword = async (req, res) => {
	const {code,newPassword} = req.body;
    Admin.findOne({recovery_code:code}).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		if(!result)
		{
			Student.findOne({recovery_code:code}).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if(!result_student)
                {
                    return res.status(400).json({
                        error: "Can not found code"
                    })
                }
                else
                {
                    result_student.password=bcrypt.hashSync(String(newPassword).trim(), 10);
                    result_student.recovery_code="";
                    result_student.save((err, ans) => {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            })
                        }
                        res.json({msg:"Update Successfully"})
                    })

                }
            
            })
		}
        else
        {

            result.password=bcrypt.hashSync(String(newPassword).trim(), 10);
            result.recovery_code="";
            result.save((err, ans) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json({msg:"Update Successfully"})
            })

        }
	
	})
};