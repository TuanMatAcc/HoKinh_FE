import { useRef, useState } from "react";
import {
  Users,
  Plus,
  Trash2
} from "lucide-react";
import UserSearchModal from "../../../../../components/UserSearchModal";
import AnnouncementUI from "../../../../../components/Announcement";
import { ConfirmDialog } from "../../../../../components/ConfirmDialog";

// Students Section Component
const StudentsSection = ({ template, onDelete, onAdd }) => {
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false);
  const deletedId = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");
  
  const handleAddStudent = (user) => {
    try {
      onAdd(template.dayOfWeek, user, "students");
    } 
    catch(error) {
      errorMessage.current = error.message;
      setShowError(true);
    }
  }

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
          askDetail={"Bạn có chắc chắn muốn xóa người này ra khỏi buổi học không ?"}
          handleCancel={() => setConfirmDeleteStudent(false)}
          handleConfirm={() => {
            setConfirmDeleteStudent(false);
            onDelete(template.dayOfWeek, deletedId.current);
          }}
        />
      )}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Võ Sinh ({template.students.length})
          </h4>
          <button
            className="text-blue-600 hover:text-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {template.students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-white rounded p-2"
            >
              <span className="text-sm text-gray-900">{student.name}</span>
              {!student.isRegular && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  Trái buổi
                </span>
              )}
              <button
                className="text-red-600 hover:text-red-700 p-1"
                onClick={() => {
                  deletedId.current = student.id;
                  setConfirmDeleteStudent(true);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentsSection;
