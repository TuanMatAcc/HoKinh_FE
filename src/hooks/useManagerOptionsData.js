import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_api";

export function useManagerOptions() {

    return useQuery({
        queryKey: ['mangers', 'options'],
        queryFn: () => userService.getManagersAsOptions(),
        staleTime: 60000*2
    });
}