const mongoose = require('mongoose')

const timetableSchema = mongoose.Schema({
    
    std: {
        type: String,
        required: true,
        trim: true
    },
    timetablefile: {
        type: String
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("TimeTable", timetableSchema)