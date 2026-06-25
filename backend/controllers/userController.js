const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('followers','name avatar').populate('following','name avatar');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, age, grade, interests, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio, age, grade, interests, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addBadge = async (userId, badge) => {
  await User.findByIdAndUpdate(userId, { $push: { badges: { ...badge, unlockedAt: new Date() } } });
};

exports.updateScore = async (userId, points) => {
  const user = await User.findByIdAndUpdate(userId, { $inc: { ecoScore: points, ecoCoins: Math.floor(points / 5) } }, { new: true });
  const milestones = [
    { score: 100, name: 'Eco Starter', icon: 'fa-solid fa-seedling' },
    { score: 500, name: 'Green Guardian', icon: 'fa-solid fa-shield-halved' },
    { score: 1000, name: 'Earth Champion', icon: 'fa-solid fa-earth-americas' },
    { score: 5000, name: 'Eco Legend', icon: 'fa-solid fa-trophy' },
  ];
  for (const m of milestones) {
    if (user.ecoScore >= m.score && !user.badges.find(b => b.name === m.name)) {
      await exports.addBadge(userId, { name: m.name, icon: m.icon });
    }
  }
  return user;
};

exports.followUser = async (req, res) => {
  try {
    const { targetId } = req.body;
    if (targetId === req.user.id) return res.status(400).json({ message: 'Cannot follow yourself' });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user.id } });
    res.json({ message: 'Followed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.sendInvite = async (req, res) => {
  try {
    const { targetId } = req.body;
    await User.findByIdAndUpdate(targetId, { $push: { friendInvites: { from: req.user.id } } });
    res.json({ message: 'Invite sent' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
