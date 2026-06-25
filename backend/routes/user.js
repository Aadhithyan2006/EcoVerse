const router = require('express').Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, followUser, sendInvite } = require('../controllers/userController');
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/follow', auth, followUser);
router.post('/invite', auth, sendInvite);

// Photo upload — stores as base64 data URL (no external storage needed)
router.post('/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body; // base64 data URL from frontend
    if (!avatar) return res.status(400).json({ message: 'No image provided' });
    if (avatar.length > 3500000) return res.status(400).json({ message: 'Image too large (max ~2MB)' });
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true }).select('-password');
    res.json({ avatar: user.avatar, message: 'Photo updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
