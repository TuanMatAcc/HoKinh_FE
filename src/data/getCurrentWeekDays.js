// Output format: [{ day: "2", date: "2025-11-04" }, ...]
export function getCurrentWeekDays() {
  const today = new Date();
  
  // Get Monday of current week (Vietnamese week starts Monday → day = 2)
  const dayOfWeek = today.getDay();        // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const mondayOffset = (dayOfWeek + 6) % 7; // convert to: Mon=0, Tue=1, ..., Sun=6
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const iso = d.toISOString().split("T")[0]; // yyyy-mm-dd
    const vnDay = (i + 2).toString();          // 2..8 (Mon=2, Sun=8)

    weekDays.push({
      day: vnDay,
      date: iso,
    });
  }

  return weekDays;
}
