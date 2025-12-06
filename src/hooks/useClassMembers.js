import { useQuery } from "@tanstack/react-query";
import { facilityClassUserService } from "../services/facility_class_user_api";

export const useActiveClassMembers = ({classId}) => useQuery({
    queryKey: ["members", "active", classId],
    queryFn: () => facilityClassUserService.getMemberForClass(classId),
    enabled: !!classId , // fetch only when id exists
    select: (data) =>
      data.data.reduce((mem, user) => {
        const type = user.roleInClass;
        if (!mem[type]) mem[type] = [];
        mem[type].push(user);
        return mem;
      }, {}),
    staleTime: 60000 * 5,
});

export const useInactiveClassMembers = ({classId}) => useQuery({
    queryKey: ["members", "inactive", classId],
    queryFn: () => facilityClassUserService.getInactiveMemberForClass(classId),
    enabled: !!classId, // fetch only when id exists
    select: (data) =>
      data.data.reduce((mem, user) => {
        const type = user.roleInClass;
        if (!mem[type]) mem[type] = [];
        mem[type].push(user);
        return mem;
      }, {}),
    staleTime: 60000 * 5
});

export const deleteActiveClassMembers = ({classId, memIds, queryClient}) => queryClient.setQueryData(
  ['members', 'active', classId],
  prev => {
    if(!prev) return prev;
    return ({
      ...prev,
      data: prev.data.filter(mem => !memIds.includes(mem.id))
    });
  }
)

export const deleteInactiveClassMembers = ({classId, memIds, queryClient}) => queryClient.setQueryData(
  ['members', 'inactive', classId],
  prev => {
    if(!prev) return prev;
    return ({
      ...prev,
      data: prev.data.filter(mem => !memIds.includes(mem.id))
    });
  }
)