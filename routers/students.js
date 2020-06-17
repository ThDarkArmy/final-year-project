const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const auth = require('../middlewares/check-auth')
const Fee = require('../models/Fee')

mongoose.Promise = global.Promise

router.get('/',async (req, res)=>{
    try{
        const student = await Student.find({}).select("-__v -password")
        res.status(200).json({students: student})
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
})

router.get('/:id',async (req, res)=>{
    try{
        const student = await Student.findById(req.params.id).select("-__v -password")
        res.status(200).json(student)
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
    
})

router.get('/std/:std',async (req, res)=>{
    try{
        const students = await Student.find({std: req.params.std}).select("-__v -password")
        res.status(200).json({students: students})
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
    
})

router.post('/signup',async (req, res)=>{
    try{
        //console.log("signup request")
        const newStudent = new Student({
            name: req.body.name,
            roll: req.body.roll,
            email: req.body.email,
            mobile: req.body.mobile,
            std: req.body.std,
            password: req.body.password
        })

        const student = await Student.findOne({email:newStudent.email})
        if(student){
            return res.status(500).json({msg: "User with given email already exists."});
        }
        // adding fee to the student
        const fee = await Fee.findOne({$and:[{std: newStudent.std}, {month: new Date().getMonth()}, {year: new Date().getFullYear()}]})
        if(fee){
            const fees = [{
                tuitionFee: fee.tuitionFee,
                examFee: fee.examFee,
                admissionFee: fee.admissionFee,
                month: fee.month,
                year: fee.year,
                isPaid: false,
                datePaid: null,
            }]
            newStudent.fee = fees
        }
        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(newStudent.password, salt)
        newStudent.password = hashedPassword
        newStudent.save()

        const payload = {
            student: newStudent
        }

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token: token, student: newStudent})
        })

    }catch(err){
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
    
})

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body
        let student = await Student.findOne({email}).select("-__v")
        if(!student) return res.status(400).json({msg: "Invalid Credentials"})
        console.log(student)

        const isMatch = await bcrypt.compare(password, student.password) 
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"})

        const payload = {
            student: student
        }
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token:token, student: student})
        })

    }catch(err){
        console.log(err)
        res.status(400).json({error: err})
    }
   
})

router.put('/:id',auth, async (req, res)=>{
    try{
        const newStudent = new Student({
            _id: req.params.id,
            name: req.body.name,
            roll: req.body.roll,
            email: req.body.email,
            mobile: req.body.mobile,
            std: req.body.std,
            password: req.body.password
        })

        const student = Student.findById(req.params.id)
        newStudent.fee = student.fee
        const response = await Student.findByIdAndUpdate(req.params.id,{$set: newStudent}, {new: true})
        res.status(201).json(response)

    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

router.delete('/:id',auth, async (req, res)=>{
    try{
        const response = await Student.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

module.exports = router