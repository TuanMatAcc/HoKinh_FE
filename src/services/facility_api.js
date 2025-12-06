import api from "./client"

export const facilityService = {
    getDataHomepage: () => api.get('/api/facility/homepage'),
    getAllFacilitiesWebsiteManagement: () => api.get('api/facility/admin/website-management'),
    getAllFacilitiesManagement: () => api.get('api/facility/admin/management'),
    getAllInactiveFacilitiesManagement: () => api.get('api/facility/admin/all-inactive-facilities-management'),
    create: (facility) => api.post('/api/facility/admin/create', facility),
    update: (id, facility) => api.put(`/api/facility/admin/update/${id}`, facility),
    softDelete: (id) => api.patch(`/api/facility/softDelete/${id}`),
    retrieve: (id) => api.patch(`/api/facility/softDelete/${id}`)
}

