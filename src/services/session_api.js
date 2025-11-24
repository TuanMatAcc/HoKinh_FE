import api from "./client"

export const sessionService = {
    createSessions: (facilityClassId, startDate, endDate, templates) => 
        api.post(
            '/api/session/bulk-create-multi-day', 
            templates, 
            {
                params: {facilityClassId, startDate, endDate}
            }
        )
}