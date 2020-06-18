const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Teacher = require('../models/Teacher')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const auth = require('../middlewares/check-auth')

mongoose.Promise = global.Promise

router.get('/',async (req, res)=>{
    try{
        const teachers = await Teacher.find({})
        res.status(200).json({teachers: teachers})
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
})

router.get('/:id',auth,async (req, res)=>{
    try{
        const teacher = await Teacher.findById(req.params.id)
        res.status(200).json(teacher)
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
    
})

router.post('/signup',async (req, res)=>{
    try{
        const newTeacher = new Teacher({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            classTeacherOfClass: req.body.classTeacherOfClass,
            password: req.body.password
        })

        const teacher = await Teacher.findOne({email:newTeacher.email})
        if(teacher){
            return res.status(500).json({msg: "User with given email already exists."});
        }

        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(newTeacher.password, salt)
        console.log(hashedPassword)
        newTeacher.password = hashedPassword
        newTeacher.save()

        const payload = {
            teacher: newTeacher
        }

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token:token, teacher: newTeacher})
        })

    }catch(err){
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
    
})

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body
        let teacher = await Teacher.findOne({email})
        if(!teacher) return res.status(400).json({msg: "Invalid Credentials email"})

        const isMatch = await bcrypt.compare(password, teacher.password) 
        console.log(isMatch)
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials passw"})

        const payload = {
            teacher: teacher
        }
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token: token, teacher: teacher})
        })

    }catch(err){
        console.log(err.message)
        res.status(400).json({error: err})
    }
   
})

router.put('/:id',auth, async (req, res)=>{
    try{
        const newTeacher = new Teacher({
            _id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            classTeacherOfClass: req.body.classTeacherOfClass,
            password: req.body.password
        })

        const response = await Teacher.findByIdAndUpdate(req.params.id,{$set: newTeacher}, {new: true})
        res.status(201).json(response)

    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

router.delete('/:id',auth, async (req, res)=>{
    try{
        const response = await Teacher.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

module.exports = router