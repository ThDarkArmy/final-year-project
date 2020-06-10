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
    },
    solutions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution"
    }]
})

module.exports = mongoose.model("Assignment", assignmentSchema)