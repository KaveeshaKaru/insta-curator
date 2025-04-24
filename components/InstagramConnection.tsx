// components/InstagramConnection.tsx
"use client";

import { Instagram } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";

export default function InstagramConnection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for connection status
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [igId, setIgId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check connection status and query params on mount
  useEffect(() => {
    async function checkConnection() {
      try {
        // Get session using Better Auth
        const session = await auth.api.getSession({ headers: new Headers() });
        if (session?.user?.id) {
          // Fetch connection status from API or DB
          const response = await fetch("/api/instagram/username");
          const data = await response.json();
          if (data.username) {
            setIsConnected(true);
            setUsername(data.username);
            setIgId(searchParams.get("ig_id") || null);
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }

    const connected = searchParams.get("connected") === "true";
    const igIdParam = searchParams.get("ig_id");
    const error = searchParams.get("error");

    if (connected && igIdParam) {
      setIsConnected(true);
      setIgId(igIdParam);
      fetch("/api/instagram/username")
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
          }
        })
        .catch((err) => console.error("Failed to fetch username:", err));
    } else if (error) {
      if (error === "no_pages") {
        setErrorMessage(
          "No Facebook Pages found. Please create a Facebook Page and link it to an Instagram Business Account."
        );
      } else if (error === "no_instagram") {
        setErrorMessage(
          "Your Facebook Page isn’t linked to an Instagram Business Account. Please link them and try again."
        );
      } else if (error === "auth_failed") {
        setErrorMessage("Authentication failed. Please try again or contact support.");
      } else if (error === "no_code") {
        setErrorMessage("No authorization code provided.");
      } else if (error === "unauthorized") {
        setErrorMessage("You must be logged in to connect Instagram.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }

    checkConnection();
  }, [searchParams]);

  // Handle connect/reconnect
  const handleConnect = () => {
    router.push("/api/auth/instagram-login");
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      const session = await auth.api.getSession({ headers: new Headers() });
      if (session?.user?.id) {
        // Call API to clear tokens
        await fetch("/api/instagram/disconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        setIsConnected(false);
        setIgId(null);
        setUsername(null);
        setErrorMessage(null);
        router.push("/settings");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      setErrorMessage("Failed to disconnect. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center p-4 border rounded-lg">
        <div className="mr-4">
          <Instagram className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Instagram Business Account</h3>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <p className={`text-sm ${isConnected ? "text-green-600" : "text-muted-foreground"}`}>
            {isConnected
              ? `Connected${username ? ` (${username})` : igId ? ` (ID: ${igId})` : ""}`
              : "Not connected"}
          </p>
        </div>
        <div className="space-x-2">
          <Button onClick={handleConnect}>{isConnected ? "Reconnect" : "Connect"}</Button>
          {isConnected && (
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="space-y-2">
          <Label htmlFor="instagram-username">Instagram Username</Label>
          <Input
            id="instagram-username"
            value={username || ""}
            readOnly
            placeholder={username ? "" : "Fetching username..."}
          />
        </div>
      )}
    </div>
  );
}