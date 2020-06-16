const express = require('express')
const router = express.Router()
const Exam = require('../models/Exam')
const auth = require('../middlewares/check-auth')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'files/routineFiles/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

// get all exams
router.get('/', async (req, res)=>{
    try{
        const exams = await Exam.find({}).select("title std routine _id").exec()
        res.status(200).json({exams: exams})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get exam by class
router.get('/std/:std', async (req, res)=>{
    try{
        const exams = await Exam.find({std: req.params.std}).select('title std routine _id').exec()
        res.status(200).json({exams: exams})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get exam by id
router.get('/:id', async (req, res)=>{
    try{
        const exam = await Exam.findById(req.params.id).select('title std routine _id')
        res.status(200).json(exam)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add exam
router.post('/',upload.single('routine'), (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        console.log(req.body)
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const {title,std} = req.body
        const newExam = new Exam({
            title,
            std,
            routine: req.file.path
        })
        newExam.save();
        res.status(201).json({msg: "Exam added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit exam
router.put('/:id',upload.single('routine'), async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        
        var exam = await Exam.findById(req.params.id)
        if(!exam){
            return res.status(400).json({msg: "Exam not found."})
        }
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const {title,std} = req.body
        const newExam = new Exam({
            _id: req.params.id,
            title,
            std,
            routine: req.file.path
        })
        const response = await Exam.findByIdAndUpdate(req.params.id, {$set: newExam}, {new: true})
        res.status(200).json({msg: "Exam updated."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete exam
router.delete('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var exam = await Exam.findById(req.params.id)
        if(!exam){
            return res.status(400).json({msg: "Exam not found."})
        }
        const response = await Exam.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Exam deleted."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


module.exports = router