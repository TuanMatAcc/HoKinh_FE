export function getDayOfWeek(input, locale = "vi") {
  // Convert input into a Date object safely
  let date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {

    // Match yyyy-mm-dd (HTML <input type="date">)
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      date = new Date(input);
    }

    // Match dd/mm/yyyy or mm/dd/yyyy
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
      const [a, b, c] = input.split("/").map(Number);

      // 🇻🇳 Vietnamese format dd/mm/yyyy → day > 12 means VN
      let day, month, year;

      if (a > 12) {
        // VN format
        day = a;
        month = b;
        year = c;
      } else if (b > 12) {
        // US format mm/dd/yyyy
        month = a;
        day = b;
        year = c;
      } else {
        // Both <= 12 → ambiguous → assume VN
        day = a;
        month = b;
        year = c;
      }

      date = new Date(year, month - 1, day);
    } else {
      throw new Error("Unsupported date format");
    }
  } else {
    throw new Error("Invalid input");
  }

  // Days mapping
  const daysVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dayIndex = date.getDay();

  return locale === "en" ? daysEn[dayIndex] : daysVi[dayIndex];
}

export function getStudyHour(time) {
  return time.split(":").slice(0,2).join(":");
}

export function convertDateInputToVN(inputValue, toUnit) {
  if (!inputValue) return "";

  // inputValue format: "yyyy-mm-dd"
  const [year, month, day] = inputValue.split("-");
  if(toUnit === 'd') {
    return `${day}`;
  }

  if(toUnit === 'm') {
    return `${day}/${month}`;
  }

  return `${day}/${month}/${year}`;
}

export const convertFromDateInputToVN = (dateStr, format) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  if (format === "m") return `${day}/${month}`;
  if (format === "y") return `${day}/${month}/${year}`;
  return `${day}/${month}/${year}`;
};

export const getBriefDayNameFromNumber = (dayNumber) => {
    const days = [1, 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    // day number - 1 = index (start from 0)
    return days[parseInt(dayNumber-1)];
};