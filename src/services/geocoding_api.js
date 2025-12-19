import api from "./client";

export const geocodingService = {
    getAddress: (lat, lng) => api.get("/api/maps/resolve-address", {params: {lat, lng}})
}