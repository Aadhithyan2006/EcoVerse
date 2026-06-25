const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: String,
  type: { type: String, enum: ['video', 'text', 'game'], default: 'text' },
  contentURL: String,
  content: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  world: { type: String, enum: ['forest', 'ocean', 'city'], default: 'forest' },
  points: { type: Number, default: 10 },
  thumbnail: String,
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
