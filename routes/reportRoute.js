// routes/report.js
const express = require("express");
const { sendReportEmail } = require("../controllers/reportController");
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/', verifyToken, authorize(['USER', 'CREATOR']), sendReportEmail);

module.exports = router;
