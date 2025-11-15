import api from "./client"

export const awardService = {
    getDataHomepage: () => api.get('/api/award/homepage'),
    getAllDeletedAwards: () => api.get('/api/award/all_deleted_awards'),
    create: (award) => api.post('/api/award/add', award),
    update: (id, award) => api.put(`/api/award/update/${id}`, award),
    patch: (id, updatedFields) => api.patch(`/api/award/patch/${id}`, updatedFields),
    delete: (id) => api.delete(`/api/award/delete/${id}`),
    deleteAll: () => api.delete(`/api/award/delete_all`)
}