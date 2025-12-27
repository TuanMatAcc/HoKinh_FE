import api from "./client";

export const authService = {
    login: (loginRequest) => api.post("/api/auth/login", loginRequest)
                                .then(res => {
                                    const token = res.data.token;
                                    console.log(res.data.userInfo);
                                    localStorage.setItem("token", token);
                                    localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo))
                                }),
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo")
    },
    requestOTP: (email) => api.post(
        `/api/auth/forgot-password/request-otp`,
        {
          email,
        }
    ),
    verifyOtp: (email, otp) => api.post(
        `/api/auth/forgot-password/verify-otp`,
        {
          email,
          otp,
        }
    ),
    resetPassword: (email, newPassword) => api.post(
        `/api/auth/forgot-password/reset`,
        {
          email,
          newPassword,
        }
    ),
    changeFirstPassword: (oldPassword, newPassword) => api.post(
        `/api/auth/change-first-password`,
        {
          oldPassword,
          newPassword,
        }
    ),
    logOutAll: () => api.post(
        `/api/auth/logout-all`
    ),
}