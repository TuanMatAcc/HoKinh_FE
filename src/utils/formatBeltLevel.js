export default function getBeltLabel(value) {
  const beltMap = {
    "": "Không",
    "white": "Trắng",
    "yellow": "Vàng",
    "green": "Xanh Lục",
    "blue": "Xanh",
    "red": "Đỏ",
  };

  // For black belts with cấp/đẳng
  if (value.startsWith("black/")) {
    const level = value.split("/")[1];
    return `Đen ${level} Đẳng`;
  }

  return beltMap[value] || "Không xác định";
}
