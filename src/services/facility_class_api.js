import api from "./client"

export const facilityClassService = {
    create: (facilityClass) => api.post('/api/facility-class/admin/create', facilityClass),
    update: (id, facilityClass) => api.put(`/api/facility-class/admin/update/${id}`, facilityClass),
    updateClasses: (classes) => api.put('/api/facility-class/admin/update-classes-website-management', classes),
    softDelete: (id) => api.patch(`/api/facility-class/admin/softDelete/${id}`),
}

