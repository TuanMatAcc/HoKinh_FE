import api from "./client"

export const userService = {
  login: (user) => api.post('/api/user/login', user),
  create: (user) => api.post('/api/user/admin', user),
  update: (user) => api.put('/api/user/admin', user),
  createUsers: (users) => api.post('/api/user/admin/bulk-create', users),
  getActiveStudentByName: (searchKey, page, size) => api.get('/api/user/admin/active-students-by-name', {
    params: {searchKey, page, size}
  }),
  getActiveCoachInstructorByName: (searchKey, page, size) => api.get('/api/user/admin/active-coach-instructor-by-name', {
    params: {searchKey, page, size}
  }),
  updateUsers: (users, classId) => api.put('/api/user/admin/bulk-update', users, {params: {classId}}),
  createMemberForClass: (users, classId) => api.post(
    '/api/user/admin/create-member-for-class', 
    users, 
    {params: {classId}}
  ),
  getManagersAsOptions: () => api.get('/api/user/admin/all-manager-options'),
  
  // Special handling for import - must detect response type
  importUsers: async (formData) => {
    const response = await api.post('/api/user/admin/import', formData, {
      responseType: 'blob', // Always use blob to handle both cases
    });
    console.log(response);
    
    const contentType = response.headers['content-type'];
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      // Convert blob back to JSON
      const text = await response.data.text();
      const jsonData = JSON.parse(text);
      return { type: 'json', data: jsonData, headers: response.headers };
    } else {
      // It's an Excel file
      return { type: 'blob', data: response.data, headers: response.headers };
    }
  },
  getFacilityUsers: (facilityId, isActive, page, size) => api.get('/api/user/admin/get-facility-users', {params: {facilityId, isActive, page, size}}),
  getAllUsers: (isActive, page, size) => api.get('/api/user/admin/get-all-users', {params: {isActive, page, size}}),
  searchAllUsers: (searchKey, isActive, page, size) => api.get('/api/user/admin/search-all-users', {params: {searchKey, isActive, page, size}}),
  searchFacilityUsers: (facilityId, searchKey, isActive, page, size) => api.get('/api/user/admin/search-all-facility-users', {params: {facilityId, isActive, searchKey, page, size}}),
  searchNonFacilityStudents: (searchKey, isActive, page, size) => api.get('/api/user/admin/search-non-facility-students', {params: {searchKey, isActive, page, size}}),
  getNonFacilityStudents: (isActive, page, size) => api.get('/api/user/admin/get-non-facility-students', {params: {isActive, page, size}}),
  createManager: (managerData) => api.post('/api/user/admin/create-manager', managerData),
  deleteUserById: (deleteUserId) => api.delete('/api/user/admin/delete-user-by-id', {params: {deleteUserId}}),
  updateUser: (updatedUserDTO) => api.put('/api/user/admin/update-user', updatedUserDTO),
  updateUser: (userId, active) => api.put('/api/user/admin/update-user-active-status', null, {params: {userId, active}}),

}