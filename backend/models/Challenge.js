const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: String,
  proofType: { type: String, enum: ['photo', 'text', 'both'], default: 'text' },
  points: { type: Number, default: 50 },
  world: String,
  submissions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proof: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
