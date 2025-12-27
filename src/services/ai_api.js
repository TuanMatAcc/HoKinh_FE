import aiAPI from "./ai_client";
import api from "./client";

export const botAPI = {
    ask: (askContent) => aiAPI.post('/ask', askContent)
};

export const fileStoreAPI = {
  // Get all files from vector store
  getFiles: async () => {
    const response = await api.get('/api/bot-files');
    return response.data;
  },

  // Upload file to Spring Boot, which will forward to Python for vectorization
  uploadFile: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/bot-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await api.delete(`api/bot-files/${fileId}`);
    return response.data;
  },

  // Reindex file (trigger re-vectorization)
  reindexFile: async (fileId) => {
    const response = await api.post(`api/bot-files/${fileId}/reindex`);
    return response.data;
  },

  // Get file details
  getFileDetails: async (fileId) => {
    const response = await api.get(`api/bot-files/${fileId}`);
    return response.data;
  },
};