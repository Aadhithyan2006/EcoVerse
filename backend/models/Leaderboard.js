const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  score: { type: Number, default: 0 },
  rank: Number,
  weeklyScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
