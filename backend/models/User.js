const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  age: Number,
  grade: String,
  interests: [String],
  avatar: { type: String, default: 'U' },
  ecoScore: { type: Number, default: 0 },
  ecoCoins: { type: Number, default: 0 },
  badges: [{ name: String, icon: String, unlockedAt: Date }],
  achievements: [{ title: String, desc: String, icon: String, earnedAt: Date }],
  ecoTasks: [{ taskId: String, completedAt: Date }],
  completedLessons: [String],
  streak: { current: { type: Number, default: 0 }, lastActive: Date },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  unlockedWorlds: { type: [String], default: ['forest'] },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendInvites: [{ from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['pending','accepted','declined'], default: 'pending' }, sentAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };

module.exports = mongoose.model('User', userSchema);
