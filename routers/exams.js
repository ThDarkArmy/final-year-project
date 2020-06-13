const express = require('express')
const router = express.Router()
const Exam = require('../models/Exam')
const auth = require('../middlewares/check-auth')

// get all exams
router.get('/', async (req, res)=>{
    try{
        const exams = await Exam.find({})
        res.status(200).json(exams)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get exam by class
router.get('/:std', async (req, res)=>{
    try{
        const exams = await Exam.find({std: req.params.std);
        res.status(200).json(exams)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get exam by id
router.get('/:id', async (req, res)=>{
    try{
        const exam = await Exam.findById(req.params.id)
        res.status(200).json(exam)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add exam
router.post('/',auth, (req, res)=>{
    try{
        if(!auth.admin){
            return res.status(400).json({msg: "Only admin is authorized."})
        }
        const {title, routine} = req.body
        const newExam = new Exam({
            title,
            routine
        })
        newExam.save();
        res.status(201).json({msg: "Exam added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit exam
router.put('/:id',auth, async (req, res)=>{
    try{
        if(!auth.admin){
            return res.status(400).json({msg: "Only admin is authorized."})
        }
        var exam = await Exam.findById(req.params.id)
        if(!exam){
            return res.status(400).json({msg: "Exam not found."})
        }
        const {title, routine} = req.body
        const newExam = new Exam({
            title,
            routine
        })
        const response = await Exam.findByIdAndUpdate(req.params.id, {$set: newExam}, {new: true})
        res.status(200).json({msg: "Exam updated successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete exam
router.delete('/:id',auth, async (req, res)=>{
    try{
        if(!auth.admin){
            return res.status(400).json({msg: "Only admin is authorized."})
        }
        var exam = await Exam.findById(req.params.id)
        if(!exam){
            return res.status(400).json({msg: "Exam not found."})
        }
        const response = await Exam.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Exam deleted successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


module.exports = router