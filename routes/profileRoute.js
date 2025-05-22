const express=require('express');
const {getProfile, updateProfile}=require('../controllers/profileController');

const router=express.Router();

router.get('/:id', getProfile);

router.patch('/:id', updateProfile);

module.exports=router;