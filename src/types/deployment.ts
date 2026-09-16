export type Environment = "Production" | "QA" | "Development" | "Staging";
export type Status = "Pending" | "In Progress" | "Completed" | "Failed";
export type StatusFilter = "All" | Status;
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: Environment;
  status: Status;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: Priority;
}
