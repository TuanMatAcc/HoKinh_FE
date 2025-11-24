export const getSessionStatus = (status) => {
    const statusMap = {
        0: "Chưa bắt đầu",
        1: "Đang diễn ra",
        2: "Đã kết thúc",
        3: "Đã hủy"
    }
    return statusMap[status];
}

