const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const auth = require('../middlewares/check-auth')

// get all events
router.get('/', async (req, res)=>{
    try{
        const events = await Event.find({}).select("title description startDate duration").exec()
        res.status(200).json({events: events})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get event by id
router.get('/:id', async (req, res)=>{
    try{
        const event = await Event.findById(req.params.id).select("title description startDate duration").exec()
        res.status(200).json(event)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add event
router.post('/', (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        const {title, description, startDate, duration} = req.body
        const newEvent = new Event({
            title,
            description,
            startDate,
            duration
        })
        newEvent.save();
        res.status(201).json({msg: "Event added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit event
router.put('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var event = await Event.findById(req.params.id)
        if(!event){
            return res.status(400).json({msg: "Event not found."})
        }
        const {title, description, startDate, duration} = req.body
        const newEvent = new Event({
            _id: req.params.id,
            title,
            description,
            startDate,
            duration
        })
        const response = await Event.findByIdAndUpdate(req.params.id, {$set: newEvent}, {new: true})
        res.status(200).json({msg: "Event updated successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete event
router.delete('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var event = await Event.findById(req.params.id)
        if(!event){
            return res.status(400).json({msg: "Event not found."})
        }
        const response = await Event.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Event deleted successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})


module.exports = router