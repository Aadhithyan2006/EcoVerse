const router = require('express').Router();
const auth = require('../middleware/auth');
const axios = require('axios');

router.get('/', auth, async (req, res) => {
  try {
    const { data } = await axios.get(`${process.env.AI_MODULE_URL}/recommend?userId=${req.user.id}`);
    res.json(data);
  } catch {
    res.status(503).json({ message: 'AI module unavailable', recommendations: [], tips: [], challenges: [] });
  }
});

module.exports = router;
