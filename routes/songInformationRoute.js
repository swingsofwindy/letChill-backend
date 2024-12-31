const express=require('express');
const {getInformation, addSong}=require('../controllers/songInformationController');

const router=express.Router();

//
router.get('/', getInformation);
//router.post('/', addSong);

module.exports=router;