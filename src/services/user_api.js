import api from "./client"

export const userService = {
    login: (user) => api.post('/api/user/login', user),
    create: (user) => api.post('/api/user', user),
    update: (user) => api.put('/api/user', user),
    createUsers: (users) => api.post('/api/user/bulk-create', users),
    getActiveStudentByName: (searchKey, page, size) => api.get('/api/user/active-students-by-name', {
        params: {searchKey, page, size}
    }),
    getActiveCoachInstructorByName: (searchKey, page, size) => api.get('/api/user/active-coach-instructor-by-name', {
        params: {searchKey, page, size}
    }),
    updateUsers: (users) => api.put('/api/user/bulk-update', users),
    createMemberForClass: (users) => api.post('/api/user/create-member-for-class', users),
    getManagersAsOptions: () => api.get('/api/user/all-manager-options')
}