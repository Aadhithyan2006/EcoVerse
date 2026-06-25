# EcoVerse: A Gamified Digital World for Sustainable Learning

## Quick Start

### Prerequisites
- Node.js 18+, Python 3.9+, MongoDB Atlas account

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 2. Seed Database
```bash
cd backend
node scripts/seed.js
```
Admin account: `admin@ecoverse.com` / `admin123`

### 3. AI Module
```bash
cd ai_module
cp .env.example .env
pip install -r requirements.txt
uvicorn ai_recommendation:app --reload --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Environment Variables

### backend/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecoverse
JWT_SECRET=your_jwt_secret_here
AI_MODULE_URL=http://localhost:8000
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_URL=http://localhost:8000
```

## Deployment
- Frontend → Vercel
- Backend → Render
- AI Module → Render (Python)
- Database → MongoDB Atlas
