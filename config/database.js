const mongoose = require("mongoose")

module.exports = mongoose.connect('mongodb://localhost:27017/finalyear', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>console.log('Connected to the database'))
.catch((err)=>console.log("Error in connecting to database ", err))