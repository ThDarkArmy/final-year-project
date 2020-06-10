const express = require('express')
const router = express.Router()
const Holiday = require('../models/Holiday')

router.get('/', async (req, res)=>{
    try{
        const holidays = await Holiday.find({})
        res.status(200).json(holidays)
    }catch(err){
        res.status(500).json({msg: "Server Error", error: err})
    }
})

module.exports = router