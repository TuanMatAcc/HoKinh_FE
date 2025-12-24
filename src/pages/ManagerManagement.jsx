import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Power, Trash2, Plus, X, Check, User } from "lucide-react";
import { userService } from "../services/user_api";
import SuccessAnnouncement from "../components/SuccessAnnouncement";
import AnnouncementUI from "../components/Announcement";
import { ThreeDotLoader } from "../components/ActionFallback";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useManagers } from "../hooks/useManagers";
import { LoadingErrorUI } from "../components/LoadingError";
import ManagerModal from "../features/manager-management/components/ManagerModal";

// Validation utilities
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

// ===== COMPONENTS =====

// Manager Avatar Component
const ManagerAvatar = ({ avatar, name }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <User className="w-6 h-6 text-blue-600" />
      )}
    </div>
  );
};

// Manager Info Display Component
const ManagerInfoDisplay = ({ label, value, fullWidth = false }) => {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value || <span className="text-gray-400">Chưa có</span>}
      </p>
    </div>
  );
};

// Facility Badge Component
const FacilityBadge = ({ name }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      {name}
    </span>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, onClick, variant = "default", title }) => {
  const variants = {
    default: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    edit: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
    power: "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50",
    delete: "text-red-600 hover:text-red-700 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${variants[variant]}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

// Manager Card Component
const ManagerCard = ({ manager, onEdit, onTogglePower, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <ManagerAvatar avatar={manager.avatar} name={manager.name} />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {manager.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {manager.id}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <ActionButton
            icon={Edit2}
            onClick={() => onEdit(manager)}
            variant="edit"
            title="Chỉnh sửa"
          />
          <ActionButton
            icon={Power}
            onClick={() => onTogglePower(manager)}
            variant="power"
            title="Kích hoạt/Vô hiệu hóa"
          />
          <ActionButton
            icon={Trash2}
            onClick={() => onDelete(manager)}
            variant="delete"
            title="Xóa"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ManagerInfoDisplay label="Số điện thoại" value={manager.phoneNumber} />
        <ManagerInfoDisplay label="Email" value={manager.email} />
        <ManagerInfoDisplay label="Ngày sinh" value={manager.dateOfBirth} />
      </div>

      {manager.facilityNames && manager.facilityNames.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Cơ sở quản lý</p>
          <div className="flex flex-wrap gap-2">
            {manager.facilityNames.map((facility, index) => (
              <FacilityBadge key={index} name={facility} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Manager Modal Component
const EditManagerModal = ({ isOpen, manager, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: manager?.id || "",
    name: manager?.name || "",
    phoneNumber: manager?.phoneNumber || "",
    dateOfBirth: manager?.dateOfBirth || "",
    email: manager?.email || "",
    password: "",
    avatar: manager?.avatar || "",
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (manager) {
      setFormData({
        id: manager.id,
        name: manager.name,
        phoneNumber: manager.phoneNumber,
        dateOfBirth: manager.dateOfBirth,
        email: manager.email,
        password: "",
        avatar: manager.avatar,
      });
    }
  }, [manager]);

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
    if (formData.password && !validatePassword(formData.password)) {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Chỉnh Sửa Quản Lý</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

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
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới (để trống nếu không đổi)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Cập Nhật
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium transition-colors"
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

// Filter Tabs Component
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const tabs = [
    { value: true, label: "Đang hoạt động" },
    { value: false, label: "Ngưng hoạt động" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onFilterChange(tab.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === tab.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main Manager Management Component
const ManagerManagement = () => {
  const [isActive, setIsActive] = useState(true);
  const [editingManager, setEditingManager] = useState(null);
  const [showError, setShowError] = useState("");
  const [inProgress, setInProgress] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const [deletedUser, setDeletedUser] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useManagers({ isActive });

  const updateManagerMutation = useMutation({
    mutationFn: userService.updateManager,
    onMutate: () => {
      setInProgress("Đang cập nhật thông tin quản lý...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["managers"]);
      setShowSuccess("Cập nhật thành công thông tin quản lý");
      setInProgress("");
      setEditingManager(null);
    },
    onError: (error) => {
      setInProgress("");
      if (error?.response) {
        setShowError("Xảy ra lỗi khi cập nhật người dùng: " + error.response.data);
      }
      
    },
  });

  const handleEdit = (manager) => {
    setEditingManager(manager);
  };

  const handleUpdateSubmit = (formData) => {
    updateManagerMutation.mutate(formData);
  };

  const handleDeleteSubmit = async (managerId) => {
    try {
      await userService.deleteUserById(managerId);
      queryClient.invalidateQueries(["managers"]);
      setShowSuccess("Xóa thành công quản lý");
    }
    catch(error) {
      if (error?.response) {
        setShowError("Xảy ra lỗi khi xóa quản lý " + error.response.data);
      }
    }
    finally {
      setDeletedUser("");
      setInProgress("");
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const managerData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar,
      }
      await userService.createManager(managerData);
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries(["managers"]);
      setShowSuccess("Tạo thành công quản lý");
    }
    catch(error) {
      if (error?.response) {
        setShowError("Xảy ra lỗi khi tạo quản lý " + error.response.data);
      }
    }
    finally {
      setInProgress("");
    }
  };

  const handleTogglePower = async (manager) => {
    // Logic will be implemented later
    try {
      await userService.updateUserActiveStatus(manager.id, !isActive);
      queryClient.invalidateQueries(["managers"]);
      setShowSuccess("Chuyển trạng thái quản lý thành công");
    }
    catch(error) {
      console.log(error);
      if (error?.response) {
        setShowError(error.response.data);
      }
    }
    finally {
      setInProgress("");
    }
  };

  const handleDelete = (manager) => {
    // Logic will be implemented later
    setDeletedUser(manager.id);
  };

  const handleCreateManager = () => {
    // Logic will be implemented later
    console.log("Create new manager");
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <ThreeDotLoader
        message="Đang tải dữ liệu"
      />
    );
  }

  if (isError) {
    return (
      <LoadingErrorUI
        errorMessage={"Lỗi tải dữ liệu quản lý"}
        refetchData={refetch}
      />
    );
  }

  const managers = data?.data || [];

  return (
    <>
      {inProgress && <ThreeDotLoader message={inProgress} />}
      {isCreateModalOpen && 
        <ManagerModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      }
      {deletedUser && (
        <ConfirmDialog
          action="remove"
          title="Xóa người dùng ra khỏi hệ thống"
          askDetail="Bạn có muốn xóa người dùng này ra khỏi hệ thống ? Thao tác này sẽ không thể thu hồi !"
          handleCancel={() => setDeletedUser("")}
          handleConfirm={() => handleDeleteSubmit(deletedUser)}
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản Lý Người Dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý thông tin các quản lý cơ sở
              </p>
            </div>
            <button
              onClick={handleCreateManager}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm Quản Lý
            </button>
          </div>

          <FilterTabs activeFilter={isActive} onFilterChange={setIsActive} />

          {managers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">Không có quản lý nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {managers.map((manager) => (
                <ManagerCard
                  key={manager.id}
                  manager={manager}
                  onEdit={handleEdit}
                  onTogglePower={handleTogglePower}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <EditManagerModal
            isOpen={!!editingManager}
            manager={editingManager}
            onClose={() => setEditingManager(null)}
            onSubmit={handleUpdateSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ManagerManagement;