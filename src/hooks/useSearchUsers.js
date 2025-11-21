import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_api";

const useSearchUsers = ({typeSearch, isSearch, searchQuery, currentPage, pageSize}) => useQuery({
    queryKey: [
      "users",
      "search",
      typeSearch,
      searchQuery,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      typeSearch === "students"
        ? userService.getActiveStudentByName(
            searchQuery,
            currentPage - 1,
            pageSize
          )
        : userService.getActiveCoachInstructorByName(
            searchQuery,
            currentPage - 1,
            pageSize
          ),
    enabled: isSearch,
    staleTime: 60000 * 5,
  });

export default useSearchUsers;