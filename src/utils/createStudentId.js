const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

// Hàm tạo mã học viên theo quy luật
const generateHVCode = (fullName, birthDate) => {
  if (!fullName || !birthDate) return "";

  const nameParts = fullName.trim().split(/\s+/);

  // Lấy tên chính (từ cuối)
  const name = removeAccents(nameParts[nameParts.length - 1]).toLowerCase();

  // Lấy chữ cái đầu của các họ và tên đệm
  const initials = nameParts
    .slice(0, -1)
    .map((part) => removeAccents(part[0]).toLowerCase())
    .join("");

  // Định dạng ngày tháng năm sinh ddMMyy
  const date = new Date(birthDate);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `HV_${name}${initials}_${dd}${mm}${yy}`;
};

export default generateHVCode;