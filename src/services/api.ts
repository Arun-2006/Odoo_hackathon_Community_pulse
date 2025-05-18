import axios from 'axios';
import { apiConfig } from '../config/api';

const api = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiConfig.apiKey,
  },
});

// Add a request interceptor to ensure the API key is always up to date
api.interceptors.request.use((config) => {
  config.headers['x-api-key'] = apiConfig.apiKey;
  return config;
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., invalid API key)
        console.error('API key might be invalid or expired');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;