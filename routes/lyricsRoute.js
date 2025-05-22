const express=require('express');
const {getLyrics, addLyrics}=require('../controllers/lyricsController');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router=express.Router();

router.get('/:id/lyric', getLyrics);

router.patch('/:id/update-lyric', verifyToken, authorize(['CREATOR', 'ADMIN']), addLyrics)

module.exports=router;