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
  updateUsers: (users) => api.put('/api/user/admin/bulk-update', users),
  createMemberForClass: (users) => api.post('/api/user/admin/create-member-for-class', users),
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
  }
}