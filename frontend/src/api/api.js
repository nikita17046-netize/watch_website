import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3005', // Backend runs on 3005
  withCredentials: true,
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
