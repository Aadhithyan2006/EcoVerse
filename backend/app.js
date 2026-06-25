const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/oauth', require('./routes/oauth'));

// Invite link handler — redirects to register page
app.get('/join', (req, res) => {
  const ref = req.query.ref || '';
  res.redirect(`http://localhost:3001/register?ref=${ref}`);
});
app.use('/api/user', require('./routes/user'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/recommendation', require('./routes/recommendation'));
app.use('/api/terranova', require('./routes/terranova'));

app.get('/', (req, res) => res.json({ message: 'EcoVerse API running' }));

module.exports = app;
