const Route = require("express").Router();
const study = require("../models/studyModel");
const user = require("../models/userModel")

Route.post("/add_new_data",(req,res)=>{
    study.create({
        "topic": req.body.topic,
        "single_study_time" : req.body.single_study_time,
    },(err,data)=>{
        if(err){
            console.log(err)
        }else{
            user.findSameInfoIndb(global.user_Info[0],(User)=>{
                User.studty.push(data._id)
                User.save()
            })
        }
    })
})

// 查找相同標籤資料




Route.get('/user_info',(req,res)=>{
    user.find({"email": "user1@gmail.com"},(err,result)=>{
        res.json(result)
    }).populate("studty").populate( "frined")
    // populate輸入userSchema ref的欄位
})
// 讀書時使用


module.exports = Route