const express = require('express')
const router = express.Router()
const multer = require('multer')
const TimeTable = require('../models/TimeTable')
const auth = require('../middlewares/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'timetableFiles/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

// get all routines
router.get('/', async (req, res)=>{
    try{
        const timetables = await TimeTable.find({})
        res.status(200).json(timetables)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


// get routine by class
router.get('/:std',auth, async (req, res)=>{
    try{
        const timetable = await TimeTable.findOne({std:req.params.std})
        res.status(200).json(timetable)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


// add routine
router.post('/:std',upload.single('timetablefile') ,auth, async (req, res)=>{
    try{
        if(!req.admin){
            return res.status(400).json({msg: "You are not authorized."})
        }
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        var timetable = await TimeTable.findOne({std: req.params.std})
        console.log(timetable)
        if(timetable){
            return res.status(400).json({msg: "Time table for this class already added."})
        }
        const newTimeTable = new TimeTable({
            timetablefile: req.file.path,
            std: req.body.std,
            validFrom: req.body.validFrom,
            validTill: req.body.validTill
        })
        newTimeTable.save()
        res.status(200).json(newTimeTable)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


// edit routine
router.put('/:id',upload.single('timetablefile') ,auth, async (req, res)=>{
    try{
        if(!req.admin){
            return res.status(400).json({msg: "You are not authorized."})
        }
        if(!req.file){
            return res.status(400).json({msg: "File not found."})
        }
        const timetable = await TimeTable.find({})
        if(!timetable){
            res.status(400).json({msg: "Time table with this id doesn't exist."})
        }
        const newTimeTable = new TimeTable({
            _id: req.params.id,
            timetablefile: req.file.path,
            std: req.body.std,
            validFrom: req.body.validFrom,
            validTill: req.body.validTill
        })
        const response = await TimeTable.findByIdAndUpdate(req.params.id, {$set: newTimeTable}, {new: true})
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete routine
router.delete('/:id',auth, async (req, res)=>{
    try{
        if(!req.admin){
            res.status(400).json({msg: "You are not authorized."})
        }
        
        const response = await TimeTable.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router