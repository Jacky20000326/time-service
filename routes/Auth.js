const Route = require("express").Router()
const joiSchema = require("../joiUserSchena").userSchema;
const user = require("../models/userModel")
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// 可以使用userdefault來存放使用者資訊 ex.使用者ID、賬號、密碼、暱稱等

global.user_Info = []
// global：在 Node.js 下的全域名稱 


// 註冊
Route.post("/sign-up",(req,res)=>{
    let typingError = joiSchema(req.body)
    if(!typingError.error){
        console.log(req.body)
    }else{
        console.log(typingError.error.details[0].message)
    }
    user.findSameInfoIndb(req.body,(User)=>{
        if(!User){
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if(err){
                        next(err)
                    }
                    user.create({"email": req.body.email,
                    "password": hash},(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            res.json(result)
                        }
                    })
                });
            });       
        }else{
            res.send("這個email已經被註冊過了")
        }
    })
})

// 登入
Route.post("/log-in",(req,res)=>{
    let typingError = joiSchema(req.body)
    if(!typingError.error){
        console.log(req.body)
    }else{
        console.log(typingError.error.details[0].message)
    }
        user.findSameInfoIndb(req.body,(User)=>{
            if(User){
                bcrypt.compare(req.body.password, User.password, function(err, ismatch) {
                    if(err){
                        console.log(err)
                        return
                    }
                    if(ismatch == true){
                        let payload = { email : User.email }
                        let token = jwt.sign(payload,process.env.JWTSCRET);
                        user_Info.push(User)
                        res.json({user_Info,token})
                        console.log("已登入")
                    }else{
                        console.log("你的密碼不正確喔！！")
                    }
                });
            }else{
                console.log("沒有這位使用者")
            }
        })
})

// 使用者加入名稱
Route.post("/save-name",(req,res)=>{
    user.findUser(req.body._id,(User)=>{
        User.name = req.body.name
        User.save()
    })
    console.log(req.body)
})


module.exports = Route