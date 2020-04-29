const mongoose = require("mongoose")


const studentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    roll: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    class: {
        type: String,
        required: true
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

const Student = mongoose.model("Student", studentSchema)

module.exports = Student