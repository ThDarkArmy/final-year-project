const mongoose = require('mongoose')

const solutionSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    solutionFile: {
        type: String
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }
    
})

module.exports = mongoose.model("Solution", solutionSchema)