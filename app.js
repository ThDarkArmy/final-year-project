const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const app = express()

// database connection
require('./config/database')

// dotenv
require('dotenv').config()

// setting port
const PORT = process.env.PORT | 5000

// middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan("dev"))

// home route
app.get("/",(req, res)=>{
    res.status(201).json({message: "This is home page"})
})

// routes
const attendance = require("./routers/attendances")
const student = require("./routers/students")
const fees = require('./routers/fees')
const teacher = require('./routers/teachers')
const admin = require('./routers/admin')
const event = require('./routers/events')
const holiday = require('./routers/holidays')
const timetable = require('./routers/timetable')
const assignment = require('./routers/assignments')
const solution = require('./routers/solutions')

app.use('/attendance',attendance)
app.use('/student',student)
app.use('/fee', fees)
app.use('/teacher', teacher)
app.use('/admin', admin)
app.use('/event', event)
app.use('/holiday', holiday)
app.use('/timetable', timetable)
app.use('/assignment', assignment)
app.use('/solution', solution)


app.listen(PORT, ()=>{
    console.log("Server is listening on port : "+PORT)
})