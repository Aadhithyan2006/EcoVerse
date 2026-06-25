const Lesson = require('../models/Lesson');
const User = require('../models/User');
const { updateScore } = require('./userController');
const { updateLeaderboard } = require('./leaderboardController');

exports.getLessons = async (req, res) => {
  try {
    const { world, difficulty } = req.query;
    const filter = {};
    if (world) filter.world = world;
    if (difficulty) filter.difficulty = difficulty;
    res.json(await Lesson.find(filter));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const user = await User.findById(req.user.id);
    if (user.completedLessons.includes(lessonId))
      return res.json({ message: 'Already completed', alreadyDone: true });
    await User.findByIdAndUpdate(req.user.id, { $push: { completedLessons: lessonId } });
    const updated = await updateScore(req.user.id, lesson.points);
    await updateLeaderboard(req.user.id, lesson.points);
    res.json({ message: 'Lesson completed', pointsEarned: lesson.points, ecoScore: updated.ecoScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    res.status(201).json(await Lesson.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
