const express = require('express');
const { upgradeSubscription, getSubscriptionStatus } = require('../controllers/subscriptionController');
const authorize = require('../middlewares/authorization');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/:id/upgrade', upgradeSubscription);

router.get('/:id/status', verifyToken, authorize(['CREATOR']), getSubscriptionStatus);

module.exports = router;