import axios from 'axios';

// Get API base URL from environment, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
});

// Cafe API functions
export const getCafes = (location = '') => {
  const params = location ? { location } : {};
  return api.get('/cafes', { params });
};

export const createCafe = (data) => api.post('/cafes', data);
export const updateCafe = (id, data) => api.put(`/cafes/${id}`, data);
export const deleteCafe = (id) => api.delete(`/cafes/${id}`);

// Employee APIs
export const getEmployees = (cafe = '') => {
  const params = cafe ? { cafe } : {};
  return api.get('/employees', { params });
};

export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);


export default api;