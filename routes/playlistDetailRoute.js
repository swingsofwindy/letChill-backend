const express = require('express');
const { getPlaylistDetail, addSongToPlaylist, deleteSongFromPlaylist } = require('../controllers/playlistDetailController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/:id', getPlaylistDetail);

router.patch('/:id', verifyToken, addSongToPlaylist);

router.delete('/:id', verifyToken, deleteSongFromPlaylist);

module.exports = router;