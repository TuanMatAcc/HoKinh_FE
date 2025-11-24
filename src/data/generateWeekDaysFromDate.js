export const generateWeekFromDate = (dateStr) => {
  const base = new Date(dateStr);

  // Find Monday (using lightweight math)
  const day = base.getDay();                       // 0=Sun, 1=Mon...
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((day + 6) % 7)); // shift to Monday

  // Return 7 days starting from Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: (i + 2).toString(),                     // "2" → Mon … "8" → Sun
      date: d.toISOString().split("T")[0],         // YYYY-MM-DD
    };
  });
};
