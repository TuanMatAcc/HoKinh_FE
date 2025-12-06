import { useQuery } from "@tanstack/react-query";
import { equipmentService } from "../services/equipment_api";

export function useEquipments() {
    return useQuery({
        queryKey: ['equipments', 'management'],
        queryFn: () => equipmentService.getEquipments(),
        staleTime: 60000 * 5
    });
}
