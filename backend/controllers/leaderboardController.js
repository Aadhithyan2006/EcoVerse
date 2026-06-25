const Leaderboard = require('../models/Leaderboard');

exports.updateLeaderboard = async (userId, points) => {
  await Leaderboard.findOneAndUpdate(
    { userId },
    { $inc: { score: points, weeklyScore: points } },
    { upsert: true, new: true }
  );
  const all = await Leaderboard.find().sort({ score: -1 });
  for (let i = 0; i < all.length; i++) {
    await Leaderboard.findByIdAndUpdate(all[i]._id, { rank: i + 1 });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const board = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(50)
      .populate('userId', 'name avatar ecoScore badges');
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
