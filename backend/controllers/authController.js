const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, age, grade, interests, avatar } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, age, grade, interests, avatar });
    res.status(201).json({ token: signToken(user), user: { id: user._id, name, email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const today = new Date().toDateString();
    const last = user.streak.lastActive ? new Date(user.streak.lastActive).toDateString() : null;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      user.streak.current = last === yesterday ? user.streak.current + 1 : 1;
      user.streak.lastActive = new Date();
      await user.save();
    }

    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email, role: user.role, ecoScore: user.ecoScore, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
