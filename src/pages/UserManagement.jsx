import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Save, X, Users } from "lucide-react";
import { useFacilityMember } from "../hooks/useFacilityMembers";
import { ThreeDotLoader } from "../components/ActionFallback";

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

// Mock data
const mockFacilities = [
  { id: null, name: "Không cơ sở" },
  { id: 1, name: "Cơ sở 1 - Quận 1" },
  { id: 2, name: "Cơ sở 2 - Quận 2" },
  { id: 3, name: "Cơ sở 3 - Quận 3" },
];

const mockUsers = [
  {
    id: "u001",
    name: "Nguyễn Văn A",
    phoneNumber: "0912345678",
    dateOfBirth: "1990-01-15",
    email: "a@example.com",
    password: "password123",
    isActive: true,
    role: 2,
    beltLevel: "T8",
    facilityId: 1,
  },
  {
    id: "u002",
    name: "Trần Thị B",
    phoneNumber: "0987654321",
    dateOfBirth: "1985-05-20",
    email: "b@example.com",
    password: "password123",
    isActive: true,
    role: 3,
    beltLevel: "1D",
    facilityId: 2,
  },
  {
    id: "u006",
    name: "Hoàng Văn F",
    phoneNumber: "0934567890",
    dateOfBirth: "2005-03-25",
    email: "f@example.com",
    password: "password123",
    isActive: true,
    role: 4,
    beltLevel: "V7",
    facilityId: 1,
  },
  {
    id: "USER001",
    name: "Nguyễn Văn A",
    phoneNumber: "0901234567",
    dateOfBirth: "1990-01-15",
    email: "a@example.com",
    password: "password123",
    isActive: true,
    role: 1,
    beltLevel: null,
    facilityId: null,
  },
  {
    id: "USER005",
    name: "Hoàng Văn E",
    phoneNumber: "0945678901",
    dateOfBirth: "2008-11-30",
    email: "e@example.com",
    password: "password123",
    isActive: false,
    role: 4,
    beltLevel: "T8",
    facilityId: 2,
  },
];

// Validation functions
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

// User Row Component
const UserRow = ({
  user,
  onEdit,
  onSave,
  onCancel,
  onToggleActive,
  isEditing,
  editData,
  onEditChange,
  currentUserRole,
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
                    {mockFacilities.map((facility) => (
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
    <div className="bg-white border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600 font-semibold text-xl">
            {getInitials(user.name)}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
          </button>
          <button
            onClick={() => onToggleActive(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Manager Creation Modal
const ManagerModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Tên không được để trống";
    if (formData.name?.length > 100) newErrors.name = "Tên tối đa 100 ký tự";
    if (!formData.phoneNumber || !validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!formData.dateOfBirth || new Date(formData.dateOfBirth) >= new Date()) {
      newErrors.dateOfBirth = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({
      name: "",
      phoneNumber: "",
      dateOfBirth: "",
      email: "",
      password: "",
      avatar: "",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Thêm Quản Lý Mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                Số điện thoại *
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                Mật khẩu *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.dateOfBirth ? "border-red-500" : ""
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tạo Quản Lý
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
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
          <h2 className="text-xl font-bold text-gray-800">
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

// Main Component
export default function UserManagement() {
  const [currentUserRole] = useState(0); // 0: Club Head, 1: Manager
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData } = useFacilityMember(selectedFacility);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showManagerModal, setShowManagerModal] = useState(false);

  const [inProgress, setInProgress] = useState("");
  const [showError, setShowError] = useState("");
  const [showSuccess, setShowSuccess] = useState("");

  const filteredUsers = users.filter((user) => {
    // Filter by facility
    if (selectedFacility === null) return false;
    if (selectedFacility === "none") {
      if (user.facilityId !== null) return false;
    } else {
      if (user.facilityId !== selectedFacility) return false;
    }

    // Filter by role based on current user role
    if (currentUserRole === 1 && user.role <= 1) return false;

    // Filter by active status
    if (activeTab === "active" && !user.isActive) return false;
    if (activeTab === "inactive" && user.isActive) return false;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        user.id.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const groupedUsers = filteredUsers.reduce((acc, user) => {
    const role = user.role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

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

  const handleToggleActive = (userId) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleCreateManager = (managerData) => {
    const newManager = {
      id: `MGR${Date.now()}`,
      ...managerData,
      role: 1,
      isActive: true,
      beltLevel: null,
      facilityId: null,
    };
    setUsers([...users, newManager]);
    setShowManagerModal(false);
  };

  useEffect(() => {
    if(usersData?.data) {
        setInProgress("");
        setUsers(usersData?.data);
    }
    else if(selectedFacility) {
        setInProgress("Đang tải dữ liệu")
    }
  }, [usersData, selectedFacility])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {inProgress && <ThreeDotLoader message={inProgress} />}
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
                    : parseInt(e.target.value)
                )
              }
              className="w-full md:w-64 px-4 py-2 border rounded-md"
            >
              <option value="">-- Chọn cơ sở --</option>
              {mockFacilities.map((facility) => (
                <option
                  key={facility.id || "none"}
                  value={facility.id || "none"}
                >
                  {facility.name}
                </option>
              ))}
            </select>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>

                {currentUserRole === 0 && (
                  <button
                    onClick={() => setShowManagerModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                  >
                    <Plus size={20} />
                    Thêm Quản Lý
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "active"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Hoạt Động
                </button>
                <button
                  onClick={() => setActiveTab("inactive")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "inactive"
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
                        onToggleActive={handleToggleActive}
                        editingUserId={editingUserId}
                        editData={editData}
                        onEditChange={handleEditChange}
                        currentUserRole={currentUserRole}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ManagerModal
        isOpen={showManagerModal}
        onClose={() => setShowManagerModal(false)}
        onSubmit={handleCreateManager}
      />
    </div>
  );
}
