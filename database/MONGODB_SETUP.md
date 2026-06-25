# MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → create free account
2. Create cluster (free M0 tier)
3. Database Access → create user with readWrite role
4. Network Access → add 0.0.0.0/0
5. Connect → Connect your application → copy URI
6. Paste as MONGO_URI in backend/.env

## Collections (auto-created)
- users, lessons, quizzes, challenges, leaderboards
