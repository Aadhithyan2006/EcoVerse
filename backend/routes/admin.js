const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const { getStats, getUsers, getPendingChallenges } = require('../controllers/adminController');
router.get('/stats', adminAuth, getStats);
router.get('/users', adminAuth, getUsers);
router.get('/pending-challenges', adminAuth, getPendingChallenges);
module.exports = router;
