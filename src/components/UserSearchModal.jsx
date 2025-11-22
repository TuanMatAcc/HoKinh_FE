import { useState, useEffect } from "react";
import {
  X,
  Search,
  Phone,
  Calendar,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useSearchUsers from "../hooks/useSearchUsers";
import getBeltLabel from "../utils/formatBeltLevel";

const UserSearchModal = ({ isOpen, onClose, onSelectUser, typeSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const pageSize = 10; // Changed from 1 to 10

  const {
    isPending: isPendingSearch,
    error: errorSearch,
    data: mockUsers,
    refetch: refetchSearchUsers,
  } = useSearchUsers({
    typeSearch: typeSearch,
    searchQuery: searchQuery,
    currentPage: currentPage,
    isSearch: isSearch,
    pageSize: pageSize,
  });

  

  useEffect(() => {
    if (mockUsers && isSearch) {
        console.log(mockUsers);
      setIsSearch(false);
    }
  }, [mockUsers, isSearch]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  const handleSelectUser = (user) => {
    onSelectUser(user);
    setCurrentPage(1); // Reset to page 1 when selecting user
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on new search
    setIsSearch(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsSearch(true);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = mockUsers?.data?.totalPages || 0;
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const totalPages = mockUsers?.data?.totalPages || 0;
  const hasResults = mockUsers?.data?.content?.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl mt-20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Thêm Thành Viên</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Tìm kiếm thành viên
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên để tìm kiếm..."
              value={searchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
              autoFocus
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">
              Kết quả tìm kiếm ({mockUsers?.data?.totalElements || 0})
            </h3>
            {hasResults && (
              <span className="text-sm text-gray-500">
                Trang {currentPage}/{totalPages}
              </span>
            )}
          </div>

          {/* Results List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isPendingSearch ? (
              <div className="text-center py-8 text-gray-500">
                Đang tìm kiếm...
              </div>
            ) : hasResults ? (
              mockUsers?.data?.content.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                      {getInitials(user.name)}
                    </div>

                    {/* User Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 text-base">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {user.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          <span>{user.phoneNumber}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <UserCircle2 className="w-4 h-4" />
                          <span className="text-blue-600 font-medium">
                            {getBeltLabel(user.beltLevel)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(user.dateOfBirth)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleSelectUser(user)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Thêm
                  </button>
                </div>
              ))
            ) : searchQuery.trim().length > 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy kết quả
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nhập tên để tìm kiếm thành viên
              </div>
            )}
          </div>

          {/* Pagination */}
          {hasResults && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-10 h-10 rounded-lg font-medium transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
