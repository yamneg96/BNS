import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true, // keep this if you plan to use cookies
});

// Attach token automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
