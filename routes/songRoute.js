const express = require('express');
const { getSongById, uploadSong, downloadSong, randomId, getAllSongs,
    updateSongProgress, getSongProgress, updateSongListenCount, getSongByCreatorId, deleteSong } = require('../controllers/songController');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/allsong', getAllSongs);

router.get('/random-id', randomId);

router.get('/:id/:uid', getSongById);

router.get('/:creatorId', getSongByCreatorId);

router.delete('/:id', deleteSong);

router.post('/upload', verifyToken, authorize(['CREATOR', 'ADMIN']), uploadSong);

router.get('/:id/download', verifyToken, authorize(['CREATOR']), downloadSong);

router.post('/progress/:id/:uid', updateSongProgress);

router.get('/progress/:id/:uid', getSongProgress);

router.post('/plays/:id', updateSongListenCount);


module.exports = router;