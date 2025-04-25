import { scheduler } from "./scheduler";

// Initialize the scheduler when the server starts
scheduler.start();

// Export a function to check if the scheduler is running
export function isSchedulerRunning() {
  return scheduler.getStatus();
} 