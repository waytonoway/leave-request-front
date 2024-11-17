import axios from 'axios';

export const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// TODO handle errors nicely
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 400) {
            console.error('Bad Request (400):', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
