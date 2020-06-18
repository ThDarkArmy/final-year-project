const express = require("express");
const Attendance = require('../models/attendance')
const Student = require('../models/Student')
const SendEmail = require('../utils/sendemail');
const SendSMS = require("../utils/sendsms");
const router = express.Router()


router.get("/", async (req, res)=>{
    try{
        const attendances = await Attendance.find({}).select('isPresent _id roll date student').populate('student','name roll std')
        res.status(200).json(attendances)
    }catch(err){
        res.status(401).json({msg: "Server Error", error: err})
    }
    
})

router.post('/:std', async (req, res)=>{
    try{
        var presentStudent = []
        var mailSentTo = []
        const ids = req.body.id
        //console.log(ids)
        const students = await Student.find({std: req.params.std})
        students.forEach(async student => {
            if(ids.includes(student._id.toString())){
                presentStudent.push(student)
                var studentAttendance = student.attendanceHistory
                studentAttendance.push({date: new Date().toISOString().slice(0,10).substring(0,10), isPresent: true})
                const st = await Student.findByIdAndUpdate(student._id, {$set:{attendanceHistory: studentAttendance}}, {new : true})
                const newAttendance = new Attendance({
                    roll: student.roll,
                    std: student.std,
                    date: new Date().toISOString().slice(0,10).substring(0,10),
                    isPresent: true,
                    student: student._id
                })
                newAttendance.save()
               
            }else{
                
                // send sms
                //console.log(student.mobile)
                // const To = student.mobile
                // send mail
                const to = student.email
                const subject = "About your child"
                const text = `Your child Mr/Ms ${student.name} is not present in the school, pls convey us he/she is home or not?`;
                const sendsms = new SendSMS(student.mobile, text)
                sendsms.sendSMS()
                const sendEmail = new SendEmail(to, subject, text)
                sendEmail.sendMail();

                mailSentTo.push({name: student.name, email: student.email, text: text})
                var studentAttendance = student.attendanceHistory
                studentAttendance.push({date: new Date().toISOString().slice(0,10).substring(0,10), isPresent: false})
                const st = await Student.findByIdAndUpdate(student._id, {$set:{attendanceHistory: studentAttendance}}, {new : true})  
            }     
        });
        res.status(200).json({PresentStudent: presentStudent, mailSentTo: mailSentTo})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    } 
})


module.exports = router