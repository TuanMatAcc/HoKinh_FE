import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/session_api";
import { sessionUserService } from "../services/session_user_api";

export function useInstructorSessionInRange({startDate, endDate}) {
    return useQuery({
        queryKey: ['sessions', 'instructor', startDate, endDate],
        queryFn: () => sessionService.getInstructorSessions(startDate, endDate),
        select: (data) => {
            // Group sessions by their dates
            const res = data.data.reduce((groupDate, session) => {
                const sessionDate = session.date;

                if(!groupDate.has(sessionDate)) {
                    groupDate.set(sessionDate, []);
                }

                groupDate.get(sessionDate).push(session);
                
                return groupDate;
            }, new Map());
            // Sort by start time of session
            for(const [date, sessions] of res) {
                sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
            return res;
        },
        enabled: !!(startDate && endDate),
        staleTime: 60000 * 5
    });
}

export function useStudentInstructorSession({sessionId}) {
    return useQuery({
        queryKey: ['session', 'instructor', 'students', sessionId],
        queryFn: () => sessionUserService.getInstructorSessionStudents(sessionId),
        staleTime: 60000 * 5,
        enabled: !!sessionId
    });
}