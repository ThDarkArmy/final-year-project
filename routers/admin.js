const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const auth = require('../middlewares/check-auth')

mongoose.Promise = global.Promise

router.get('/',async (req, res)=>{
    try{
        const admin = await Admin.find({})
        res.status(200).json(admin)
    }catch(err){
        res.status(404).json({msg: "Server Error.", error: err})
    }
})

// router.get('/:id',auth,async (req, res)=>{
//     try{
//         const admin = await Admin.findById(req.params.id)
//         res.status(200).json(admin)
//     }catch(err){
//         res.status(404).json({msg: "Server Error.", error: err})
//     }
    
// })

router.post('/signup',async (req, res)=>{
    try{
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            school: req.body.school,
            password: req.body.password
        })

        const admin = await Admin.find({})
        if(admin.length>0){
            return res.status(500).json({msg: "Already one admin exists."});
        }

        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(newAdmin.password, salt)
        newAdmin.password = hashedPassword
        newAdmin.save()

        const payload = {
            admin: newAdmin
        }

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token:token, admin: newAdmin})
        })

    }catch(err){
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
    
})

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body
        let admin = await Admin.findOne({email})
        if(!admin) return res.status(400).json({msg: "Invalid Credentials"})

        const isMatch = await bcrypt.compare(password, admin.password) 
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"})

        const payload = {
            admin: admin
        }
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 360000
        }, (err, token)=>{
            if(err) throw err
            res.status(200).json({token: token, admin: admin})
        })

    }catch(err){
        console.log(err.message)
        res.status(400).json({error: err})
    }
   
})

router.put('/:id',auth, async (req, res)=>{
    try{
        const newAdmin = new Admin({
            _id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            school: req.body.school,
            password: req.body.password
        })

        const response = await Admin.findByIdAndUpdate(req.params.id,{$set: newAdmin}, {new: true})
        res.status(201).json(response)

    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

router.delete('/:id',auth, async (req, res)=>{
    try{
        const response = await Admin.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Admin deleted successfully", admin: response})
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

module.exports = router