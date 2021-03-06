const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
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
    std: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    attendanceHistory:[{
        date: {
            type : String,
            trim : true,
        },
        isPresent : {
            type : Boolean,
            default : false
        }
    }],
    feeHistory: [{
        tuitionFee: {
            type: Number,
            required: true
        },
        examFee: {
            type: Number
        },
        admissionFee: {
            type: Number
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        datePaid: {
            type: String,
            default: null
        },
        month: {
            type: String,
        },
        year: {
            type: String
        } 
    }]
})

const Student = mongoose.model("Student", studentSchema)

module.exports = Student