import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getTasks = () => API.get('/tasks');
export const createTask = (title: string) => API.post('/tasks', { title });
export const updateTask = (id: number, done: boolean) => API.put(`/tasks/${id}`, { done });
export const deleteTask = (id: number) => API.delete(`/tasks/${id}`);