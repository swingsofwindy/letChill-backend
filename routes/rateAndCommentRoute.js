const express=require('express');
const {getRate, addRate}=require('../controllers/rateAndCommentController');

const router=express.Router();

//GET rate va comment
router.get('/:id', getRate);

//CREATE rate va comment
router.post('/:id', addRate);

module.exports=router;