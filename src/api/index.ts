import axios from 'axios';

export const API_BASE_URL = "http://leave_request_app:80/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
