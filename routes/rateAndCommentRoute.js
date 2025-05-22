const express=require('express');
const {getRate, getRateBySongId, addRate, updateRate, deleteRate}=require('../controllers/rateAndCommentController');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router=express.Router();

router.get('/community', verifyToken, authorize(['USER', 'CREATOR']), getRate);

router.get('/', verifyToken, authorize(['USER', 'CREATOR']), getRateBySongId);

router.post('/', verifyToken, authorize(['USER', 'CREATOR']), addRate);

router.put('/:id', verifyToken, authorize(['USER', 'CREATOR']), updateRate);

router.delete('/:id', verifyToken, authorize(['USER', 'CREATOR']), deleteRate);

module.exports=router;