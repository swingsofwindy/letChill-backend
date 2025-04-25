const express = require('express');
const { getPlaylist, updatePlaylist, createPlaylist, deletePlaylist } = require('../controllers/playlistController');

const router = express.Router();

router.get('/', getPlaylist);

router.post('/', createPlaylist);

router.patch('/:id', updatePlaylist);

router.delete('/:id', deletePlaylist);

module.exports = router;