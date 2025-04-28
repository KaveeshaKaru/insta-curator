import { scheduler } from "@/lib/scheduler";

// Only initialize if we're on the server side
if (typeof window === "undefined") {
  // Check if scheduler is already running
  if (!scheduler.getStatus()) {
    console.log("Initializing scheduler...");
    scheduler.start().catch((error) => {
      console.error("Failed to start scheduler:", error);
    });
  } else {
    console.log("Scheduler is already running");
  }
} else {
  console.log("Scheduler not initialized (client-side)");
} 