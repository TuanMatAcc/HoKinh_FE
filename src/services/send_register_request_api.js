import api from "./client";

export const registrationService = {
    sendEmailRequest: (formData) => api.post("/api/registration/send", formData)
}