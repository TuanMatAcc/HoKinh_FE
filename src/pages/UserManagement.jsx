import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Save, X, Users, ChevronRight, ChevronLeft, Trash2, Edit, Power } from "lucide-react";
import { useFacilityMember, useFacilityMemberBySearch } from "../hooks/useFacilityMembers";
import { ThreeDotLoader } from "../components/ActionFallback";
import { userService } from "../services/user_api";
import { useFacility } from "../hooks/useFacilityData";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useQueryClient } from "@tanstack/react-query";
import AnnouncementUI from "../components/Announcement";
import SuccessAnnouncement from "../components/SuccessAnnouncement";

// Belt level mapping
const BELT_LEVELS = {
  "1D": "Đai đen 1 đẳng",
  "2D": "Đai đen 2 đẳng",
  "3D": "Đai đen 3 đẳng",
  "4D": "Đai đen 4 đẳng",
  "5D": "Đai đen 5 đẳng",
  "6D": "Đai đen 6 đẳng",
  "7D": "Đai đen 7 đẳng",
  "8D": "Đai đen 8 đẳng",
  "9D": "Đai đen 9 đẳng",
  "10D": "Đai đen 10 đẳng",
  "ĐỎ 1": "Đai đỏ cấp 1",
  "ĐỎ 2": "Đai đỏ cấp 2",
  "ĐỎ 3": "Đai đỏ cấp 3",
  "ĐỎ 4": "Đai đỏ cấp 4",
  XD5: "Đai xanh dương cấp 5",
  XL6: "Đai xanh lá cấp 6",
  V7: "Đai vàng cấp 7",
  T8: "Đai trắng cấp 8",
  T9: "Đai trắng cấp 9",
  T10: "Đai trắng cấp 10",
};

const ROLES = {
  0: "Trưởng câu lạc bộ",
  1: "Quản lý",
  2: "Huấn luyện viên",
  3: "Hướng dẫn viên",
  4: "Võ sinh",
};

