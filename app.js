const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const app = express()

// database connection
require('./config/database')
require('dotenv').config()

// setting port
const PORT = process.env.PORT | 5000

// middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan("dev"))

app.get("/",(req, res)=>{
    res.status(201).json({message: "This is home page"})
})

// routes
const attendance = require("./routers/attendances")
const student = require("./routers/students")

app.use('/attendance',attendance)
app.use('/student',student)

app.listen(PORT, ()=>{
    console.log("Server is listening on port : "+PORT)
})