const express = require('express');
const { getPlaylist, updatePlaylist, createPlaylist, deletePlaylist } = require('../controllers/playlistController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', getPlaylist);

router.post('/', createPlaylist);

router.patch('/:id', verifyToken, updatePlaylist);

router.delete('/:id', verifyToken, deletePlaylist);

module.exports = router;