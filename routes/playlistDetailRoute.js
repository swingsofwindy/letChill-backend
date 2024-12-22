const express=require('express');
const { getPlaylistDetail, addSongToPlaylist, deleteSongFromPlaylist}=require('../controllers/playlistDetailController');

const router=express.Router();

//
router.get('/', getPlaylistDetail);

//
router.patch('/', addSongToPlaylist);

//
router.delete('/', deleteSongFromPlaylist);

module.exports=router;