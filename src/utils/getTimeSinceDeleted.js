const getTimeSinceDeleted = (deletedAt) => {
    if (!deletedAt) return '';

    const deletedDate = new Date(deletedAt);
    const now = Date.now();
    const diff = now - deletedDate;
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
};

export default getTimeSinceDeleted;