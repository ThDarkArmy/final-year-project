const mongoose = require('mongoose')

const examSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    std:{
        type: String,
        required: true
    },
    routine: {
        type: String,

    }
})

module.exports = mongoose.model("Exam", examSchema)