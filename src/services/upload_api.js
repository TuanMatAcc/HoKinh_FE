import api from './client'

export const cloudinaryService = {
    // JSON contains params
    getSignature: (params) => api.post('/api/cloudinary/upload-signature', params),
    deleteImages: (publicIds) => api.post('/api/cloudinary/delete-images', publicIds)
}