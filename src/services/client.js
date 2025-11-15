import axios from "axios";

const API_BASE_URL = 'http://localhost:8088';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json'
    },
    timeout: 60000,
});

export default api;