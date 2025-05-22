const express = require('express');
const { getSongById, uploadSong, downloadSong, randomId } = require('../controllers/songController');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/random-id', randomId);

router.get('/:id', getSongById);

router.post('/upload', verifyToken, authorize(['CREATOR', 'ADMIN']), uploadSong);

router.get('/:id/download', verifyToken, authorize(['CREATOR']), downloadSong);

module.exports = router;