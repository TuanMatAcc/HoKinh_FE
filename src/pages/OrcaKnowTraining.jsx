import { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  RefreshCw,
  File,
  FileText,
  Image,
  FileCode,
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Calendar,
  HardDrive,
} from "lucide-react";
import { fileStoreAPI } from "../services/ai_api";

// File icon component
const FileIcon = ({ type }) => {
  const iconClass = "w-8 h-8";

  switch (type?.toLowerCase()) {
    case "pdf":
      return <FileText className={`${iconClass} text-red-500`} />;
    case "docx":
    case "doc":
      return <FileText className={`${iconClass} text-blue-500`} />;
    case "txt":
      return <File className={`${iconClass} text-gray-500`} />;
    case "jpg":
    case "jpeg":
    case "png":
      return <Image className={`${iconClass} text-purple-500`} />;
    case "json":
    case "xml":
      return <FileCode className={`${iconClass} text-green-500`} />;
    default:
      return <File className={`${iconClass} text-gray-400`} />;
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    STATE_ACTIVE: "bg-green-100 text-green-800 border-green-200",
    PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  const icons = {
    STATE_ACTIVE: <CheckCircle className="w-3 h-3" />,
    PROCESSING: <Loader2 className="w-3 h-3 animate-spin" />,
    error: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.PROCESSING
      }`}
    >
      {icons[status]}
      {status === "STATE_ACTIVE"
        ? "Đã lập chỉ mục"
        : status === "PROCESSING"
        ? "Đang xử lý"
        : "Lỗi"}
    </span>
  );
};

// File item component
const FileItem = ({ file, onDelete, onReindex }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa file "${file.name}"?`)) return;

    setIsDeleting(true);
    try {
      await onDelete(file.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      await onReindex(file.id);
    } finally {
      setIsReindexing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <FileIcon type={file.type} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {file.name}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {file.size}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {file.uploadDate}
            </span>
          </div>
          <div className="mt-2">
            <StatusBadge status={file.status} />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReindex}
            disabled={isReindexing || file.status === "PROCESSING"}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Lập chỉ mục lại"
          >
            {isReindexing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Xóa file"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
const VectorStoreManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await fileStoreAPI.getFiles();
      setFiles(data);
    } catch (error) {
      showNotification("Không thể tải danh sách file", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/json",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(pdf|docx|txt|json)$/i)
    ) {
      showNotification("Chỉ hỗ trợ file PDF, DOCX, TXT, JSON", "error");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification("File không được vượt quá 10MB", "error");
      return;
    }

    setUploading(true);
    try {
      const result = await fileStoreAPI.uploadFile(file);
      console.log(result);
      
      setFiles((prev) => [result, ...prev]);
      showNotification(`File "${file.name}" đã được tải lên thành công`);
      event.target.value = "";
    } catch (error) {
      showNotification("Không thể tải lên file", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await fileStoreAPI.deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      showNotification("File đã được xóa");
    } catch (error) {
      showNotification("Không thể xóa file", "error");
    }
  };

  const handleReindex = async (fileId) => {
    try {
      await fileStoreAPI.reindexFile(fileId);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "PROCESSING" } : f))
      );
      showNotification("Đã bắt đầu lập chỉ mục lại");

      // Simulate status update after 3 seconds
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "STATE_ACTIVE" } : f))
        );
      }, 3000);
    } catch (error) {
      showNotification("Không thể lập chỉ mục lại", "error");
    }
  };
  console.log(files);
  
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Vector Store
          </h1>
          <p className="text-gray-600">
            Quản lý các file đã được chuyển đổi thành vector cho AI
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadFiles}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </button>

              <label className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                <Upload className="w-5 h-5" />
                {uploading ? "Đang tải lên..." : "Tải lên"}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.docx,.txt,.json"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Hỗ trợ: PDF, DOCX, TXT, JSON (tối đa 10MB)</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.length}
                </p>
                <p className="text-sm text-gray-600">Tổng số file</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.filter((f) => f.status === "STATE_ACTIVE").length}
                </p>
                <p className="text-sm text-gray-600">Đã lập chỉ mục</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.filter((f) => f.status === "PROCESSING").length}
                </p>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </div>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh sách file...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery
                  ? "Không tìm thấy file nào"
                  : "Chưa có file nào. Tải lên file đầu tiên!"}
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onReindex={handleReindex}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VectorStoreManager;
