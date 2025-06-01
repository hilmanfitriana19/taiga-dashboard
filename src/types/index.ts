// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  taigaUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  taigaUrl: string;
}

export interface AuthResponse {
  auth_token: string;
  refresh: string;
  id: number;
  username: string;
  full_name: string;
  email: string;
}

// User types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  isPrivate: boolean;
  createdDate: string;
  totalStories?: number;
  totalTasks?: number;
  logoUrl?: string | null;
}

// Story types
export interface UserStory {
  id: number;
  ref: number;
  title: string;
  description: string;
  status: string;
  statusId: number;
  projectId: number;
  projectName?: string;
  createdDate: string;
  modifiedDate: string;
  assignedTo?: number | null;
  assignedToName?: string | null;
  priority?: number;
  priorityName?: string;
  timestamps?: number;
  startDate?: string | null;
  finishDate?: string | null;
  versionStory?: number;
  versionAttribute?: number;
  customAttributes?: {
    [key: string]: string;
  };
}

// Task types
export interface Task {
  id: number;
  ref: number;
  title: string;
  description: string;
  status: string;
  statusId: number;
  projectId: number;
  userStoryId: number | null;
  createdDate: string;
  modifiedDate: string;
  dueDate: string | null;
  assignedTo?: number | null;
  assignedToName?: string | null;
  userStoryTitle?: string;
}

// Status types
export interface Status {
  id: number;
  name: string;
  color: string;
  order: number;
}

// Priority types
export interface Priority {
  id: number;
  name: string;
  color: string;
  order: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  message?: string;
}