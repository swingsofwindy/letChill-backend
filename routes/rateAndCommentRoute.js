const express=require('express');
const {getRate, addRate}=require('../controllers/rateAndCommentController');

const router=express.Router();

//GET rate va comment
router.get('/', getRate);

//CREATE rate va comment
router.post('/', addRate);

module.exports=router;