from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import os

from .database import SessionLocal, engine
from .models import Base, Note
from .schemas import NoteCreate, NoteUpdate, NoteResponse

app = FastAPI()

# Enable CORS (for frontend ↔ backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---- Health + Ping ----
@app.get("/health")
def health():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"ok": True, "db": result.scalar() == 1}

@app.get("/ping")
def ping():
    return {"message": "pong from backend"}

# ---- Notes CRUD ----
@app.post("/notes", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes", response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

@app.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    return db.query(Note).filter(Note.id == note_id).first()

@app.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        return {"error": "Note not found"}
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        return {"error": "Note not found"}
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted"}
