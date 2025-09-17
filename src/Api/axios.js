import axios from "axios";

// Use environment variable for API URL, fallback to deployed server, then local for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
//deploy server.j on render.com
                      'https://amazon-clone-frontend-deploy-jr6w.onrender.com/' ||
                      'http://localhost:5003';

const axiosinstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
axiosinstance.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosinstance.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.message, error.config?.url);
        return Promise.reject(error);
    }
);

export default axiosinstance;
