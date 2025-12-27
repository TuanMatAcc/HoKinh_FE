import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  Info,
  Loader2,
} from "lucide-react";
import logo from "@/assets/images/homepage/logo_rmbg.png";
import { authService } from "../services/auth_api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      showMessage("Vui lòng nhập địa chỉ email hợp lệ", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.requestOTP(email);
      showMessage(response.data.message, "success");
      setStep(2);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showMessage("OTP phải có 6 chữ số", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp(email, otp);
      showMessage(response.data.message, "success");
      setStep(3);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "OTP không hợp lệ. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage("Mật khẩu không khớp", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("Mật khẩu phải có ít nhất 8 ký tự", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(email, newPassword);
      showMessage(response.data.message, "success");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setStep(1);
    showMessage("Bạn có thể yêu cầu OTP mới", "success");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại đăng nhập</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden border-2 border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
                <img src={logo} alt="Logo" />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Quên mật khẩu
            </h1>
            <p className="text-gray-600">
              {step === 1 && "Nhập email để nhận mã OTP"}
              {step === 2 && "Xác thực mã OTP"}
              {step === 3 && "Tạo mật khẩu mới"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                step >= 1
                  ? "bg-linear-to-r from-red-600 to-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step >= 2
                  ? "bg-linear-to-r from-red-600 to-blue-600"
                  : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                step >= 2
                  ? "bg-linear-to-r from-red-600 to-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step >= 3
                  ? "bg-linear-to-r from-red-600 to-blue-600"
                  : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                step >= 3
                  ? "bg-linear-to-r from-red-600 to-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 ${
                message.type === "success"
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-red-50 border-red-500 text-red-800"
              }`}
            >
              <div className="flex items-start">
                <Info className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-red-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "Đang gửi..." : "Gửi mã OTP"}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-red-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-800">
                    Chúng tôi đã gửi mã OTP 6 chữ số đến{" "}
                    <strong>{email}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Nhập mã OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-bold"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-red-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "Đang xác thực..." : "Xác thực OTP"}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-red-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi lại mã OTP
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Ít nhất 8 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
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
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-red-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-red-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;