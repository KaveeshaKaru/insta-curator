// components/InstagramConnection.tsx
"use client";

import { Instagram } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";

// Type for stored connection data
type StoredConnection = {
  isConnected: boolean;
  username: string | null;
  igId: string | null;
};

export default function InstagramConnection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for connection status
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [igId, setIgId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load stored connection on mount and handle OAuth callback
  useEffect(() => {
    async function initializeConnection() {
      try {
        // Check for OAuth callback parameters first
        const connected = searchParams.get("connected") === "true";
        const igIdParam = searchParams.get("ig_id");
        const error = searchParams.get("error");

        if (connected && igIdParam) {
          // Handle successful OAuth callback
          const response = await fetch("/api/instagram/username");
          const data = await response.json();
          
          if (data.username) {
            // Store the connection details
            const connectionData: StoredConnection = {
              isConnected: true,
              username: data.username,
              igId: igIdParam
            };
            localStorage.setItem('instagramConnection', JSON.stringify(connectionData));
            
            // Update state
            setIsConnected(true);
            setUsername(data.username);
            setIgId(igIdParam);
          }
        } else if (error) {
          // Handle OAuth errors
          const errorMessages: { [key: string]: string } = {
            no_pages: "No Facebook Pages found. Please create a Facebook Page and link it to an Instagram Business Account.",
            no_instagram: "Your Facebook Page isn't linked to an Instagram Business Account. Please link them and try again.",
            auth_failed: "Authentication failed. Please try again or contact support.",
            no_code: "No authorization code provided.",
            unauthorized: "You must be logged in to connect Instagram.",
          };
          setErrorMessage(errorMessages[error] || "An error occurred. Please try again.");
        } else {
          // No OAuth parameters, try to load from localStorage
          const storedConnection = localStorage.getItem('instagramConnection');
          if (storedConnection) {
            const connectionData: StoredConnection = JSON.parse(storedConnection);
            setIsConnected(connectionData.isConnected);
            setUsername(connectionData.username);
            setIgId(connectionData.igId);
          }
        }
      } catch (error) {
        console.error("Error initializing connection:", error);
        setErrorMessage("Failed to initialize Instagram connection");
      }
    }

    initializeConnection();
  }, [searchParams]);

  // Handle connect/reconnect
  const handleConnect = () => {
    setErrorMessage(null);
    // Clear stored connection before reconnecting
    localStorage.removeItem('instagramConnection');
    router.push("/api/auth/instagram-login");
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Get the stored connection data
      const storedConnection = localStorage.getItem('instagramConnection');
      if (!storedConnection) {
        setErrorMessage("No active connection found");
        return;
      }

      const response = await fetch("/api/instagram/disconnect", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to disconnect");
      }

      // Clear stored connection
      localStorage.removeItem('instagramConnection');
      
      // Reset state
      setIsConnected(false);
      setIgId(null);
      setUsername(null);
      
      // Force a page refresh to ensure clean state
      window.location.href = "/settings";
    } catch (error) {
      console.error("Error disconnecting:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to disconnect. Please try again."
      );
    } finally {
      setIsLoading(false);
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
          <Button onClick={handleConnect} disabled={isLoading}>
            {isConnected ? "Reconnect" : "Connect"}
          </Button>
          {isConnected && (
            <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}>
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