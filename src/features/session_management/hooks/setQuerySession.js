import { useQueryClient } from "@tanstack/react-query";

export function setQuerySession({session, selectedClassId, startDate, endDate, queryClient}) {
    queryClient.setQueryData(
        [
            "sessions",
            selectedClassId,
            startDate,
            endDate
        ],
        (prev) => {
            if (!prev) return prev;
            if(prev.data.find(s => s.id === session.id)) {
                return ({
                    ...prev,
                    data: prev.data.map((s) =>
                        s.id === session.id ? session : s
                    )
                });
            }
            else {
                return ({
                    ...prev,
                    data: [...prev.data, session]
                });
            }
        }
    );
}

export function setQuerySessionStudents({sessionId, students, queryClient}) {
    queryClient.setQueryData(
        [
            "session",
            "students",
            sessionId
        ],
        (prev) => {
            if (!prev) return prev;

            return ({
                ...prev,
                data: students,
            });
        }
    );
}