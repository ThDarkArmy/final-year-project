const mongoose = require("mongoose")


const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin