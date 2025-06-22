// frontend/src/api/auth.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Changed from 5000 to 8000
  withCredentials: true,
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
