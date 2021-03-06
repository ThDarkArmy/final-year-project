const mongoose = require('mongoose')

const assignmentSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    std: {
        type: String,
        required: true,
        trim: true
    },
    assignmentFile: {
        type: String
    }
})

module.exports = mongoose.model("Assignment", assignmentSchema)