// User Row Component
const UserRow = ({
  user,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  onDelete,
  isEditing,
  editData,
  onEditChange,
  facilities
}) => {
  const [errors, setErrors] = useState({});

  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (
        parts[parts.length - 2].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase()
      );
    }
    return name.charAt(0).toUpperCase();
  };

  const handleSave = () => {
    if (!editData) return;

    const newErrors = {};

    if (!editData.name?.trim()) newErrors.name = "Tên không được để trống";
    if (editData.name?.length > 100) newErrors.name = "Tên tối đa 100 ký tự";
    if (editData.phoneNumber && !validatePhone(editData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }
    if (editData.email && !validateEmail(editData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (editData.password && !validatePassword(editData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (editData.dateOfBirth && new Date(editData.dateOfBirth) >= new Date()) {
      newErrors.dateOfBirth = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave();
  };

  if (isEditing && editData) {
    return (
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={editData.id || ""}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên *
            </label>
            <input
              type="text"
              value={editData.name || ""}
              onChange={(e) => onEditChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              value={editData.phoneNumber || ""}
              onChange={(e) => onEditChange("phoneNumber", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editData.email || ""}
              onChange={(e) => onEditChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              value={editData.dateOfBirth || ""}
              onChange={(e) => onEditChange("dateOfBirth", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={editData.password || ""}
              onChange={(e) => onEditChange("password", e.target.value)}
              placeholder="Để trống nếu không đổi"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {user.role >= 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp đai
                </label>
                <select
                  value={editData.beltLevel || ""}
                  onChange={(e) => onEditChange("beltLevel", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Chọn cấp đai</option>
                  {Object.entries(BELT_LEVELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key} - {value}
                    </option>
                  ))}
                </select>
              </div>

              {(user.role === 2 || user.role === 3) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cơ sở
                  </label>
                  <select
                    value={editData.facilityId || ""}
                    onChange={(e) =>
                      onEditChange(
                        "facilityId",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {facilities.map((facility) => (
                      <option
                        key={facility.id || "none"}
                        value={facility.id || ""}
                      >
                        {facility.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={editData.role || 2}
                  onChange={(e) =>
                    onEditChange("role", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value={2}>Huấn luyện viên</option>
                  <option value={3}>Hướng dẫn viên</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save size={16} />
            Lưu
          </button>
          <button
            onClick={() => {
              setErrors({});
              onCancel();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <X size={16} />
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600 font-semibold text-xl">
            {getInitials(user.name)}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-md text-gray-900">{user.name}</h3>
            <span className="text-gray-500 text-sm">({user.id})</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>
              <span className="font-medium">SĐT:</span>{" "}
              {user.phoneNumber || "N/A"}
            </span>
            {user.beltLevel && (
              <span>
                <span className="font-medium">Đai:</span> {user.beltLevel}
              </span>
            )}
            <span>
              <span className="font-medium">Chức danh:</span> {ROLES[user.role]}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onToggleActive(user.id)}
            className={`p-2 rounded-md transition-colors ${
              user.isActive
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            title={user.isActive ? "Đang hoạt động" : "Đã ngưng hoạt động"}
          >
            <Power size={20} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// RoleSection.jsx - Add this as a new component file

const RoleSection = ({ 
  role, 
  users, 
  onEdit, 
  onSave, 
  onCancel, 
  onToggleActive, 
  onDelete,
  editingUserId, 
  editData, 
  onEditChange,
  currentUserRole 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <button className="w-full flex items-center justify-between mb-4 text-left">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-blue-600" />
          <h2 className="text-md font-bold text-gray-800">
            {ROLES[role]}{" "}
            <span className="text-gray-500">({users.length})</span>
          </h2>
        </div>
      </button>
      <div className="space-y-3">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
            isEditing={editingUserId === user.id}
            editData={editData}
            onEditChange={onEditChange}
            currentUserRole={currentUserRole}
          />
        ))}
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </span>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === page
                      ? 'z-10 bg-blue-600 text-white hover:bg-blue-500 ring-blue-600'
                      : 'text-gray-900'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Updated UserManagement Component with Pagination
export default function UserManagement() {
    const [currentUserRole] = useState(0);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const { data: facilities } = useFacility();
    const [isActive, setIsActive] = useState(true);
    const [startSearching, setStartSearching] = useState(false);
    const [showSearchedData, setShowSearchedData] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const queryClient = useQueryClient();
    
    const { data: usersData } = useFacilityMember({
        facilityId: selectedFacility,
        page: currentPage - 1, // API uses 0-based indexing
        size: pageSize,
        isActive: isActive
    });
    const { data: searchData } = useFacilityMemberBySearch({
        facilityId: selectedFacility,
        searchKey: searchKey,
        page: currentPage - 1, // API uses 0-based indexing
        size: pageSize,
        isActive: isActive,
        allowSearch: startSearching
    });
    
    
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editData, setEditData] = useState(null);

    const [inProgress, setInProgress] = useState("");
    const [showError, setShowError] = useState("");
    const [showSuccess, setShowSuccess] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState("");
    const [showToggleStatusConfirm, setShowToggleStatusConfirm] = useState("");

    const groupedUsers = users.reduce((acc, user) => {
        const role = user.role;
        if (!acc[role]) acc[role] = [];
        acc[role].push(user);
        return acc;
    }, {});

    console.log(groupedUsers);
    

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setEditData({ ...user });
    };

    const handleSave = () => {
        setUsers(users.map((u) => (u.id === editData.id ? editData : u)));
        setEditingUserId(null);
        setEditData(null);
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setEditData(null);
    };

    const handleEditChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    const handleToggleActive = async (userId) => {
        try {
          setInProgress("Đang cập nhật trạng thái người dùng");
          await userService.updateUserActiveStatus(userId, !isActive);
          setShowSuccess(
            isActive
              ? "Người dùng với ID là " + userId + " đã bị khóa"
              : "Người dùng với ID là " + userId + " đã được kích hoạt lại"
          );
          if (showSearchedData) {
            queryClient.setQueryData([
              "facility",
              "members",
              "search",
              selectedFacility,
              searchKey,
              isActive,
              currentPage - 1,
              pageSize,
            ], prev => {
              if(!prev) return prev;
              return {
                ...prev,
                data: {
                  content: prev.data.content.filter(
                    (user) => user.id !== showToggleStatusConfirm
                  ),
                  page: {
                    ...prev.data.page,
                    totalElements: prev.data.page.totalElements - 1,
                  },
                },
              };
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: [
                "facility",
                "members",
                selectedFacility,
                isActive,
                currentPage - 1,
                pageSize,
              ],
              exact: true,
            });
          }
        } catch (error) {
          if (error?.response) {
            setShowError(
              "Đã xảy ra lỗi khi cập nhật trạng thái người dùng: " +
                error.response.data
            );
          } else {
            setShowError(error.errorMessage);
          }
        } finally {
          setInProgress("");
          setShowToggleStatusConfirm("");
        }
    };

    const confirmToggleActive = (userId) => {
        setShowToggleStatusConfirm(userId);
    }

    const confirmDelete = (userId) => {
        setShowDeleteConfirm(userId);
    }
    console.log(usersData?.data);

    const handleDeleteUser = async (userId) => {
        try {
            setInProgress("Đang xóa người dùng");
            await userService.deleteUserById(userId);
            setShowSuccess("Người dùng với ID là " + userId + "đã bị xóa ra khỏi hệ thống");
            if(showSearchedData) {
              console.log("ruii");
              
              queryClient.setQueryData(
                [
                  "facility",
                  "members",
                  "search",
                  selectedFacility,
                  searchKey,
                  isActive,
                  currentPage - 1,
                  pageSize,
                ],
                (prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    data: {
                      content: prev.data.content.filter(
                        (user) => user.id !== showDeleteConfirm
                      ),
                      page: {
                        ...prev.data.page,
                        totalElements: prev.data.page.totalElements - 1,
                      },
                    },
                  };
                }
              );
              console.log("reee");
              console.log(
                queryClient.getQueryData([
                  "facility",
                  "members",
                  "search",
                  selectedFacility,
                  searchKey,
                  isActive,
                  currentPage - 1,
                  pageSize,
                ])
              );
              
            }
            else {
                queryClient.invalidateQueries({
                  queryKey: [
                    "facility",
                    "members",
                    selectedFacility,
                    isActive,
                    currentPage-1,
                    pageSize,
                  ],
                  exact: true,
                });
            }
        }
        catch(error) {
            if(error?.response) {
                setShowError("Đã xảy ra lỗi khi xóa người dùng: " + error.response.data);
            }
            else {
                setShowError(error.errorMessage);
            }
        }
        finally {
            setInProgress("");
            setShowDeleteConfirm("");
        }
    }

    useEffect(() => {
        if(facilities?.data) {
            setInProgress("");
        }
        else {
            setInProgress("Đang tải dữ liệu");
        }
        if(showSearchedData) {
            if(searchData?.data) {
                setInProgress("");
                setUsers(searchData?.data.content);
                setTotalPages(searchData?.data.page.totalPages);
                setStartSearching(false);
            }
            else if(selectedFacility) {
                setStartSearching(true);
                setInProgress("Đang tải dữ liệu");
            }
        }
        else {
            if(usersData?.data) {
                setInProgress("");
                setUsers(usersData?.data.content);
                setTotalPages(usersData?.data.page.totalPages);
            } 
            else if(selectedFacility){
                setInProgress("Đang tải dữ liệu");
            }
        }
    }, [usersData, facilities, searchData, showSearchedData, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        setSearchKey("")
        setSearchTerm("");
    }, [selectedFacility, isActive])

    useEffect(() => {
        if (searchTerm.length === 0) {
          setShowSearchedData(false);
          setSearchKey("");
        }
    }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {inProgress && <ThreeDotLoader message={inProgress} />}
      {showDeleteConfirm && (
        <ConfirmDialog
          action="remove"
          title="Xóa người dùng ra khỏi hệ thống"
          askDetail="Bạn có muốn xóa người dùng này ra khỏi hệ thống ? Thao tác này sẽ không thể thu hồi !"
          handleCancel={() => setShowDeleteConfirm("")}
          handleConfirm={() => handleDeleteUser(showDeleteConfirm)}
        />
      )}
      {showToggleStatusConfirm && (
        <ConfirmDialog
          title="Thay đổi trạng thái hoạt động người dùng"
          askDetail={
            isActive
              ? `Bạn chắc chắn về việc khóa tài khoản người dùng với ID ${showToggleStatusConfirm} ? Người dùng sẽ không thể sử dụng tài khoản sau khi bạn xác nhận`
              : `Bạn chắc chắn về việc kích hoạt lại tài khoản người dùng với ID ${showToggleStatusConfirm} ? Sau khi kích hoạt người dùng có thể sử dụng tài khoản trên hệ thống`
          }
          handleCancel={() => setShowToggleStatusConfirm("")}
          handleConfirm={() => handleToggleActive(showToggleStatusConfirm)}
        />
      )}
      {showError && (
        <AnnouncementUI message={showError} setVisible={setShowError} />
      )}
      {showSuccess && (
        <SuccessAnnouncement
          actionAnnouncement="Thao tác thực hiện thành công"
          detailAnnouncement={showSuccess}
          onBack={() => setShowSuccess("")}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Quản Lý Người Dùng
          </h1>

          {/* Facility Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn Cơ Sở
            </label>
            <select
              value={selectedFacility || ""}
              onChange={(e) =>
                setSelectedFacility(
                  e.target.value === ""
                    ? null
                    : e.target.value === "none"
                    ? "none"
                    : e.target.value === "all"
                    ? "all"
                    : parseInt(e.target.value)
                )
              }
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="">Chọn cơ sở</option>
              <option value={"all"}>Tất cả cơ sở</option>
              <option value={"none"}>Không có cơ sở</option>
              {facilities?.data &&
                facilities.data.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
            </select>
            {usersData?.data && (
              <p className="mt-6">
                <strong>
                  Số lượng thành viên{" "}
                  {isActive ? " còn hoạt động" : " ngưng hoạt động"}:{" "}
                  {usersData.data.page.totalElements}
                </strong>{" "}
              </p>
            )}
          </div>

          {selectedFacility !== null && (
            <>
              {/* Search and Add Manager */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo ID hoặc tên..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchTerm) {
                        setSearchKey(searchTerm);
                        setStartSearching(true);
                        setShowSearchedData(true);
                        setCurrentPage(1);
                        setInProgress("Đang tìm kiếm");
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              {searchKey && (
                <p className="my-6 italic">
                  Kết quả tìm kiếm của từ khóa: <strong>{searchKey}</strong>
                </p>
              )}
              {showSearchedData && searchData?.data && (
                <p className="my-6">
                  Có tổng cộng:{" "}
                  <strong>
                    {" " + searchData.data.page.totalElements + " "}
                  </strong>{" "}
                  kết quả
                </p>
              )}

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setIsActive(true)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Hoạt Động
                </button>
                <button
                  onClick={() => setIsActive(false)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    !isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Ngưng Hoạt Động
                </button>
              </div>

              {/* User Groups */}
              {Object.keys(groupedUsers).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy người dùng
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {Object.entries(groupedUsers)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([role, roleUsers]) => (
                        <RoleSection
                          key={role}
                          role={role}
                          users={roleUsers}
                          onEdit={handleEdit}
                          onSave={handleSave}
                          onCancel={handleCancel}
                          onToggleActive={confirmToggleActive}
                          onDelete={confirmDelete}
                          editingUserId={editingUserId}
                          editData={editData}
                          onEditChange={handleEditChange}
                          currentUserRole={currentUserRole}
                        />
                      ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}