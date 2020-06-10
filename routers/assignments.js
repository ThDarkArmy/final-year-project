const express = require('express')
const router = express.Router()
const multer = require('multer')
const Assignment = require('../models/Assignment')
const auth = require('../middlewares/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'assignmentFiles/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})


// get all assignments
router.get('/', async (req, res)=>{
    try{
        const assignments = await Assignment.find({}).populate('solutions', 'title solutionFile _id').exec()
        res.status(200).json(assignments)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get assignment by class
router.get('/std/:std', async (req, res)=>{
    try{
        const assignments = await Assignment.find({std: req.params.std})
        res.status(200).json(assignments)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get assignment by id
router.get('/:id', async (req, res)=>{
    try{
        const assignment = await Assignment.findById(req.params.id)
        res.status(200).json(assignment)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add assignment
router.post('/:std', upload.single('assignmentFile'),auth, (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const assignment = new Assignment({
            title: req.body.title,
            std: req.body.std,
            assignmentFile: req.file.path
        })

        assignment.save()
        res.status(201).json({msg: "Assignment Saved."})

    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit assignment
router.put('/:id',upload.single('assignmentFile'), auth, async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const newAssignment = new Assignment({
            _id: req.params.id,
            title: req.body.title,
            std: req.body.std,
            assignmentFile: req.file.path
        })
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, {$set: newAssignment}, {new: true})
        res.status(200).json(assignment)
    }catch(err){
        res.status(200).json({msg: "Server Error", error: err})
    }
})

// delete assignment
router.delete('/:id',auth, async (req, res)=>{
    try{
        const response = await Assignment.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(200).json({msg: "Server Error", error: err})
    }
})


module.exports = router