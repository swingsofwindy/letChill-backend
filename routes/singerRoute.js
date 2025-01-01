const express=require('express');
const {getSinger, createSinger}=require('../controllers/singerController');

const router=express.Router();

//GET thong tin nghe si
router.get('/:id', getSinger);

//
router.post('/',createSinger);

module.exports=router;