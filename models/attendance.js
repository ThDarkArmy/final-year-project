const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    roll: {
        type: Number,
        required: true
    },
    std: {
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