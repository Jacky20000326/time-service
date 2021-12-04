// jwt 驗證
const api = require("express").Router();
const jwt = require("jsonwebtoken")
api.post('/authenticate',(req,res)=>{
        console.log(req.body)
        var token = req.body.token
        // 可能從userDefault來的
        if(token){
            jwt.verify(token,process.env.JWTSCRET,(err,decoded)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to authenticate token.'})
                }else{
                    console.log(decoded)
                    
                    res.json({decoded})
                }
            })
        }else{
            console.log("使用者沒有儲存過token")
        }
    })

module.exports = api