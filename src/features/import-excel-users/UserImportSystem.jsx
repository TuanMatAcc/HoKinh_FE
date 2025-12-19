import React, { useState } from "react";
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  FileText,
} from "lucide-react";

// IMPORTANT: Import your userService in your actual file
import { userService } from "../../services/user_api";
import { useQueryClient } from "@tanstack/react-query";

// For demo purposes, create a mock userService
// Remove this and use your actual import

// Configuration Section Component
const ImportConfiguration = ({
  userType,
  setUserType
}) => {
  const userTypes = [
    { value: "student", label: "Võ sinh" },
    { value: "coach", label: "Huấn luyện viên" },
    { value: "instructor", label: "Hướng dẫn viên" },
  ];

  return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vai Trò Người Dùng *
        </label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {userTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
  );
};

// File Upload Component
const FileUploader = ({ file, onFileChange, fileInputKey }) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        File Excel *
      </label>
      <div className="relative">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
          key={fileInputKey}
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {file ? file.name : "Chọn file Excel để tải lên"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Định dạng: .xlsx, .xls</p>
          </div>
        </label>
      </div>
    </div>
  );
};

// Preview Table Component
const PreviewTable = ({ preview }) => {
  if (!preview) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
        <FileText className="mr-2 text-blue-600" />
        Xem Trước (5 Bản Ghi Đầu Tiên)
      </h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                STT
              </th>
              {preview.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {preview.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.rowNumber}
                </td>
                {row.data.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-sm text-gray-900">
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Error Alert Component
const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{error}</p>
      </div>
      <button onClick={onClose} className="ml-2">
        <X className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-600 text-green-800",
    red: "bg-red-50 border-red-200 text-red-600 text-red-800",
  };

  const [bgColor, borderColor, labelColor, valueColor] =
    colorClasses[color].split(" ");

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <p className={`text-sm ${labelColor} font-medium`}>{label}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
};

// Result Display Component
const ResultDisplay = ({ result, onDownloadError, onReset }) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Tổng Số" value={result.totalRows} color="blue" />
        <StatCard
          label="Thành Công"
          value={result.successCount}
          color="green"
        />
        <StatCard label="Thất Bại" value={result.failureCount} color="red" />
      </div>

      {result.failureCount > 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Có {result.failureCount} Bản Ghi Lỗi
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Vui lòng tải xuống file Excel chứa các bản ghi lỗi để xem chi
                tiết và sửa lại.
              </p>
            </div>
          </div>
          <button
            onClick={onDownloadError}
            className="flex items-center bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition"
          >
            <Download className="mr-2 h-5 w-5" />
            Tải File Lỗi
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Nhập Thành Công!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Tất cả {result.successCount} người dùng đã được thêm vào hệ
                thống.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
      >
        Nhập File Mới
      </button>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ onConfirm, onCancel, loading, disabled }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onConfirm}
        disabled={loading || disabled}
        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? "Đang Xử Lý..." : "Xác Nhận Nhập"}
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
      >
        Hủy Bỏ
      </button>
    </div>
  );
};

