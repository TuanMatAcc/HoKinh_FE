export const getAutoStatus = (startTime, endTime, date) => {
    const start = new Date(`${date}T${startTime}`).getTime();
    const end = new Date(`${date}T${endTime}`).getTime();
    const nowTime = Date.now();
    if(nowTime < start) {
        // Return chưa bắt đầu
        return 0;
    }
    else if(nowTime <= end) {
        // Return đang diễn ra
        return 1;
    }
    else {
        // Return đã kết thúc
        return 2;
    }
}