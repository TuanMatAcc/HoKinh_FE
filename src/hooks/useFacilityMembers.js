import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_api";

export const useFacilityMember = ({facilityId, page, size, isActive}) => {
    let callAPI = () => userService.getFacilityUsers(facilityId, isActive, page, size);
    if(facilityId === 'none') {
        callAPI = () => userService.getNonFacilityStudents(isActive, page, size);
    }
    else if(facilityId === 'all') {
        callAPI = () => userService.getAllUsers(isActive, page, size);
    }
    
    return useQuery({
    queryKey: ['facility', 'members', facilityId, isActive, page, size],
    queryFn: callAPI,
    staleTime: 180000,
    enabled: (!! facilityId )
})}

export const useFacilityMemberBySearch = ({facilityId, searchKey, page, size, isActive, allowSearch}) => {
    console.log(searchKey);
    
    let callAPI = () => userService.searchFacilityUsers(facilityId, searchKey, isActive, page, size);
    if(facilityId === 'none') {
        callAPI = () => userService.searchNonFacilityStudents(searchKey, isActive, page, size);
    }
    else if(facilityId === 'all') {
        callAPI = () => userService.searchAllUsers(searchKey, isActive, page, size);
    }
    
    return useQuery({
    queryKey: ['facility', 'members', 'search', facilityId, searchKey, isActive, page, size],
    queryFn: callAPI,
    staleTime: 180000,
    enabled: !! (facilityId && searchKey && allowSearch)
})}