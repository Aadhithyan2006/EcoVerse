const Quiz = require('../models/Quiz');
const { updateScore } = require('./userController');
const { updateLeaderboard } = require('./leaderboardController');

exports.getQuizByLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const safe = quiz.toObject();
    safe.questions = safe.questions.map(q => ({ ...q, correctAnswer: undefined }));
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return { question: q.question, isCorrect, explanation: q.explanation };
    });
    const score = Math.round((correct / quiz.questions.length) * quiz.points);
    const updated = await updateScore(req.user.id, score);
    await updateLeaderboard(req.user.id, score);
    res.json({ correct, total: quiz.questions.length, pointsEarned: score, results, ecoScore: updated.ecoScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    res.status(201).json(await Quiz.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
