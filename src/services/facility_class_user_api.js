import api from "./client"

export const facilityClassUserService = {
    getMemberForClass: (classId) => api.get(`/api/facility-class-user/admin/active/${classId}`),
    getInactiveMemberForClass: (classId) => api.get(`/api/facility-class-user/admin/inactive/${classId}`),
    createMembersForClass: (users) => api.post('/api/facility-class-user/admin/bulk-create', users),
    updateUsersInClass: (users) => api.put('/api/facility-class-user/admin/bulk-update', users),
    deleteUsersInClass: (members, classId) =>
        api.delete('/api/facility-class-user/admin/delete-class-members', {
            params: { classId },
            data: members,
    })
}