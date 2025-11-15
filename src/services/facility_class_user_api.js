import api from "./client"

export const facilityClassUserService = {
    getMemberForClass: (classId) => api.get(`/api/facility-class-user/active/${classId}`),
    getInactiveMemberForClass: (classId) => api.get(`/api/facility-class-user/in-active/${classId}`),
    createMembersForClass: (users) => api.post('/api/facility-class-user/bulk-create', users),
    updateUsersInClass: (users) => api.put('/api/facility-class-user/bulk-update', users)
}