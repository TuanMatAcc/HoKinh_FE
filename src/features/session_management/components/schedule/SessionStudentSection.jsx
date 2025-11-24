import { useRef, useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import UserSearchModal from "../../../../components/UserSearchModal";
import AnnouncementUI from "../../../../components/Announcement";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";

// Student Detail Modal Component
const StudentDetailModal = ({ student, isOpen, onClose, onSave }) => {
  const [editData, setEditData] = useState({
    review: student.review || "",
    checkinTime: student.checkinTime || "",
  });

  const handleSave = () => {
    onSave(student.id, editData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            Chi tiết: {student.name}
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Ngày</label>
                <input
                  type="date"
                  value={formatCheckinDate(editData.checkinTime)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Giờ</label>
                <input
                  type="time"
                  value={formatCheckinTime(editData.checkinTime)}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Nhận xét
            </label>
            <textarea
              value={editData.review}
              onChange={(e) =>
                setEditData({ ...editData, review: e.target.value })
              }
              placeholder="Nhập nhận xét về học viên..."
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

// Students Section Component
const SessionStudentSection = ({
  classId,
  session,
  onDelete,
  onAdd,
  handleToggleAttendance,
  handleSaveStudentDetail,
  allowEdit = true,
}) => {
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false);
  const deletedId = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddStudent = (user) => {
    try {
      onAdd(session.dayOfWeek, user, "students");
    } catch (error) {
      errorMessage.current = error.message;
      setShowError(true);
    }
  };

  return (
    <>
      {showError && (
        <AnnouncementUI
          setVisible={setShowError}
          message={errorMessage.current}
        />
      )}
      {showAddModal && (
        <UserSearchModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSelectUser={(user) => handleAddStudent(user)}
          typeSearch={"students"}
        />
      )}
      {confirmDeleteStudent && (
        <ConfirmDialog
          action={"remove"}
          title={"Xóa người dùng ra khỏi buổi học"}
          askDetail={
            "Bạn có chắc chắn muốn xóa người này ra khỏi buổi học không ?"
          }
          handleCancel={() => setConfirmDeleteStudent(false)}
          handleConfirm={() => {
            setConfirmDeleteStudent(false);
            onDelete(session.dayOfWeek, deletedId.current);
          }}
        />
      )}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={handleSaveStudentDetail}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Võ Sinh ({session.students.length})
          </h4>
          <div className="flex items-center gap-2">
            {/* Edit Mode Toggle Button */}
            {allowEdit && (
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                  isEditMode
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Hủy</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa</span>
                  </>
                )}
              </button>
            )}
            {/* Add Button - only show in edit mode */}
            {allowEdit && isEditMode && (
              <button
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {session.students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-gray-900 truncate">
                  {student.name}
                </span>
                {!(student.classId === classId) && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded shrink-0">
                    Trái buổi
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Attendance Badge - Clickable */}
                {handleToggleAttendance && (
                  <button
                    onClick={() => handleToggleAttendance(student.id)}
                    disabled= {!isEditMode}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition border ${
                      student.attended
                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                    title={student.attended ? "Đã có mặt" : "Vắng mặt"}
                  >
                    {student.attended ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Có mặt</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Vắng</span>
                      </>
                    )}
                  </button>
                )}

                {isEditMode && (
                  <>
                    {/* Detail Button */}
                    <button
                      className="text-blue-600 hover:text-blue-700 p-1"
                      onClick={() => setSelectedStudent(student)}
                      title="Xem chi tiết"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete Button - only show in edit mode */}
                    <button
                      className="text-red-600 hover:text-red-700 p-1"
                      onClick={() => {
                        deletedId.current = student.id;
                        setConfirmDeleteStudent(true);
                      }}
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionStudentSection;
