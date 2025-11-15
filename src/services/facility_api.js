import api from "./client"

export const facilityService = {
    getDataHomepage: () => api.get('/api/facility/homepage'),
    getAllFacilitiesWebsiteManagement: () => api.get('api/facility/all-facilities-website-management'),
    getAllFacilitiesManagement: () => api.get('api/facility/all-facilities-management'),
    getAllInactiveFacilitiesManagement: () => api.get('api/facility/all-inactive-facilities-management'),
    create: (facility) => api.post('/api/facility/create', facility),
    update: (id, facility) => api.put(`/api/facility/update/${id}`, facility),
    softDelete: (id) => api.patch(`/api/facility/softDelete/${id}`),
    retrieve: (id) => api.patch(`/api/facility/softDelete/${id}`)
}

