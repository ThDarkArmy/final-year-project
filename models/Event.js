const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
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
        type: Date,
        required: true
    },
    duration: {
        type: Number
    }
})

module.exports = mongoose.model("Event", eventSchema)