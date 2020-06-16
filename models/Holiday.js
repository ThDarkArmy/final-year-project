const mongoose = require('mongoose')

const holidaySchema = mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    }
})

module.exports = mongoose.model("Holiday", holidaySchema)