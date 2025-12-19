import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/session_api";

export const useSessionStatistics = (facilityId, startDate, endDate) => useQuery({
    queryKey: ['session', 'statistics', 'management', facilityId, startDate, endDate],
    queryFn:() => sessionService.getInstructorSessionStatistics(facilityId, startDate, endDate),
    staleTime: 60000*5,
    enabled: !!(facilityId && startDate && endDate)
});