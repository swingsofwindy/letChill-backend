const express = require('express');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');
const { getSinger, createSinger, updateSinger, deleteSinger,
    getSongsByArtist, checkFollowSinger, addFollowSinger,
    removeFollowSinger, getAllSingers, getFollowedSingersByUser } = require('../controllers/singerController');

const router = express.Router();
router.get('/singer/followed/:uid', getFollowedSingersByUser);

router.get('/:id', getSinger);

router.get('/', getAllSingers);

router.post('/', verifyToken, authorize(['ADMIN']), createSinger);

router.patch('/:id', verifyToken, authorize(['ADMIN', 'CREATOR']), updateSinger);

router.delete('/:id', verifyToken, authorize(['ADMIN']), deleteSinger);

router.get('/:singerId/songs', getSongsByArtist);

router.get('/:id/follows/:uid', checkFollowSinger);

router.post('/:id/follows/:uid', addFollowSinger);

router.delete('/:id/follows/:uid', removeFollowSinger);


module.exports = router;