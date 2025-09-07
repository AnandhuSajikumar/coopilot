from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

@app.get("/health")
def health():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"ok": True, "db": result.scalar() == 1}
