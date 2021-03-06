const express = require("express");
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/Student')

const Fee = require('../models/Fee')

mongoose.Promise = global.Promise
// get fee details of all the class for current month
router.get("/", async (req, res)=>{
    try{
        const currMonth = new Date().getMonth()
        const currYear = new Date().getFullYear()
        const fees = await Fee.find({$and:[{month: currMonth}, {year: currYear}]}).select("std month year tuitionFee examFee admissionFee _id").exec()
        res.status(200).json({fees: fees})
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// get fee details by id
router.get("/:id", async (req, res)=>{
    try{
        const fee = await Fee.findById(req.params.id).select("std month year tuitionFee examFee admissionFee _id").exec()
        res.status(200).json(fee)
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// get fee details of specific class
router.get("/std/:std", async (req, res)=>{
    try{
        const currMonth = new Date().getMonth()
        const currYear = new Date().getFullYear()
        const fee = await Fee.find({$and:[{std: req.params.std}, {month: currMonth}, {year: currYear}]}).select("std month year tuitionFee examFee admissionFee _id").exec()
        res.status(200).json(fee)
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// add fee in the database
router.post("/", async (req, res)=>{
    try{
        const {std , tuitionFee, admissionFee, examFee } = req.body
        const newFee = new Fee({
            std,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            tuitionFee,
            examFee,
            admissionFee,
        })
        // console.log(newFee)
        let fee = await Fee.findOne({$and:[{std: newFee.std}, {month: newFee.month}, {year: newFee.year}]})
        //console.log(fee)
        if(fee){
            return res.status(400).json({msg: "Fee is already added for this class."})
        }
        newFee.save()
        const students = await Student.find({std: std})
        students.forEach(async student => {
            var feeHist = student.feeHistory
            feeHist.push(newFee)
            student.feeHistory = feeHist
            const st = await Student.findByIdAndUpdate(student._id, {$set: student}, {new: true})
        })
        res.status(201).json({msg: "Fee added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

// edit fee
router.put('/:id', async (req, res)=>{
    try{
        const {std , tuitionFee, admissionFee, examFee } = req.body
        const newFee = new Fee({
            _id: req.params.id,
            std,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            tuitionFee,
            examFee,
            admissionFee
        })
        const fee = await Fee.findById(req.params.id)
        if(fee==null){
            return res.status(400).json({msg: "Fee is not present for this id."})
        }
       const response = await Fee.findByIdAndUpdate(req.params.id, {$set: newFee}, {new: true})
       const students = await Student.find({std: std})
        students.forEach(async student => {
            var feeHist = student.feeHistory
            feeHist.pop()
            feeHist.push(newFee)
            student.feeHistory = feeHist
            const st = await Student.findByIdAndUpdate(student._id, {$set: student}, {new: true})
        })
       res.status(201).json({msg: "Fee updated successfully."})

    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

// delete fee
router.delete('/:id', async (req, res)=>{
    try{
        const response = await Fee.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Fee deleted."})
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

module.exports = router