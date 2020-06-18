const mongoose = require('mongoose')

const solutionSchema = mongoose.Schema({
    studentName: {
        type: String,
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