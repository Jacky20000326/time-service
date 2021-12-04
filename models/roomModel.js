const mongoose = require("mongoose");
const User = require("../models/userModel")

const roomSchema = new mongoose.Schema({
    roomId:{
        type: String,
        require: true
    },
    creator:[{
        type: mongoose.Types.ObjectId,
        ref: User,
        require: true
    }],
    members:[{
        type: mongoose.Types.ObjectId,
        ref: User
    }],
    setTime:{
        type: String,
        require: true
    }
})

roomSchema.statics.findRoom = function(id,callback){
    this.findOne({"roomId": id },(err,Room)=>{
        console.log(id)
        if(err){
            console.log(err)
        }
        if(!Room){
            console.log("找不到房間")
        }else{
            callback(Room)
        }
    })
}

roomSchema.statics.createRoom = function(room_id,userId){
    this.create({
        roomId: room_id,
        creator: userId
    }).then(()=>{
        console.log("save room id in db")
    }).catch((err)=>{
        console.log(err)
    })
}

const Room = mongoose.model("Room",roomSchema)
module.exports = Room