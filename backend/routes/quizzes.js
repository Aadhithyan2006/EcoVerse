const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getQuizByLesson, submitQuiz, createQuiz } = require('../controllers/quizController');
router.get('/:lessonId', auth, getQuizByLesson);
router.post('/submit', auth, submitQuiz);
router.post('/', adminAuth, createQuiz);
module.exports = router;
