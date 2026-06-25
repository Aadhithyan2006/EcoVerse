const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Quiz = require('../models/Quiz');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalChallenges, totalQuizzes] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Lesson.countDocuments(),
      Challenge.countDocuments(),
      Quiz.countDocuments(),
    ]);
    const topStudents = await User.find({ role: 'student' })
      .sort({ ecoScore: -1 }).limit(5).select('name ecoScore badges avatar');
    const pendingSubmissions = await Challenge.aggregate([
      { $unwind: '$submissions' },
      { $match: { 'submissions.status': 'pending' } },
      { $count: 'count' }
    ]);
    res.json({ totalUsers, totalLessons, totalChallenges, totalQuizzes, topStudents, pendingSubmissions: pendingSubmissions[0]?.count || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    res.json(await User.find({ role: 'student' }).select('-password'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingChallenges = async (req, res) => {
  try {
    res.json(await Challenge.find({ 'submissions.status': 'pending' }).populate('submissions.userId', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
