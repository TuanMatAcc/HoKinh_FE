import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_api";

export const useFacilityMember = (facilityId) => useQuery({
    queryKey: ['facility', 'members', facilityId],
    queryFn: () => userService.getFacilityUsers(facilityId),
    staleTime: 300000,
    enabled: !! facilityId
})