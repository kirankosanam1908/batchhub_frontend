// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://batchhub-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If server uses cookie sessions & you need credentials:
  // withCredentials: true,
});

// helper to attach token when available
export const attachToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
