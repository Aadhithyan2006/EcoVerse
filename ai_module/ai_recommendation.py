from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EcoVerse AI Recommendation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ecoverse")
client = MongoClient(MONGO_URI)
db = client["ecoverse"]

ECO_TIPS = [
    "Turn off lights when leaving a room to save energy.",
    "Carry a reusable water bottle to reduce plastic waste.",
    "Composting food scraps reduces landfill methane emissions.",
    "Cycling or walking short distances cuts carbon emissions.",
    "Buying local produce reduces transportation emissions.",
    "Unplug chargers when not in use to avoid phantom energy drain.",
    "Plant native species in your garden to support local biodiversity.",
    "Use cold water for laundry — it saves energy and works just as well.",
]

def get_level(score: int) -> str:
    if score < 100: return "beginner"
    if score < 500: return "intermediate"
    return "advanced"

@app.get("/recommend")
def recommend(userId: str):
    try:
        from bson import ObjectId
        user = db.users.find_one({"_id": ObjectId(userId)})
        if not user:
            return {"recommendations": [], "tips": ECO_TIPS[:2], "challenges": []}

        score = user.get("ecoScore", 0)
        completed = [str(l) for l in user.get("completedLessons", [])]
        level = get_level(score)

        # Recommend lessons not yet completed
        lessons = list(db.lessons.find({"difficulty": level}))
        recommended = [
            {"id": str(l["_id"]), "title": l["title"], "topic": l.get("topic"),
             "world": l.get("world"), "difficulty": l.get("difficulty"), "type": l.get("type")}
            for l in lessons if str(l["_id"]) not in completed
        ][:3]

        # Fill from next level if needed
        if len(recommended) < 3:
            next_level = "intermediate" if level == "beginner" else "advanced"
            for l in db.lessons.find({"difficulty": next_level}):
                if str(l["_id"]) not in completed and len(recommended) < 3:
                    recommended.append({"id": str(l["_id"]), "title": l["title"],
                        "topic": l.get("topic"), "world": l.get("world"),
                        "difficulty": l.get("difficulty"), "type": l.get("type")})

        # Recommend challenges
        done_tasks = [str(t["taskId"]) for t in user.get("ecoTasks", [])]
        challenges = [
            {"id": str(c["_id"]), "taskName": c["taskName"], "points": c["points"]}
            for c in db.challenges.find() if str(c["_id"]) not in done_tasks
        ][:2]

        tip_idx = score % len(ECO_TIPS)
        tips = [ECO_TIPS[tip_idx], ECO_TIPS[(tip_idx + 1) % len(ECO_TIPS)]]

        return {"userId": userId, "level": level, "recommendations": recommended, "challenges": challenges, "tips": tips}
    except Exception as e:
        return {"error": str(e), "recommendations": [], "tips": ECO_TIPS[:2], "challenges": []}

@app.get("/health")
def health():
    return {"status": "ok", "service": "EcoVerse AI Module"}
