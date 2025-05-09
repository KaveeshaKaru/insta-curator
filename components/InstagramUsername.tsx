"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";

export default function InstagramUsername() {
  const { data: session } = useSession();
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
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
        <AvatarFallback>
          {session?.user?.name
            ? session.user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
            : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{username || "Not connected"}</span>
      </div>
    </div>
  );
} 