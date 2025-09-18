import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bns-ao5j.vercel.app/api', // Vercel backend
  withCredentials: true,
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
