import api from "./client"

export const facilityClassService = {
    create: (facilityClass) => api.post('/api/facility-class/create', facilityClass),
    update: (id, facilityClass) => api.put(`/api/facility-class/update/${id}`, facilityClass),
    updateClasses: (classes) => api.put('/api/facility-class/update-classes-website-management', classes),
    softDelete: (id) => api.patch(`/api/facility-class/softDelete/${id}`),
}

