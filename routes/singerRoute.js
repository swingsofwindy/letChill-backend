const express=require('express');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');
const {getSinger, createSinger, updateSinger, deleteSinger}=require('../controllers/singerController');

const router=express.Router();

router.get('/:id', getSinger);

router.post('/', verifyToken, authorize(['ADMIN']), createSinger);

router.patch('/:id', verifyToken, authorize(['ADMIN','CREATOR']), updateSinger);

router.delete('/:id', verifyToken, authorize(['ADMIN']), deleteSinger);

module.exports=router;