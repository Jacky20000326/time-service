const mongoose = require("mongoose");
const study_Model = require("./studyModel")


const userSchema = new mongoose.Schema({
    user_ID:{
        type: String,
    },
    name:{
        type: String,
        require: true
    },
    user_name:{
        type: String
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    
    friend: [{
        type : mongoose.Types.ObjectId,
        ref: "User"
    }],
    studty: [{
        type : mongoose.Types.ObjectId,
        ref: study_Model
    }]
    // 
})

// find db have same user or not
userSchema.statics.findSameInfoIndb = function(user,callback){
    this.findOne({"email": user.email},(err,User)=>{
        if(err){
            console.log(err)
            return
        }
        callback(User)
    })
}




// make friend with other user
userSchema.statics.findUser = function(userID,callback){
    this.findOne({"_id":userID},(err,otherUser)=>{
        if(err){
            console.log(err)
        }
        if(otherUser){
            callback(otherUser)
        }else{
            console.log("Cannot find this user")
        }
    })
}

// 好友加入動態方法
userSchema.methods.makeFriendTool = function(userId){
    this.friend.push(userId)
    this.save()
}


const User = mongoose.model("User",userSchema)
module.exports = User