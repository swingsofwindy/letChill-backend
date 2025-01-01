const express=require('express');
const { getPlaylistDetail, addSongToPlaylist, deleteSongFromPlaylist}=require('../controllers/playlistDetailController');

const router=express.Router();

//
router.get('/:id', getPlaylistDetail);

//
router.patch('/:id', addSongToPlaylist);

//
router.delete('/:id', deleteSongFromPlaylist);

module.exports=router;