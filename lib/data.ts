import { Project, User, ProjectStatus, Comment } from "@/types";

const USERS_KEY = "project_tracker_users";
const PROJECTS_KEY = "project_tracker_projects";
const CURRENT_USER_KEY = "project_tracker_current_user";

// Hardcoded users with passwords
const initialUsers: User[] = [
  { id: "user-1", username: "admin", password: "adminpassword", role: "admin" },
  { id: "user-2", username: "alice", password: "alicepassword", role: "member" },
  { id: "user-3", username: "bob", password: "bobpassword", role: "member" },
];

// Initial mock projects
const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Develop User Authentication",
    description: "Implement login, registration, and session management.",
    dueDate: "2025-08-15",
    assignedMembers: ["user-2"],
    status: "In Progress",
    comments: [{ text: "Started working on this.", userId: "user-2", timestamp: new Date().toISOString() }],
  },
  {
    id: "proj-2",
    title: "Design Database Schema",
    description: "Create ER diagrams and define tables for projects and users.",
    dueDate: "2025-08-20",
    assignedMembers: ["user-1", "user-3"],
    status: "Not Started",
    comments: [],
  },
  {
    id: "proj-3",
    title: "Build Admin Dashboard",
    description: "Develop UI for project creation and member assignment.",
    dueDate: "2025-08-25",
    assignedMembers: ["user-1"],
    status: "Not Started",
    comments: [],
  },
  {
    id: "proj-4",
    title: "Integrate Payment Gateway",
    description: "Connect with Stripe for secure payment processing.",
    dueDate: "2025-09-10",
    assignedMembers: ["user-2", "user-3"],
    status: "Not Started",
    comments: [],
  },
];

export function getUsers(): User[] {
  return initialUsers;
}

export function getProjects(): Project[] {
  if (typeof window === "undefined") return []; // Server-side check
  const storedProjects = localStorage.getItem(PROJECTS_KEY);
  if (storedProjects) {
    return JSON.parse(storedProjects);
  }
  // Initialize localStorage with mock data if not present
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
  return initialProjects;
}

export function saveProjects(projects: Project[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
}

export function addProject(newProjectData: Omit<Project, "id" | "status" | "comments">): Project {
  const projects = getProjects();
  const project: Project = {
    ...newProjectData,
    id: `proj-${Date.now()}`, // Simple unique ID
    status: "Not Started",
    comments: [],
  };
  projects.push(project);
  saveProjects(projects);
  return project;
}

export function updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
  const projects = getProjects();
  const projectIndex = projects.findIndex((p) => p.id === projectId);
  if (projectIndex > -1) {
    const updatedProject = { ...projects[projectIndex], ...updates };
    projects[projectIndex] = updatedProject;
    saveProjects(projects);
    return updatedProject;
  }
  return undefined;
}

export function deleteProject(projectId: string): void {
  const projects = getProjects();
  const filteredProjects = projects.filter((p) => p.id !== projectId);
  saveProjects(filteredProjects);
}

export function addCommentToProject(projectId: string, comment: Comment): Project | undefined {
  const projects = getProjects();
  const projectIndex = projects.findIndex((p) => p.id === projectId);
  if (projectIndex > -1) {
    const updatedProject = {
      ...projects[projectIndex],
      comments: [...projects[projectIndex].comments, comment],
    };
    projects[projectIndex] = updatedProject;
    saveProjects(projects);
    return updatedProject;
  }
  return undefined;
}

export function getCurrentUserFromLocalStorage(): User | null {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function saveCurrentUserToLocalStorage(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
}
