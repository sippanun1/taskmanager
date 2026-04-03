import axios from "axios";

// Create an Axios instance with the backend URL
// All API calls go through this instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Interceptor: automatically attach the JWT token to every request
// This runs BEFORE every request is sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth API ----
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// ---- Tasks API ----
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: string;
  dueDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const tasksAPI = {
  getAll: () => api.get<Task[]>("/tasks"),

  getOne: (id: number) => api.get<Task>(`/tasks/${id}`),

  create: (data: { title: string; description?: string; status?: string; priority?: string; dueDate?: string }) =>
    api.post<Task>("/tasks", data),

  update: (id: number, data: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, data),

  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;
