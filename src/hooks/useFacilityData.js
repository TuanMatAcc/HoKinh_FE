import { useQuery } from "@tanstack/react-query";
import { facilityService } from "../services/facility_api";

export function useFacility() {

    return useQuery({
        queryKey: ['facilities', 'management'],
        queryFn: () => facilityService.getAllFacilitiesManagement(),
        staleTime: 60000 * 5
    });
}