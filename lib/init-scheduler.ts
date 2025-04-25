import { scheduler } from "./scheduler";

// Only initialize if we're on the server side
if (typeof window === "undefined") {
  console.log("Initializing scheduler...");
  scheduler.start();
} 