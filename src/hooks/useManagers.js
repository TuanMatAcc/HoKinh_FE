import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_api";

export const useManagers = ({isActive}) => useQuery({
    queryKey: ["managers", "management", isActive],
    queryFn: () => userService.getAllManagers(isActive),
    staleTime: 60000 * 5,
});