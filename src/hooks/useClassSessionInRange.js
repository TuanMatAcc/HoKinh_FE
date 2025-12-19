import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/session_api";
import { getAutoStatus } from "../utils/getAutoStatus";

export function useClassSessionInRange({classId, startDate, endDate}) {
    return useQuery({
        queryKey: ['sessions', classId, startDate, endDate],
        queryFn: () => sessionService.getManagementSession(startDate, endDate, classId),
        enabled: !!(classId && startDate && endDate),
        select: (data) => ({
            ...data,
            data: data.data.map((s) => ({
                ...s,
                autoStatus: getAutoStatus(s.startTime, s.endTime, s.date),
            }))
        }),
        staleTime: 60000 * 5
    });
}

export function useStudentInSession({sessionId}) {
    return useQuery({
        queryKey: ['session', 'students', sessionId],
        queryFn: () => sessionService.getStudentsInSession(sessionId),
        staleTime: 60000 * 5,
        enabled: !!sessionId
    });
}