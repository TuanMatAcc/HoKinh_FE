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
    staleTime: Infinity,
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
    staleTime: Infinity
});