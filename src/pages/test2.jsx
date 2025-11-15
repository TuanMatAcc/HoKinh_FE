import React, { useState } from "react";

// Hàm loại bỏ dấu tiếng Việt
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

export default function HVGenerator() {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [code, setCode] = useState("");

  // Tự động sinh mã khi thay đổi input
  const handleChange = (newName, newBirth) => {
    setName(newName);
    setBirth(newBirth);
    setCode(generateHVCode(newName, newBirth));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Tạo mã học viên</h2>

      <div>
        <label className="block mb-1 font-medium">Họ và tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleChange(e.target.value, birth)}
          placeholder="Ví dụ: Trần Phạm Ngọc Phương"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Ngày sinh:</label>
        <input
          type="date"
          value={birth}
          onChange={(e) => handleChange(name, e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {code && (
        <div className="text-center mt-3">
          <p className="font-semibold text-gray-700">Mã học viên:</p>
          <p className="text-lg font-mono text-green-600">{code}</p>
        </div>
      )}
    </div>
  );
}
