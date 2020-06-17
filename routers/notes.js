const express = require('express')
const router = express.Router()
const multer = require('multer')
const Notes = require('../models/Notes')
const auth = require('../middlewares/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'files/notesFiles/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})


// get all notes
router.get('/', async (req, res)=>{
    try{
        const notes = await Notes.find({}).select('title std notesFile _id').exec()
        res.status(200).json({notes: notes})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get note by class
router.get('/std/:std', async (req, res)=>{
    try{
        const notes = await Notes.find({std: req.params.std}).select('title std notesFile _id').exec()
        res.status(200).json({notes: notes})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get note by id
router.get('/:id', async (req, res)=>{
    try{
        const note = await Notes.findById(req.params.id).select('title std notesFile _id').exec()
        res.status(200).json(note)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add note
router.post('/', upload.single('notesFile'), (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const note = new Notes({
            title: req.body.title,
            std: req.body.std,
            notesFile: req.file.path
        })

        note.save()
        res.status(201).json({msg: "Notes Saved."})

    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit note
router.put('/:id',upload.single('notesFile'), async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const newAssignment = new Notes({
            _id: req.params.id,
            title: req.body.title,
            std: req.body.std,
            notesFile: req.file.path
        })
        const note = await Notes.findByIdAndUpdate(req.params.id, {$set: newAssignment}, {new: true})
        res.status(200).json({msg: "Notes updated."})
    }catch(err){
        res.status(200).json({msg: "Server Error", error: err})
    }
})

// delete note
router.delete('/:id', async (req, res)=>{
    try{
        const response = await Notes.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Notes Deleted."})
    }catch(err){
        res.status(200).json({msg: "Server Error", error: err})
    }
})


module.exports = router