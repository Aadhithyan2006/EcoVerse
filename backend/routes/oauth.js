const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'No credential provided' });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      const randomPw = crypto.randomBytes(20).toString('hex');
      user = await User.create({ name, email, password: randomPw, avatar: picture || '🧑', role: 'student' });
    }

    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, ecoScore: user.ecoScore, avatar: user.avatar } });
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.status(401).json({ message: 'Google sign-in failed. Invalid token.' });
  }
});

module.exports = router;

// Token-based route — frontend fetches userInfo from Google, sends it here
router.post('/google-token', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    let user = await User.findOne({ email });
    if (!user) {
      const randomPw = crypto.randomBytes(20).toString('hex');
      user = await User.create({ name: name || email.split('@')[0], email, password: randomPw, role: 'student' });
    }

    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, ecoScore: user.ecoScore },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
