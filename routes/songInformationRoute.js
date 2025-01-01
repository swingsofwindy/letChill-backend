const express = require('express');
const { getInformation, addSong } = require('../controllers/songInformationController');
const { getRandomSongId } = require('../controllers/songInformationController');
const router = express.Router();

//
router.get('/:id', getInformation);
//router.post('/', addSong);

// Thêm route trong router
router.get('/random-id', getRandomSongId);

module.exports = router;