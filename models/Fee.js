const mongoose = require('mongoose')

const feeSchema = mongoose.Schema({
    std : {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    tuitionFee: {
        type: Number,
        required: true
    },
    examFee: {
        type: Number
    },
    admissionFee: {
        type: Number
    }
})

module.exports = mongoose.model("Fee", feeSchema)