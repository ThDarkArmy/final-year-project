const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/student')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

mongoose.Promise = global.Promise

router.get('/',(req, res)=>{
    Student.find({}).then((student)=>{
        res.status(200).json({students: student});
    }).catch((err)=>{
        console.log(err)
        res.status(501).json({
            message: "Error Occured",
            error: err
        })
    })
    //res.status(201).json({message: "This is students router"})
})

router.get('/:roll',(req, res)=>{
    Student.find({roll: req.params.roll}).then((student)=>{
        res.status(200).json(student);
    }).catch((err)=>{
        console.log(err)
        res.status(501).json({
            message: "Error Occured while fetching student",
            error: err
        })
    })
    
})

router.post('/signup',(req, res)=>{
    const newStudent = new Student({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        roll: req.body.roll,
        mobile: req.body.mobile,
        class: req.body.class,
        password: req.body.password
    })

    Student.findOne({email:newStudent.email}).then((student)=>{
        if(student){
            return res.status(409).json({
                message: "user alraedy exists"
            })
        }
    })

    console.log(newStudent)

    // generating salt and hashing password
    bcrypt.genSalt(8, (err, salt)=>{
        if(err){
            res.status(501).json({message: "salt error", error: err})
        }

        bcrypt.hash(newStudent.password, salt, (err, hash)=>{
            if(err){
                res.status(501).json({error: err, message: "error while hashing"})
            }else{
                newStudent.password = hash
                newStudent.save().then((student)=>{
                    res.status(201).json({
                        message: "Student added in the database",
                        Student : newStudent
                    })
                }).catch((err)=>{
                    console.log("Error in adding  student", err)
                    res.status(501).json({
                        message: "Error occured while adding student!",
                        error: err
                    })
                })
            }
        })
    })
    
})

router.post('/signin', (req, res)=>{
    const email = req.body.email
    const password = req.body.password
    Student.findOne({email: email}).exec()
    .then((student)=>{
        bcrypt.compare(password, student.password, (err, result)=>{
            if(err){
                return res.status(500).json({
                    error: err,
                    message: "Error while comparing password"
                })
            }

            if(result){
                const token = jwt.sign({
                    email: email,
                    _id: student._id
                },process.env.SECRET_KEY,{
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: "Logged in Succesfully",
                    student: student,
                    token: token
                })
            }
            res.status(500).json({
                error: err,
                message: "password is incorrect"
            })

        })
    }).catch(err=>{
        res.status(401).json({
            error: err,
            message: "Student with this email doesn't exists"
        })
    })

})

router.delete('/email', ()=>{
    Student.remove({_id: req.params.userId}).then((result)=>{
        res.status(200).json({
            message: "Student deleted",
            result: result
        })
    }).catch((err)=>{
        console.log(err)
        res.status(501).json({
            error: err,
        })
    })
})

module.exports = router