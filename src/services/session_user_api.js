import api from "./client"

export const sessionUserService = {
    getInstructorSessionStudents: (sessionId) => api.get(
        '/api/session-users/instructor/student-data',
        {params: {sessionId}}
    ),
    checkIn: (requestCheckIn) => api.put(
        '/api/session-users/instructor/checkin',
        requestCheckIn
    )
}