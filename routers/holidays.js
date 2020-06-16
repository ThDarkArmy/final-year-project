const express = require('express')
const router = express.Router()
const Holiday = require('../models/Holiday')
const auth = require('../middlewares/check-auth')

// get all holidays
router.get('/', async (req, res)=>{
    try{
        const holidays = await Holiday.find({}).select("title description startDate duration _id").exec()
        res.status(200).json({holidays: holidays})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get holiday by id
router.get('/:id', async (req, res)=>{
    try{
        const holidays = await Holiday.findById(req.params.id).select("title description startDate duration _id").exec()
        res.status(200).json(holiday)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add holiday
router.post('/', (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        const {title, description, startDate, duration} = req.body
        const newHoliday = new Holiday({
            title,
            description,
            startDate,
            duration
        })
        newHoliday.save();
        res.status(201).json({msg: "Holiday added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit holiday
router.put('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var holiday = await Holiday.findById(req.params.id)
        if(!holiday){
            return res.status(400).json({msg: "Holiday not found."})
        }
        const {title, description, startDate, duration} = req.body
        const newHoliday = new Holiday({
            _id: req.params.id,
            title,
            description,
            startDate,
            duration
        })
        const response = await Holiday.findByIdAndUpdate(req.params.id, {$set: newHoliday}, {new: true})
        res.status(200).json({msg: "Holiday updated successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete holiday
router.delete('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var holiday = await Holiday.findById(req.params.id)
        if(!holiday){
            return res.status(400).json({msg: "Holiday not found."})
        }
        const response = await Holiday.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Holiday deleted successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router