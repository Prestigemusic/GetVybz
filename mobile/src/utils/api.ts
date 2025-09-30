// src/utils/api.ts
import axios from 'axios';

const BASE_URL = 'https://getvybz-backend-9imn.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log(`API Error: ${error.response?.status} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'Login failed',
      };
    } else if (error.request) {
      throw {
        status: 0,
        data: null,
        message: 'Network error. Please check your connection.',
      };
    } else {
      throw {
        status: 0,
        data: null,
        message: 'An unexpected error occurred.',
      };
    }
  }
};

export const signup = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/api/auth/signup', {
      name,
      email,
      password,
    });
    
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'Signup failed',
      };
    } else if (error.request) {
      throw {
        status: 0,
        data: null,
        message: 'Network error. Please check your connection.',
      };
    } else {
      throw {
        status: 0,
        data: null,
        message: 'An unexpected error occurred.',
      };
    }
  }
};

export default api;