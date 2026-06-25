const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  title: String,
  questions: [{
    question: String,
    type: { type: String, enum: ['mcq', 'scenario'], default: 'mcq' },
    options: [String],
    correctAnswer: Number,
    explanation: String,
  }],
  points: { type: Number, default: 20 },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
