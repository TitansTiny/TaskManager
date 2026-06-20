import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getTasks = () => API.get('/tasks');
export const getCompletedTasks = () => API.get('/tasks/completed');
export const createTask = (title: string, dueDate?: string) => API.post('/tasks', { title, dueDate });
export const updateTask = (id: number, data: Partial<Task>) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id: number) => API.delete(`/tasks/${id}`);

export interface Task {
  id: number;
  title: string;
  done: boolean;
  dueDate?: string;
}