// Format Guide Component
const FormatGuide = () => {
  const columns = [
    { name: "Mã võ sinh", required: true, format: "Văn bản (VD: E001, B001)" },
    { name: "Họ và tên", required: true, format: "Văn bản" },
    {
      name: "Ngày sinh",
      required: true,
      format: "dd/MM/yyyy (VD: 04/05/2016)",
    },
    { name: "Cấp đai", required: true, format: "Văn bản (VD: ĐỎ 1, 1Đ)" },
    { name: "Địa chỉ", required: false, format: "Văn bản" },
    {
      name: "SĐT",
      required: false,
      format: "Số điện thoại (bắt đầu bằng 0, 10-11 số)",
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        Định Dạng File Excel
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        File Excel cần có các cột sau theo đúng thứ tự:
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left font-medium text-blue-700">
                Tên Cột
              </th>
              <th className="px-4 py-2 text-left font-medium text-blue-700">
                Bắt Buộc
              </th>
              <th className="px-4 py-2 text-left font-medium text-blue-700">
                Định Dạng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {columns.map((col, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2">{col.name}</td>
                <td className="px-4 py-2">{col.required ? "✓" : ""}</td>
                <td className="px-4 py-2">{col.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const UserImportSystem = ({classId}) => {
  const [file, setFile] = useState(null);
  const [userType, setUserType] = useState("student");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const queryClient = useQueryClient();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult(null);

    await parsePreview(selectedFile);
  };

  const parsePreview = async (file) => {
    try {
      const XLSX = await import(
        "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs"
      );
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Use defval to fill empty cells with empty string
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      const headers = jsonData[0];
      const headerCount = headers.length;
      const rows = jsonData
        .slice(1, 6)
        .filter((row) => row.some((cell) => cell !== ""));

      // Ensure each row has the same number of columns as headers
      const normalizedRows = rows.map((row, idx) => {
        const normalizedRow = [...row];
        // Pad row with empty strings if it's shorter than header count
        while (normalizedRow.length < headerCount) {
          normalizedRow.push("");
        }
        return {
          rowNumber: idx + 2,
          data: normalizedRow.slice(0, headerCount),
        };
      });

      setPreview({
        headers,
        rows: normalizedRows,
      });
    } catch (err) {
      setError("Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.");
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", userType);
    formData.append("classId", classId);

    try {
      // Call userService.importUsers with formData
      const response = await userService.importUsers(formData);

      if (response.type === "json") {
        // Success case - all users imported successfully
        setResult(response.data);
        console.log(response.data);
      } else if (response.type === "blob") {
        // Error case - some imports failed, Excel file returned
        downloadBlob(response.data, "users-import-errors.xlsx");

        // Try to read statistics from custom headers
        console.log(response.headers);
        const totalRows = response.headers.get("x-total-rows");
        const successCount = response.headers.get("x-success-count");
        const failureCount = response.headers.get("x-failure-count");

        if (totalRows !== null && successCount !== null && failureCount !== null) {
          // If headers exist, create result object to show statistics
          console.log(totalRows);
          
          setResult({
            totalRows: parseInt(totalRows),
            successCount: parseInt(successCount),
            failureCount: parseInt(failureCount),
            rows: [],
          });
        } else {
          // Fallback: show generic message if headers not available
          setError(
            'Một số bản ghi gặp lỗi khi nhập. File Excel chứa các bản ghi lỗi đã được tải xuống. Vui lòng kiểm tra cột "Lỗi" trong file, sửa lại và thử nhập lại.'
          );
          setPreview(null);
          setFile(null);
          setFileInputKey(Date.now());
        }
        queryClient.invalidateQueries({
            queryKey: ['members', 'active', classId],
            exact: true
        })
      }
    } catch (err) {
      console.error("Import error:", err);
      if (err.response) {
        setError(`Lỗi từ máy chủ: ${err.response.status}`);
      } else if (err.request) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadErrorFile = async () => {
    // Since backend returns file on first call, this shouldn't be needed
    // But keep it for UI consistency - just show message
    setError(
      "File lỗi đã được tải xuống tự động. Vui lòng kiểm tra thư mục tải xuống của bạn."
    );
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setFileInputKey(Date.now()); // Reset file input
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Nhập Người Dùng Từ Excel
          </h1>
          <p className="text-blue-700 mb-8">
            Tải lên file Excel để thêm người dùng vào hệ thống
          </p>

          <ImportConfiguration
            userType={userType}
            setUserType={setUserType}
            classId={classId}
          />

          <FileUploader
            file={file}
            onFileChange={handleFileChange}
            fileInputKey={fileInputKey}
          />

          <PreviewTable preview={preview} />

          <ErrorAlert error={error} onClose={() => setError("")} />

          {preview && !result && (
            <ActionButtons
              onConfirm={handleImport}
              onCancel={reset}
              loading={loading}
              disabled={!classId}
            />
          )}

          <ResultDisplay
            result={result}
            onDownloadError={downloadErrorFile}
            onReset={reset}
          />
        </div>

        <FormatGuide />
      </div>
    </div>
  );
};

export default UserImportSystem;
