const mongoose = require('mongoose')

const facilitySchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model("Facility", facilitySchema)