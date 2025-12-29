export default function getBeltLabel(value) {
  if (!value) return "Không";

  const beltMap = {
    // White belt
    "T10": "Đai Trắng Cấp 10",
    "T9": "Đai Trắng Cấp 9",
    "T8": "Đai Trắng Cấp 8",

    // Yellow belt
    "V7": "Đai Vàng Cấp 7",

    // Green belt
    "XL6": "Đai Xanh Lá Cấp 6",

    // Blue belt
    "XD5": "Đai Xanh Dương Cấp 5",

    // Red belt
    "ĐỎ 4": "Đai Đỏ Cấp 4",
    "ĐỎ 3": "Đai Đỏ Cấp 3",
    "ĐỎ 2": "Đai Đỏ Cấp 2",
    "ĐỎ 1": "Đai Đỏ Cấp 1",

    // Black belt
    "1Đ": "Đai Đen 1 Đẳng",
    "2Đ": "Đai Đen 2 Đẳng",
    "3Đ": "Đai Đen 3 Đẳng",
    "4Đ": "Đai Đen 4 Đẳng",
    "5Đ": "Đai Đen 5 Đẳng",
    "6Đ": "Đai Đen 6 Đẳng",
    "7Đ": "Đai Đen 7 Đẳng",
    "8Đ": "Đai Đen 8 Đẳng",
    "9Đ": "Đai Đen 9 Đẳng",
    "10Đ": "Đai Đen 10 Đẳng",
  };

  return beltMap[value] || "Không xác định";
}

