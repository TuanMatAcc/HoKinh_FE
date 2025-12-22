import api from "./client"

export const sessionService = {
    createSessions: (facilityClassId, startDate, endDate, templates) => 
        api.post(
            '/api/session/admin/bulk-create-multi-day', 
            templates, 
            {
                params: {facilityClassId, startDate, endDate}
            }
        ),
    getManagementSession: (startDate, endDate, classId) => api.get(
        '/api/session/admin/session-user-data',
        {params: {startDate, endDate, classId}}
    ),
    getStudentsInSession: (sessionId) => api.get(
        `/api/session/admin/${sessionId}/student-data`
    ),
    createSessionAndUser: (session) => 
        api.post(
            '/api/session/admin', 
            session
        ),
    updateSessionAndUser: (sessionId, session) => 
        api.put(
            `/api/session/admin/${sessionId}`, 
            session
        ),
    deleteSessionAndUser: (sessionId) => 
        api.delete(
            `/api/session/admin/${sessionId}`
        ),
    getInstructorSessions: (startDate, endDate) => api.get(
        '/api/session/instructor/session-user-data',
        {params: {startDate, endDate}}
    ),
    reportSession: (updatedSession) => api.put(
        '/api/session/instructor/report-session',
        updatedSession
    ),
    getInstructorSessionStatistics: (facilityId, startDate, endDate) => api.get(
        '/api/session/admin/statistics-instructor-session',
        {params: {facilityId, startDate, endDate}}
    ),
    getSessionStatisticsForInstructor: (startDate, endDate) => api.get(
        '/api/session/instructor/session-statistics',
        {params: {startDate, endDate}}
    ),
    getScheduleForStudent: (startDate, endDate) => api.get(
        '/api/session/student/schedule',
        {params: {startDate, endDate}}
    ),
}