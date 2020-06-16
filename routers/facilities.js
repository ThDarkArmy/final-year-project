const express = require('express')
const router = express.Router()
const Facility = require('../models/Facility')
const auth = require('../middlewares/check-auth')

// get all facilities
router.get('/', async (req, res)=>{
    try{
        const facilities = await Facility.find({}).select("name description _id").exec()
        res.status(200).json({facilities: facilities})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get facility by id
router.get('/:id', async (req, res)=>{
    try{
        const facility = await Facility.findById(req.params.id).select("name description _id").exec()
        res.status(200).json(facility)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add facility
router.post('/', (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        const {name, description} = req.body
        const newFacility = new Facility({
            name,
            description,
        })
        newFacility.save();
        res.status(201).json({msg: "Facility added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit facility
router.put('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var facility = await Facility.findById(req.params.id)
        if(!facility){
            return res.status(400).json({msg: "Facility not found."})
        }
        const {name, description} = req.body
        const newFacility = new Facility({
            _id: req.params.id,
            name,
            description,
        })
        const response = await Facility.findByIdAndUpdate(req.params.id, {$set: newFacility}, {new: true})
        res.status(200).json({msg: "Facility updated successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete facility
router.delete('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var facility = await Facility.findById(req.params.id)
        if(!facility){
            return res.status(400).json({msg: "Facility not found."})
        }
        const response = await Facility.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Facility deleted successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router