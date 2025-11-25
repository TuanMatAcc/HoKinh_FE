import { useState } from "react";
import {
  Trash2,
  X,
  Clock,
  FileText,
} from "lucide-react";
import formatDate from "../../../../utils/formatDate";

// SessionMember Detail Modal Component
const SessionMemberDetailModal = ({ sessionMember, isOpen, onClose, onSave }) => {
  const [editData, setEditData] = useState({
    review: sessionMember.review || "",
    checkinTime: sessionMember.checkinTime || "",
  });
  const [isEditTime, setIsEditTime] = useState(false);
  console.log(editData);

  const handleSave = () => {
    onSave(sessionMember.userId, editData);
    onClose();
  };

  const formatCheckinDate = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const formatCheckinTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toTimeString().slice(0, 5); // HH:MM
  };

  const handleDateChange = (dateValue) => {
    console.log(dateValue);
    if (!dateValue) {
      setEditData({ ...editData, checkinTime: "" });
      return;
    }
    const timeValue = formatCheckinTime(editData.checkinTime) || "00:00";
    const combined = `${dateValue}T${timeValue}:00`;
    setEditData({ ...editData, checkinTime: combined });
  };

  const handleTimeChange = (timeValue) => {
    if (!timeValue) return;
    const dateValue =
      formatCheckinDate(editData.checkinTime) ||
      new Date().toISOString().slice(0, 10);
    const combined = `${dateValue}T${timeValue}:00`;
    setEditData({ ...editData, checkinTime: combined });
  };

  const handleRemoveCheckinTime = () => {
    setEditData({ ...editData, checkinTime: "" });
    setIsEditTime(false);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);
    return `${dateStr}T${timeStr}:00`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            Chi tiết: {sessionMember.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Check-in Date & Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Thời gian check-in
            </label>
            {isEditTime ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Ngày
                    </label>
                    <input
                      type="date"
                      value={
                        editData.checkinTime !== ""
                          ? formatCheckinDate(editData.checkinTime)
                          : new Date().toISOString().slice(0, 10)
                      }
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Giờ
                    </label>
                    <input
                      type="time"
                      value={
                        editData.checkinTime !== ""
                          ? formatCheckinTime(editData.checkinTime)
                          : new Date().toTimeString().slice(0, 5)
                      }
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleRemoveCheckinTime}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa thời gian check-in
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="text-sm text-gray-500 italic">
                  {editData.checkinTime !== ""
                    ? formatDate({
                        dateString: editData.checkinTime,
                        region: "vi-VN",
                      })
                    : "Chưa có thời gian check in"}
                </span>
                <button
                  onClick={() => {
                    if (editData.checkinTime === "") {
                      setEditData({
                        ...editData,
                        checkinTime: getCurrentDateTime(),
                      });
                    }
                    setIsEditTime(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                >
                  {editData.checkinTime !== ""
                    ? "Chỉnh sửa"
                    : "Thêm giờ check-in"}
                </button>
              </div>
            )}
          </div>

          {/* Review */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Nhận xét
            </label>
            <textarea
              value={editData.review}
              onChange={(e) => {
                setEditData({ ...editData, review: e.target.value });
                console.log("haha");
              }}
              placeholder="Nhập nhận xét về người này..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionMemberDetailModal;
