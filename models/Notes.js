const mongoose = require('mongoose')

const notesSchema = mongoose.Schema({
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
    notesFile: {
        type: String
    }
})

module.exports = mongoose.model("Notes", notesSchema)