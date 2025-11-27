import api from "./client"

export const sessionService = {
    createSessions: (facilityClassId, startDate, endDate, templates) => 
        api.post(
            '/api/session/bulk-create-multi-day', 
            templates, 
            {
                params: {facilityClassId, startDate, endDate}
            }
        ),
    getManagementSession: (startDate, endDate, classId) => api.get(
        '/api/session/session-management',
        {params: {startDate, endDate, classId}}
    ),
    getStudentsInSession: (sessionId) => api.get(
        `/api/session/${sessionId}/students-management`
    ),
    createSessionAndUser: (session) => 
        api.post(
            '/api/session/create-management', 
            session
        ),
    updateSessionAndUser: (session) => 
        api.put(
            '/api/session/update-management', 
            session
        ),
}