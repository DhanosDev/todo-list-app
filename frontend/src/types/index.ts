export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  user: string;
  parentTask?: string;
  createdAt: string;
  updatedAt: string;
  subtaskCount?: number;
  pendingSubtasks?: number;
  isSubtask?: boolean;
  isParentTask?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  task: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
