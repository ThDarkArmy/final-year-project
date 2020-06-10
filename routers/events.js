const express = require('express')
const router = express.Router()
const Event = require('../models/Event')

router.get('/', async (req, res)=>{
    try{
        const events = await Event.find({})
        res.status(200).json(events)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router