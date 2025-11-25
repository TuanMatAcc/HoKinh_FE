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
import { MemberCardSkeleton } from "../../../../components/skeleton/MemberCardSkeleton";
import SessionMemberDetailModal from "./SessionMemberDetailModal";

// Students Section Component
const SessionStudentSection = ({
  classId,
  session,
  onDelete,
  onAdd,
  handleToggleAttendance,
  handleSaveMemberDetail,
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

  console.log(session.students)

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
        <SessionMemberDetailModal
          sessionMember={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={handleSaveMemberDetail}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Võ Sinh ({session.students ? session.students.length : 0})
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
          {session.students ? (
            session.students.map((student) => (
              <div
                key={student.userId}
                title={student.userId}
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
                      onClick={() => handleToggleAttendance(student.userId)}
                      disabled={!isEditMode}
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
                          deletedId.current = student.userId;
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
            ))
          ) : (
            <>
              <MemberCardSkeleton />
              <MemberCardSkeleton />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionStudentSection;
