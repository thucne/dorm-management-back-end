const mongoose=require('mongoose');
const jwt=require("jsonwebtoken");
const admin=require('../models/admin.js');
const student=require('../models/student.js');

exports.requireadminLogin=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
     return res.status(401).json({error:"you must be loggin "})
    }
     const token=authorization.replace("ititiu ","")
     jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
         if(err)
        { 
              return res.status(401).json({error:"you must be loggin"})
        }
          const {_id}=payload;
          console.log(_id);
          admin.find({_id:_id}).then(userdata=>{
              if(userdata.length==0)
               return res.status(404).json({error:"login failed,try again"})
              else
              {
                req.user=userdata
                next()
              }
          })
    
     })
}
exports.requirestudentLogin=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
     return res.status(401).json({error:"you must be loggin "})
    }
     const token=authorization.replace("Bearer ","")
     jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
         if(err)
        { 
              return res.status(401).json({error:"you must be loggin"})
        }
          const {_id}=payload
          student.findById(_id).then(userdata=>{
              if(userdata==null)
               return res.status(404).json({error:"login failed"})
              else
              {
                req.user=userdata
                next()
              }
          })
    
     })
}

exports.signout = (req, res) => {
  res.clearCookie('token')
  res.json({ msg: "Sign out success" })
};
