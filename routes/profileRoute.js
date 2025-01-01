const express=require('express');
const {getProfile, updateProfile}=require('../controllers/profileController');

const router=express.Router();

//GET profile
router.get('/:id', getProfile);

//CREATE profile
router.patch('/', updateProfile);

module.exports=router;