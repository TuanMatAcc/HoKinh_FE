import api from "./client"

export const awardService = {
    getDataHomepage: () => api.get('/api/award/homepage'),
    getAllDeletedAwards: () => api.get('/api/award/admin/all_deleted_awards'),
    create: (award) => api.post('/api/award/admin/add', award),
    update: (id, award) => api.put(`/api/award/admin/update/${id}`, award),
    patch: (id, updatedFields) => api.patch(`/api/award/admin/patch/${id}`, updatedFields),
    delete: (id) => api.delete(`/api/award/admin/delete/${id}`),
    deleteAll: () => api.delete(`/api/award/admin/delete_all`)
}