const express = require('express');
const getListSongs = require('../controllers/searchSongController');

const router = express.Router();

//
router.get('/', getListSongs);

module.exports = router;