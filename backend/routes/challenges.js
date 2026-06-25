const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getChallenges, submitChallenge, approveChallenge } = require('../controllers/challengeController');
router.get('/', auth, getChallenges);
router.post('/submit', auth, submitChallenge);
router.post('/approve', adminAuth, approveChallenge);
module.exports = router;
