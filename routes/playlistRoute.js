const express=require('express');
const { getPlaylist, updatePlaylist, addPlaylist, deletePlaylist}=require('../controllers/playlistController');

const router=express.Router();

//
router.get('/', getPlaylist);

//
router.post('/', addPlaylist);

//
router.patch('/', updatePlaylist);

//
router.delete('/', deletePlaylist);

module.exports=router;