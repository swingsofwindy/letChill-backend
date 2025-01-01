const express=require('express');
const {getLyrics, addLyrics}=require('../controllers/lyricsController');

const router=express.Router();

//
router.get('/:id', getLyrics);

//
router.patch('/', addLyrics)
module.exports=router;