const express = require('express')
const router = express.Router()
const Notice = require('../models/Notice')
const auth = require('../middlewares/check-auth')

// get all notices
router.get('/', async (req, res)=>{
    try{
        const notices = await Notice.find({}).select("title description date _id").exec()
        res.status(200).json({notices: notices})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// get notice by id
router.get('/:id', async (req, res)=>{
    try{
        const notice = await Notice.findById(req.params.id).select("title description date _id").exec()
        res.status(200).json(notice)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// add notice
router.post('/', (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        const {title, description, date} = req.body
        const newNotice = new Notice({
            title,
            description,
            date
        })
        newNotice.save();
        res.status(201).json({msg: "Notice added successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// edit notice
router.put('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var notice = await Notice.findById(req.params.id)
        if(!notice){
            return res.status(400).json({msg: "Notice not found."})
        }
        const {title, description, date} = req.body
        const newNotice = new Notice({
            _id: req.params.id,
            title,
            description,
            date
        })
        const response = await Notice.findByIdAndUpdate(req.params.id, {$set: newNotice}, {new: true})
        res.status(200).json({msg: "Notice updated successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

// delete notice
router.delete('/:id', async (req, res)=>{
    try{
        // if(!auth.admin){
        //     return res.status(400).json({msg: "Only admin is authorized."})
        // }
        var notice = await Notice.findById(req.params.id)
        if(!notice){
            return res.status(400).json({msg: "Notice not found."})
        }
        const response = await Notice.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Notice deleted successfully."})
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router