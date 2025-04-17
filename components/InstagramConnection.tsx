// components/InstagramConnection.tsx
"use client";

import { Instagram } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function InstagramConnection() {
  const searchParams = useSearchParams();
  const isConnected = searchParams.get("connected") === "true";
  const igId = searchParams.get("ig_id");

  return (
    <div className="space-y-4">
      <div className="flex items-center p-4 border rounded-lg">
        <div className="mr-4">
          <Instagram className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Instagram Business Account</h3>
          <p className={`text-sm ${isConnected ? "text-green-600" : "text-muted-foreground"}`}>
            {isConnected ? `Connected (ID: ${igId})` : "Not connected"}
          </p>
        </div>
        <Button onClick={() => (window.location.href = "/api/auth/instagram-login")}>
          {isConnected ? "Reconnect" : "Connect"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram-username">Instagram Username</Label>
        <Input id="instagram-username" placeholder="@yourusername" />
      </div>
    </div>
  );
}