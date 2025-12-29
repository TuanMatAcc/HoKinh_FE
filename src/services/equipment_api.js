import api from "./client";

export const equipmentService = {
    getEquipments: () => api.get('/api/equipment/admin'),
    createEquipment: (equipment) => api.post('/api/equipment/admin/create', equipment),
    updateEquipments: (equipments) => api.put('/api/equipment/admin/update-equipments', equipments),
    deleteEquipment: (id) => api.delete(`/api/equipment/admin/delete/${id}`)
}