// src/api/client.ts
import axios from 'axios';

// Base URL for your deployed backend on Render
const BASE_URL = 'https://getvybz-backend-9imn.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Client Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Client Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log(`API Client Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

export async function apiPost(endpoint: string, data: any) {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    console.error(`API POST error on ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function apiGet(endpoint: string) {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error(`API GET error on ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

export default apiClient;