export type UserRole = "admin" | "member";

export type User = {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
};

export type ProjectStatus = "Not Started" | "In Progress" | "Completed";

export type Comment = {
  text: string;
  userId: string;
  timestamp: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  assignedMembers: string[]; // Array of user IDs
  status: ProjectStatus;
  comments: Comment[];
};
