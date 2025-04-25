const express=require('express');
const {getRate, addRate, updateRate, deleteRate}=require('../controllers/rateAndCommentController');

const router=express.Router();

router.get('/:id', getRate);

router.post('/:id', addRate);

router.put('/:id', updateRate);

router.delete('/:id', deleteRate);

module.exports=router;