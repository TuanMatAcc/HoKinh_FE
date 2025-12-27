import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000';

const aiAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
});


export default aiAPI;