
export const getSessionStatus = (status) => {
    const statusMap = {
        0: "Chưa bắt đầu",
        1: "Đang diễn ra",
        2: "Đã kết thúc",
        3: "Đã hủy"
    }
    return statusMap[status];
}

export const getInstructorSessionStatus = (
  date,
  startTime,
  endTime,
  status,
  report,
  videoLink
) => {
  if (status === 1)
    return { text: "Đã hủy", color: "bg-gray-100 text-gray-600" };
  if (report && videoLink)
    return { text: "Đã hoàn thành", color: "bg-green-100 text-green-700" };

  const now = new Date();
  const sessionDate = new Date(`${date}T${startTime}`);
  const sessionEnd = new Date(`${date}T${endTime}`);

  if (now < sessionDate)
    return { text: "Chưa bắt đầu", color: "bg-blue-100 text-blue-600" };
  if (now >= sessionDate && now <= sessionEnd)
    return { text: "Đang diễn ra", color: "bg-yellow-100 text-yellow-700" };
  return { text: "Đã kết thúc", color: "bg-gray-100 text-gray-600" };
};


// Status color utility
export const getStatusColor = (displayStatus, isCanceled) => {
  if (isCanceled) {
    return "bg-red-100 text-red-700 border-red-300";
  }

  switch (displayStatus) {
    case 0: // Chưa bắt đầu
      return "bg-blue-100 text-blue-700 border-blue-300";
    case 1: // Đang diễn ra
      return "bg-green-100 text-green-700 border-green-300";
    case 2: // Đã kết thúc
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};
