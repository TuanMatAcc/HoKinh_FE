import api from "./client";

export const authService = {
    login: (loginRequest) => api.post("/api/auth/login", loginRequest)
                                .then(res => {
                                    const token = res.data.token;
                                    localStorage.setItem("token", token);
                                    localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo))
                                }),
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo")
    }
}