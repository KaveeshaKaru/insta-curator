"use client";

import { useState, useEffect } from "react";

export default function InstagramUsername() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Try to load from localStorage first
    const storedConnection = localStorage.getItem('instagramConnection');
    if (storedConnection) {
      const connectionData = JSON.parse(storedConnection);
      if (connectionData.username) {
        setUsername(connectionData.username);
        return;
      }
    }

    // If not in localStorage, fetch from API
    fetch("/api/instagram/username")
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setUsername(data.username);
        }
      })
      .catch(error => {
        console.error("Error fetching Instagram username:", error);
      });
  }, []);

  return (
    <span className="font-medium">
      {username || "Not connected"}
    </span>
  );
} 