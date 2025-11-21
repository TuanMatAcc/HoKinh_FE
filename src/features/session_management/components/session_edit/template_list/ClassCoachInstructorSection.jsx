import { useRef, useState } from "react";
import { Crown, Plus, UserCheck, UserX, Trash2, UserSearch } from "lucide-react";
import { getStatus } from "../../../../../utils/getVietnameseRole";
import { ConfirmDialog } from "../../../../../components/ConfirmDialog";
import UserSearchModal from "../../../../../components/UserSearchModal";

// Instructor Card Component
const InstructorCard = ({
  instructor,
  onToggleStatus,
  onSetShiftHead,
  isShiftHead,
  onDelete,
  showStatus = true,
}) => {
  return (
    <div
      className={`flex items-center justify-between bg-white rounded p-2 transition ${
        isShiftHead ? "ring-2 ring-amber-400 shadow-sm" : ""
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
            {isShiftHead && (
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">
                <Crown className="w-3 h-3" />
                <span>Ca trưởng</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showStatus && onToggleStatus && (
          <button
            onClick={onToggleStatus}
            className={`px-2 py-0.5 rounded text-xs font-medium transition hover:opacity-80 ${
              instructor.roleInSession !== "off"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {getStatus(instructor.roleInSession)}
          </button>
        )}
        {onSetShiftHead && (
          <button
            onClick={onSetShiftHead}
            className={`p-1 rounded transition ${
              isShiftHead
                ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                : "text-gray-400 hover:bg-gray-100 hover:text-amber-600"
            }`}
            title={isShiftHead ? "Bỏ ca trưởng" : "Đặt làm ca trưởng"}
          >
            <Crown className="w-3.5 h-3.5" />
          </button>
        )}
        <button 
          className="text-red-600 hover:text-red-700 p-1"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Instructors Section Component
const InstructorsSection = ({ template, onToggleStatus, onToggleRole, onDelete, onAdd }) => {
  const [confirmDeleteInstructor, setConfirmDeleteInstructor] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const deletedId = useRef(null);
  // Find the current shift head
  const shiftHeadId =
    template.mainInstructors.find((i) => i.roleInSession === "leader")
      ?.id;

  const handleSetShiftHead = (instructorId, isCurrentShiftHead) => {
    onToggleRole(template.dayOfWeek, instructorId, isCurrentShiftHead);
  };

  return (
    <>
      {showAddModal && (
        <UserSearchModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSelectUser={(user) => onAdd(template.dayOfWeek, user, "coach")}
        />
      )}
      {confirmDeleteInstructor && (
        <ConfirmDialog
          action={"remove"}
          title={"Xóa người dùng ra khỏi buổi học"}
          askDetail={"Bạn có chắc chắn muốn xóa người này ra khỏi buổi học không ?"}
          handleCancel={() => setConfirmDeleteInstructor(false)}
          handleConfirm={() => {
            setConfirmDeleteInstructor(false);
            onDelete(template.dayOfWeek, deletedId.current);
          }}
        />
      )}
        {/* Main Instructors */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Huấn luyện viên/ Hướng dẫn viên
            </h4>
            <button 
              className="text-blue-600 hover:text-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {template.mainInstructors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">
              Chưa có HLV/HDV
            </p>
          ) : (
            <div className="space-y-2">
              {template.mainInstructors.map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  instructor={instructor}
                  onToggleStatus={() =>
                    onToggleStatus(template.dayOfWeek, instructor.id)
                  }
                  onSetShiftHead={() =>
                    handleSetShiftHead(
                      instructor.id,
                      instructor.id === shiftHeadId
                    )
                  }
                  onDelete={() => {
                    deletedId.current = instructor.id;
                    setConfirmDeleteInstructor(true);
                  }}
                  isShiftHead={instructor.id === shiftHeadId}
                />
              ))}
            </div>
          )}
        </div>
    </>
  );
};

export default InstructorsSection;