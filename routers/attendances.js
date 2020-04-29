const express = require("express");
const mongoose = require('mongoose')
const Attendance = require('../models/attendance')
const Student = require('../models/student')
const SendEmail = require('../sendemail')
const router = express.Router()


router.get("/", (req, res)=>{
    Attendance.find({}).select('isPresent _id roll date student').populate('student','name roll class').exec().then((attendance)=>{
        res.status(201).json({attendances: attendance})
    }).catch((err)=>{
        res.status(401).json({
            message: "Error Occured while fetching attendance",
            error: err
        })
    })
})

router.post('/', (req, res)=>{    
    Student.findOne({email: req.body.email})
    .then((student)=>{
        const newAttendance = new Attendance({
            _id: new mongoose.Types.ObjectId(),
            roll: req.body.roll,
            email: req.body.email,
            date: new Date().toISOString().slice(0,10).substring(0,10),
            isPresent: true,
            student: student._id
        })
        newAttendance.save().then((attendance)=>{
            var studentAttendance = student.attendance
            
            studentAttendance.push({date: new Date().toISOString().slice(0,10).substring(0,10), isPresent: true})

            Student.updateOne({email: student.email}, {$set:{attendance : studentAttendance}}, (err, result)=>{
                if(err){
                    res.status(500).json({error: err, message: "error occured in taking attendance"})
                    console.log("error in saving")
                }
                console.log(result)
            })
            res.status(201).json({
                message: "Attendance saved",
                attendance: attendance
            })
        }).catch((err)=>{
            res.status(500).json({
                message: "Error occured while taking attendance",
                error: err
            })
        })
    }).catch((err)=>{
        return res.status(404).json({
            message: "Student with given email id doesn't exist",
            error: err
        })
    })
})


router.post("/submit",(req, res)=>{
    var presentStudent = []
    var absentStudent = []
    var mailSentTo = []
    Student.find({}, (err, students)=>{
        if(err){
            res.status(500).json({error: err})
            console.log("error occured!")
        }
        
        students.map(student =>{
            var studentAtt = student.attendance
    
            if(studentAtt.length!==0 && studentAtt[studentAtt.length-1].date===new Date().toISOString().slice(0,10).substring(0,10)){
                presentStudent.push(student)
               
            }else{
                absentStudent.push(student)
                //const from = 'Vonage SMS API';
                const to = student.email
                const subject = "About your child"
                const text = `Your child Mr/Ms ${student.name} is not present in the school, pls convey us he/she is home or not?`;

                //const to = '918789542914';

                const sendEmail = new SendEmail(to, subject, text)
                sendEmail.sendMail();
                mailSentTo.push({name: student.name, email: student.email, text: text})
                
                // nexmo.message.sendSms(from, to, text, {type: 'unicode'}, (err, responseData)=>{
                //     if(err){
                //         console.log("Error occured while sending sms")
                //     }else{
                //         console.log(responseData)
                //     }
                // });
                    }
                })

            res.status(201).json({presentStudents: presentStudent, absentStudents: absentStudent, mailSentTo: mailSentTo})
        
    })
    
})

module.exports = router