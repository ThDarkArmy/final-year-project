const express = require('express')
const router = express.Router()
const multer = require('multer')
const Solution = require('../models/Solution')
const Assignment = require('../models/Assignment')
const auth = require('../middlewares/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'files/solutionFiles/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

// get all solutions
router.get('/', async (req, res)=>{
    try{
        const solutions = await Solution.find({}).select("-__v").exec()
        res.status(200).json({solutions: solutions})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get solution by assignment
router.get('/assignment/:id',auth, async (req, res)=>{
    try{
        const solutions = await Solution.find({assignment: req.params.id}).select("-__v").exec()
        res.status(200).json(solutions)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get solution by id
router.get('/:id',auth, async (req, res)=>{
    try{
        const solution = await Solution.findById(req.params.id).select("-__v").exec()
        res.status(200).json(solution)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add solution
router.post('/', upload.single('solutionFile'), async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const assignment = await Assignment.findById(req.body.assignment)
        if(!assignment){
            return res.status(400).json({msg: "Assignment not found."})
        }
        const solution = new Solution({
            solutionFile: req.file.path,
            assignment: req.body.assignment,
            student: req.body.student,
            studentName: req.body.studentName
        })

        solution.save()
       
        res.status(201).json({msg: "Solution uploaded."})

    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit solution
router.put('/:id',upload.single('solutionFile'), async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        var solution = await Solution.findById(req.params.id)
        if(!solution){
            return res.status(401).json({msg: "Solution with this id doesn't exists."})
        }
        console.log(solution)
        const newSolution = new Solution({
            _id: req.params.id,
            title: req.body.title,
            solutionFile: req.file.path,
            assignment: solution.assignment,
            student: solution.student
        })
        solution = await Solution.findByIdAndUpdate(req.params.id, {$set: newSolution}, {new: true})
        res.status(200).json(solution)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete solution
router.delete('/:id',auth, async (req, res)=>{
    try{
        const response = await Solution.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(200).json({msg: "Server Error", error: err})
    }
})

module.exports = router