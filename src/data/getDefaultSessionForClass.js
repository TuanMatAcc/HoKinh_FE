export function getDefaultSessionForClass({ classData, day, date, users }) {
    return {
        id: null,
        dayOfWeek: day,
        date: date,
        startTime: classData.startHour,
        endTime: classData.endHour,
        status: 0,
        topic: "",
        videoLink: "",
        report: "",
        mainInstructors: Object.entries(users)
            .filter(([key]) => key !== "student")
            .flatMap(([_, arr]) =>
                arr.map((value) => ({
                    id: Date.now(),
                    userId: value.id,
                    name: value.name,
                    roleInSession: "assistant",
                    classId: value.classId,
                    checkinTime: "",
                    review: "",
                    attended: false,
                    isNew: true,
                }))
            ),
        students: users["student"]
            ? users["student"].map((stu) => ({
                id: Date.now(),
                userId: stu.id,
                name: stu.name,
                roleInSession: "student",
                classId: stu.classId,
                checkinTime: "",
                review: "",
                attended: false,
                isNew: true,
            }))
            : [],
    };
}
