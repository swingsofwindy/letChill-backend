// routes/report.js
const express = require("express");
const { sendReportEmail, createReportSong, getAllReport, deleteReport } = require("../controllers/reportController");
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/', verifyToken, authorize(['USER', 'CREATOR']), sendReportEmail);

router.post('/:id/:uid', createReportSong);

router.get('/', getAllReport);

router.delete('/:id', deleteReport);

module.exports = router;
