const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roll: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: String,
        
    },
    isPresent:{
        type:Boolean,
        default: false
       },
    student:{type: mongoose.Schema.Types.ObjectId, ref : "Student",required: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema)

module.exports = Attendance