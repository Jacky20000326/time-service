const Route = require("express").Router();
const study = require("../models/studyModel");
const user = require("../models/userModel")
const moment = require("moment");






Route.post("/add_new_data",(req,res)=>{

        let {  single_study_time } = req.body
        console.log(single_study_time)
        let studyTimeSeconds = ""
        let studyTimeMinutes = ""
        let studyTimeHours = ""

        if( single_study_time > 60) {//如果秒數大於60，將秒數轉換成整數
            //獲取分鐘，除以60取整數，得到整數分鐘
            studyTimeMinutes = parseInt(single_study_time / 60);
            //獲取秒數，秒數取佘，得到整數秒數
            studyTimeSeconds = parseInt(single_study_time % 60);
            //如果分鐘大於60，將分鐘轉換成小時
            if(studyTimeMinutes > 60) {
                //獲取小時，獲取分鐘除以60，得到整數小時
                studyTimeHours = parseInt(studyTimeMinutes / 60);
                //獲取小時後取佘的分，獲取分鐘除以60取佘的分
                studyTimeMinutes = parseInt(studyTimeMinutes % 60);
            }
        }else{
            studyTimeSeconds = single_study_time
        }
        // let studyTime = moment.utc(single_study_time*1000).format('HH:mm:ss');
        // 將秒數轉換成 HH:mm:ss
        let endTime =  moment()
        let startTime = moment().subtract({
            "hours": studyTimeHours ,
            "minutes": studyTimeMinutes,
            "seconds": studyTimeSeconds
        })
        let energy = single_study_time / 60
        study.create({
            "topic": req.body.todo,
            "start_study_time": startTime.format('YYYY/MM/DD HH:mm:ss'),
            "duration" : single_study_time,
            "end_study_time": endTime.format('YYYY/MM/DD HH:mm:ss'),
            "energy": energy
        },(err,data)=>{
            
            if(err){
                console.log(err)
            }else{
                console.log(data)     
                user.findOne({"_id":req.body.userId},(err,User)=>{
                    if(err){
                        console.log(err)
                    }
                    User.all_study_info.push(data._id)
                    User.all_energy += energy
                    User.save().then(()=>{
                        console.log(User)
                    }).catch((err)=>{
                        console.log(err)
                    })
                    console.log(user)
                })
            }
        })
        
        
    })

// 查找相同標籤資料


// 取得能量經驗值(總)

Route.post("/getEnergy",(req,res)=>{
    let { _id } = req.body
    user.findUser(_id,(User)=>{
        let sum = 0
        User.all_study_info.forEach ((item)=>{
            sum += Number(item.energy)
        })

    res.send(String(sum))
        
    })
    // console.log(_id)
})

//取得能量經驗值(當月)

Route.post("/getMonthEnergy",(req,res)=>{
    let { _id } = req.body
    user.findUser(_id,(User)=>{
        let sum = 0
        let getThisMonth = moment().get('month') + 1
        User.all_study_info.forEach ((item)=>{
            let getStudtMonth = item.start_study_time.split("/",2)[1]
            if(getStudtMonth == getThisMonth){
                sum += Number(item.energy)
                console.log(User)
            }else{
                console.log("no match")
            }
        })
        User.Month_energy = sum
        User.save()
    })
})

// 讀書時使用


// 刪除資料表
Route.get("/delete",(req,res)=>{
    user.findUser("619a02743b6547e87226f23a",(User)=>{
        User.all_study_info = [];
        User.save()
        console.log(User)

    })
})


module.exports = Route