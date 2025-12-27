import React, { useState } from "react";
import {
  User,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { authService } from "../services/auth_api";

const getDefaultUser = () => ({
  name: "Guest User",
  role: 1,
  isFirstChangePassword: true,
});

export default function AccountSettings() {
  const [user] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : getDefaultUser();
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutAll, setShowLogoutAll] = useState(false);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Determine if features should be shown
  const shouldShowChangePassword =
    user.isFirstChangePassword && user.role !== 0;
  const isLogoutAllDisabled =
    (user.isFirstChangePassword && user.role !== 0);

  const handleChangeFirstPassword = async () => {
    setMessage({ type: "", text: "" });

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới không khớp" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.changeFirstPassword(oldPassword, newPassword);
      setMessage({ type: "success", text: "Cập nhật mật khẩu thành công" });

      // Clear inputs
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Update localStorage
      const updatedUser = { ...user, isFirstChangePassword: false };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Cập nhật mật khẩu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      await authService.logOutAll();
      setMessage({
        type: "success",
        text: "Đăng xuất thành công ở tất cả thiết bị",
      });

      // Logout and redirect after 1.5 seconds
      setTimeout(() => {
        authService.logout();
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Đăng xuất thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">
                {user.role === 0 ? "Quản trị viên" : "Người dùng"}
              </p>
            </div>
          </div>
        </div>

        {/* Global Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Change First Password */}
          {shouldShowChangePassword && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="w-full p-6 flex items-center justify-between hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thay đổi mật khẩu lần đầu
                    </h3>
                    <p className="text-sm text-gray-600">
                      Cập nhật mật khẩu của bạn để bảo mật tài khoản
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${
                    showChangePassword ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {showChangePassword && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="space-y-4">
                    {/* Old Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu cũ
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập mật khẩu cũ"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showOldPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nhập lại mật khẩu mới"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleChangeFirstPassword}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logout All Devices */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() =>
                !isLogoutAllDisabled && setShowLogoutAll(!showLogoutAll)
              }
              disabled={isLogoutAllDisabled}
              className={`w-full p-6 flex items-center justify-between transition-colors ${
                isLogoutAllDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-50 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isLogoutAllDisabled ? "bg-gray-100" : "bg-red-100"
                  }`}
                >
                  <LogOut
                    className={`w-6 h-6 ${
                      isLogoutAllDisabled ? "text-gray-400" : "text-red-600"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Đăng xuất tất cả thiết bị
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isLogoutAllDisabled
                      ? "Vui lòng thay đổi mật khẩu lần đầu trước khi sử dụng"
                      : "Đăng xuất khỏi tất cả các thiết bị đang đăng nhập"}
                  </p>
                </div>
              </div>
              {!isLogoutAllDisabled && (
                <div
                  className={`transform transition-transform ${
                    showLogoutAll ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              )}
            </button>

            {showLogoutAll && !isLogoutAllDisabled && (
              <div className="p-6 pt-0 border-t border-gray-100">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Cảnh báo</p>
                      <p>
                        Bạn sẽ bị đăng xuất khỏi tất cả các thiết bị. Bạn sẽ cần
                        đăng nhập lại để tiếp tục sử dụng.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogoutAll}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đăng xuất tất cả"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
