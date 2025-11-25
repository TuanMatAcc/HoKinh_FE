import { useRef, useState } from "react";
import {
  Crown,
  Plus,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
} from "lucide-react";
import { getStatus } from "../../../../utils/getVietnameseRole";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";
import UserSearchModal from "../../../../components/UserSearchModal";
import AnnouncementUI from "../../../../components/Announcement";
import SessionMemberDetailModal from "./SessionMemberDetailModal";

// Instructor Card Component
const SessionInstructorCard = ({
  instructor,
  onToggleStatus,
  onSetShiftHead,
  isShiftHead,
  onDelete,
  onToggleAttended,
  setSelectedInstructor,
  showStatus = true,
  allowEdit = false,
  isEditMode = false,
}) => {
  
  return (
    <div
      title={instructor.userId}
      className={`flex items-center justify-between bg-white rounded p-2 transition ${
        isShiftHead && isEditMode ? "ring-2 ring-amber-400 shadow-sm" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        {showStatus &&
          (instructor.roleInSession !== "off" ? (
            <UserCheck className="w-4 h-4 text-green-600" />
          ) : (
            <UserX className="w-4 h-4 text-orange-600" />
          ))}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-900">{instructor.name}</span>
            {/* Show badge next to name only in edit mode */}
            {isShiftHead && isEditMode && (
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">
                <Crown className="w-3 h-3" />
                <span>Ca trưởng</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Attended Toggle Button - Circular style with icon */}
        {onToggleAttended && (
          <button
            onClick={onToggleAttended}
            disabled={!isEditMode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition border ${
              instructor.attended
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
            title={instructor.attended ? "Đã có mặt" : "Vắng mặt"}
          >
            {instructor.attended ? (
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

        {/* Non-edit mode: Show shift head badge in place of status button */}
        {!isEditMode && isShiftHead ? (
          <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">
            <Crown className="w-3 h-3" />
            <span>Ca trưởng</span>
          </div>
        ) : /* Show status button for non-shift-head or when not in non-edit mode with shift head */
        showStatus && onToggleStatus && !isEditMode && isShiftHead ? (
          <></>
        ) : (
          <button
            onClick={onToggleStatus}
            disabled={!isEditMode}
            className={`px-2 py-0.5 rounded text-xs font-medium transition hover:opacity-80 ${
              instructor.roleInSession !== "off"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {getStatus(instructor.roleInSession)}
          </button>
        )}

        {/* Crown button for setting shift head (edit mode only) */}
        {onSetShiftHead && isEditMode && (
          <button
            onClick={onSetShiftHead}
            className={`p-1 rounded transition ${
              isShiftHead
                ? `bg-amber-100 text-amber-600 hover:bg-amber-200`
                : `text-gray-400 hover:bg-gray-100 hover:text-amber-600`
            }`}
            title={isShiftHead ? "Bỏ ca trưởng" : "Đặt làm ca trưởng"}
          >
            <Crown className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete button (edit mode only) */}
        {isEditMode && (
          <>
            <button
              className="text-blue-600 hover:text-blue-700 p-1"
              onClick={() => setSelectedInstructor(instructor)}
              title="Xem chi tiết"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              className="text-red-600 hover:text-red-700 p-1"
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Instructors Section Component
const SessionInstructorSection = ({
  session,
  onToggleStatus,
  onToggleRole,
  onToggleAttended,
  onDelete,
  onAdd,
  handleSaveMemberDetail,
  allowEdit = true,
}) => {
  const [confirmDeleteInstructor, setConfirmDeleteInstructor] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const deletedId = useRef(null);
  const [showError, setShowError] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const errorMessage = useRef("");

  // Find the current shift head
  const shiftHeadId = session.mainInstructors.find(
    (i) => i.roleInSession === "leader"
  )?.userId;

  const handleSetShiftHead = (instructorId, isCurrentShiftHead) => {
    onToggleRole(session.dayOfWeek, instructorId, isCurrentShiftHead);
  };

  const handleAddInstructor = (user) => {
    try {
      onAdd(session.dayOfWeek, user, "mainInstructors");
    } catch (error) {
      errorMessage.current = error.message;
      setShowError(true);
    }
  };

  return (
    <>
      {showAddModal && (
        <UserSearchModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSelectUser={(user) => handleAddInstructor(user)}
          typeSearch={"mainInstructors"}
        />
      )}
      {showError && (
        <AnnouncementUI
          setVisible={setShowError}
          message={errorMessage.current}
        />
      )}
      {confirmDeleteInstructor && (
        <ConfirmDialog
          action={"remove"}
          title={"Xóa người dùng ra khỏi buổi học"}
          askDetail={
            "Bạn có chắc chắn muốn xóa người này ra khỏi buổi học không ?"
          }
          handleCancel={() => setConfirmDeleteInstructor(false)}
          handleConfirm={() => {
            setConfirmDeleteInstructor(false);
            onDelete(session.dayOfWeek, deletedId.current);
          }}
        />
      )}
      {selectedInstructor&& (
        <SessionMemberDetailModal
          sessionMember={selectedInstructor}
          isOpen={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          onSave={handleSaveMemberDetail}
        />
      )}

      {/* Main Instructors */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-blue-900">
            Huấn luyện viên/ Hướng dẫn viên
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
        {session.mainInstructors.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-2">
            Chưa có HLV/HDV
          </p>
        ) : (
          <div className="space-y-2">
            {session.mainInstructors.map((instructor) => (
              <SessionInstructorCard
                key={instructor.userId}
                instructor={instructor}
                onToggleStatus={() =>
                  onToggleStatus(session.dayOfWeek, instructor.userId)
                }
                onToggleAttended={() => onToggleAttended(instructor.userId)}
                onSetShiftHead={() =>
                  handleSetShiftHead(
                    instructor.userId,
                    instructor.userId === shiftHeadId
                  )
                }
                onDelete={() => {
                  deletedId.current = instructor.userId;
                  setConfirmDeleteInstructor(true);
                }}
                isShiftHead={instructor.userId === shiftHeadId}
                allowEdit={allowEdit}
                isEditMode={isEditMode}
                setSelectedInstructor={setSelectedInstructor}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SessionInstructorSection;