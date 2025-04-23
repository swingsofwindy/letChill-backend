const express = require('express');
const { getSongById, createSong } = require('../controllers/songController');
const { getRandomSongId } = require('../controllers/songController');
const router = express.Router();

//
router.get('/:id', getSongById);

//
router.post('/', createSong);

// Thêm route trong router
router.get('/', getRandomSongId);

module.exports = router;