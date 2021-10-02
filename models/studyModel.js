const mongoose = require("mongoose");


const studySchema = new mongoose.Schema({
    topic:{
        type: String,
        require: true,
        max: 50,
    },
    single_study_time: {
        type: Number,
        require: true,
    },
    all_study_time:{
        type: Number,
        require: true,
    },
    time : { type : Date, default: Date.now }
    
},{timestamps: { 
    createdAt: 'created', 
    updatedAt: 'updatezd' 
} })






const Study = mongoose.model('Study',studySchema)

module.exports = Study