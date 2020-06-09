const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    classTeacherOfClass: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    attendance:[{
        date: {
            type : String,
            trim : true,
        },
        isPresent : {
            type : Boolean,
            default : false
        }
    }],
})

const Teacher = mongoose.model("Teacher", teacherSchema)

module.exports = Teacher