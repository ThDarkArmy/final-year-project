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
    routine: [{
        subject:{
            type: string,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        duration: {
            type: Number
        }
    }]
})

module.exports = mongoose.model("Exam", examSchema)