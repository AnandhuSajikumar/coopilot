"use client";

import { useState, useEffect } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    if (!title || !content) return;
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
      if (res.ok) fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const updateNote = async () => {
    if (!editingNote) return;
    try {
      const res = await fetch(`${API_URL}/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setEditingNote(null);
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notes</h1>

      <div className="space-y-2">
        <input
          className="border rounded p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded p-2 w-full"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {editingNote ? (
          <div className="flex space-x-2">
            <button
              onClick={updateNote}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              onClick={() => {
                setEditingNote(null);
                setTitle("");
                setContent("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Note
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded p-4">
            <h2 className="font-semibold">{note.title}</h2>
            <p>{note.content}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => startEdit(note)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
