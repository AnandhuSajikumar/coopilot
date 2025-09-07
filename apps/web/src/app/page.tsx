"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://backend:8000/ping")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg("Failed to reach backend"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Frontend says: {msg}</h1>
    </main>
  );
}
