from fastapi import FastAPI
from sqlalchemy import create_engine, text
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Enable CORS [Cross Orgin Resource Sharing] (so frontend can call backend in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev: allow all, restrict later in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read DB connection string from environment
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

@app.get("/health")
def health():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"ok": True, "db": result.scalar() == 1}

@app.get("/ping")
def ping():
    return {"message": "pong from backend"}
