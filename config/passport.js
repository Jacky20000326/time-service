// jwt 驗證
const api = require("express").Router();
const jwt = require("jsonwebtoken")
api.post('/authenticate',(req,res)=>{
        var token = req.body.token
        // 可能從userDefault來的
        if(token){
            jwt.verify(token,process.env.JWTSCRET,(err,decoded)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to authenticate token.'})
                }else{
                    res.json({decoded})
                }
            })
        }else{
            console.log()
        }
    })

module.exports = api