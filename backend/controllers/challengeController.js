const Challenge = require('../models/Challenge');
const { updateScore } = require('./userController');
const { updateLeaderboard } = require('./leaderboardController');

exports.getChallenges = async (req, res) => {
  try {
    res.json(await Challenge.find().select('-submissions'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitChallenge = async (req, res) => {
  try {
    const { challengeId, proof } = req.body;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (challenge.submissions.find(s => s.userId.toString() === req.user.id))
      return res.status(400).json({ message: 'Already submitted' });
    challenge.submissions.push({ userId: req.user.id, proof });
    await challenge.save();
    res.json({ message: 'Submission received, pending review' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveChallenge = async (req, res) => {
  try {
    const { challengeId, userId, status } = req.body;
    const challenge = await Challenge.findById(challengeId);
    const sub = challenge.submissions.find(s => s.userId.toString() === userId);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    sub.status = status;
    await challenge.save();
    if (status === 'approved') {
      await updateScore(userId, challenge.points);
      await updateLeaderboard(userId, challenge.points);
    }
    res.json({ message: `Submission ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
