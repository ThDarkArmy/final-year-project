const mongoose = require('mongoose')

const noticeSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Notice", noticeSchema)