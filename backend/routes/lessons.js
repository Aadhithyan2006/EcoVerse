const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getLessons, getLesson, completeLesson, createLesson } = require('../controllers/lessonController');
router.get('/', auth, getLessons);
router.get('/:id', auth, getLesson);
router.post('/complete', auth, completeLesson);
router.post('/', adminAuth, createLesson);
module.exports = router;
