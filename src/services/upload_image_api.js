import axios from "axios";

const CLOUD_NAME = "dwbfba3vn"; // from Cloudinary

const API_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
const storage_api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
});

export const storageService = {
    uploadImage: (formData) => storage_api.post('/image/upload', formData)
}