import { useState } from "react";
// Manager Creation Modal

// Validation functions
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

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
export default ManagerModal;