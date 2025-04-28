const express=require('express');
const {getRate, getRateBySongId, addRate, updateRate, deleteRate}=require('../controllers/rateAndCommentController');

const router=express.Router();

router.get('/', getRate);

router.get('/:id', getRateBySongId);

router.post('/:id', addRate);

router.put('/:id', updateRate);

router.delete('/:id', deleteRate);

module.exports=router;