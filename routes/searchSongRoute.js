const express = require('express');
const getListSongs = require('../controllers/searchSongController');

const router = express.Router();

//
router.get('/:id', getListSongs);

module.exports = router;