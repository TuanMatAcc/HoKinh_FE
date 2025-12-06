import api from './client'

export const cloudinaryService = {
    // JSON contains params
    getSignature: (params) => api.post('/api/cloudinary/admin/upload-signature', params),
    deleteImages: (publicIds) => api.post('/api/cloudinary/admin/delete-images', publicIds)
}