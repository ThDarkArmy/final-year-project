const express = require("express");
const router = express.Router()
const mongoose = require('mongoose')

const Fee = require('../models/Fee')

mongoose.Promise = global.Promise
// get fee details of all the class
router.get("/", async (req, res)=>{
    try{
        const currMonth = new Date().getMonth()
        const currYear = new Date().getFullYear()
        const fees = await Fee.find({$and:[{month: currMonth}, {year: currYear}]})
        res.status(200).json(fees)
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// get fee details by id
router.get("/:id", async (req, res)=>{
    try{
        const fee = await Fee.findById(req.params.id)
        res.status(200).json(fee)
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// get fee details of specific class
router.get("/:std", async (req, res)=>{
    try{
        const currMonth = new Date().getMonth()
        const currYear = new Date().getFullYear()
        const fee = await Fee.find({$and:[{std: req.params.std}, {month: currMonth}, {year: currYear}]})
        res.status(200).json(fee)
    }catch(err){
        res.status(401).json({msg: "Server Error", Error: err})
    }
})

// add fee in the database
router.post("/add", async (req, res)=>{
    try{
        const {std , tuitionFee, admissionFee, examFee } = req.body
        const newFee = new Fee({
            std,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            tuitionFee,
            examFee,
            admissionFee
        })
        // console.log(newFee)
        let fee = await Fee.findOne({$and:[{std: newFee.std}, {month: newFee.month}, {year: newFee.year}]})
        console.log(fee)
        if(fee){
            return res.status(400).json({msg: "Fee is already added for this class."})
        }
        newFee.save()
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
            tuitionFee,
            examFee,
            admissionFee
        })
        const fee = await Fee.findById(req.params.id)
        if(fee==null){
            return res.status(400).json({msg: "Fee is not present for this id."})
        }
       const response = await Fee.findByIdAndUpdate(req.params.id, {$set: newFee}, {new: true})
       res.status(201).json(response)

    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

// delete fee
router.delete('/:id', async (req, res)=>{
    try{
        const response = await Fee.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({msg: "Server Error", Error: err})
    }
})

module.exports = router