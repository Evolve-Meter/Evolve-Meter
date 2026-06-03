export type UserRole = "Teacher" | "Parent" | "Child";

export type MojoCategory =
  | "Learning"
  | "Nutrition"
  | "Safety"
  | "Wellbeing"
  | "Tools"
  | "Restoration"
  | "Care"
  | "Mobility";

export type NeedsLevel = "Low" | "Medium" | "High";
export type NeedStatus = "Active" | "Fulfilled" | "In Progress";

export interface Need {
  id: string;
  target: "self" | "student";
  description: string;
  urgency: NeedsLevel;
  category: MojoCategory | string;
  joulesNeeded: number;
  joulesFulfilled: number;
  status: NeedStatus | string;
  createdAt: string | Date;
}

export interface MeterStats {
  meterId: string;
  totalNeeded: number;
  totalFulfilled: number;
  totalGenerated: number;
  actionsCount: number;
  referralCount: number;
}
