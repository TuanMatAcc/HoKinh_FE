import {
  X
} from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";
import SessionCard from "./SessionCard";

const ClickedSessionModal = ({
  clickedSession,
  classId,
  weekDays,
  setClickedSession,
  onDeleteSession,
  onSaveSession
}) => {
    const handleTimeChange = (startTime, endTime) => {
        setClickedSession((clkSession) => ({
        ...clkSession,
        startTime: startTime,
        endTime: endTime,
        }));
    };

    const onSesionMemberDetailChange = (memberId, editData) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        mainInstructors: clkSession.mainInstructors.map((instructor) =>
          instructor.userId === memberId
            ? {
                ...instructor,
                ...editData,
              }
            : instructor
        ),
        students: clkSession.students ? clickedSession.students.map((student) =>
          student.userId === memberId
            ? {
                ...student,
                ...editData,
              }
            : student
        ) : null,
      }));
    };

    const onToggleStatus = (dayOfWeek, instructorId) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        mainInstructors: clkSession.mainInstructors.map((instructor) => {
          if (instructor.userId === instructorId) {
            if (instructor.roleInSession !== "off") {
              return {
                ...instructor,
                attended: false,
                roleInSession: "off",
              };
            }
            return {
              ...instructor,
              roleInSession: "assistant",
            };
          }
          return instructor;
        }),
      }));
    };

    const onToggleAttended = (memberId) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        mainInstructors: clkSession.mainInstructors.map((instructor) =>
          instructor.userId === memberId
            ? {
                ...instructor,
                roleInSession: instructor.attended
                  ? instructor.roleInSession
                  : instructor.roleInSession === "off"
                  ? "assistant"
                  : instructor.roleInSession,
                attended: !instructor.attended,
              }
            : instructor
        ),
      }));
    };

    // Updated toggleInstructorRole function with proper shift head logic
    const onToggleRole = (
      dayOfWeek,
      instructorId,
      isSettingShiftHead
    ) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        mainInstructors: clkSession.mainInstructors.map((instructor) => {
          // If this is the instructor being clicked
          if (instructor.userId === instructorId) {
            // If they are currently the shift head, remove the role
            if (isSettingShiftHead) {
              return {
                ...instructor,
                // Revert to previous role (coach or instructor)
                roleInSession: "assistant",
              };
            }
            // Otherwise, set them as shift head
            return {
              ...instructor,
              roleInSession: "leader",
            };
          }

          // Remove shift head role from all other instructors
          if (instructor.roleInSession === "leader" && !isSettingShiftHead) {
            return {
              ...instructor,
              // Default back to coach when losing shift head role
              roleInSession: "assistant",
            };
          }

          return instructor;
        }),
      }));
    };

    const onDeleteMembers = (dayOfWeek, memberId) => {
      setClickedSession((clkSession) => ({
        ...clickedSession,
        mainInstructors: clickedSession.mainInstructors.filter(
          (instructor) => instructor.userId !== memberId
        ),
      }));
    };

    const onSessionStatusChange = (statusValue) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        status: statusValue,
      }));
    };

    const onAddMembers = (dayOfWeek, member, role) => {
      const exist = clickedSession[role].find((mem) => mem.userId === member.id);
      if (!exist) {
        setClickedSession((clkSession) => ({
          ...clkSession,
          [role]: [
            ...clkSession[role],
            role === "mainInstructors"
              ? {
                  id: Date.now(),
                  userId: member.id,
                  name: member.name,
                  roleInSession: "assistant",
                  classId: member.classId,
                  checkinTime: "",
                  review: "",
                  attended: false,
                  isNew: true
                }
              : {
                  id: Date.now(),
                  userId: member.id,
                  name: member.name,
                  roleInSession: "student",
                  classId: member.classId,
                  checkinTime: "",
                  review: "",
                  attended: false,
                  isNew: true
                },
          ],
        }));
      } else {
        throw new Error(
          "Người dùng " + member.name + " đã được thêm vào buổi học này"
        );
      }
    };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="w-150 bg-white rounded-lg shadow-2xl border-4 border-blue-500 p-6 overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-200">
          <div>
            <h4 className="font-bold text-blue-900 text-xl">
              {getDay(
                weekDays.find((d) => d.date === clickedSession.date)?.day
              )}
              , {clickedSession.date}
            </h4>
            <p className="text-sm text-blue-600 mt-1">
              Thông tin chi tiết các buổi học
            </p>
          </div>
          <button
            className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
            onClick={() => setClickedSession(null)}
          >
            <X color="red" size={20} />
          </button>
        </div>

        {/* Sessions Detail */}
        <SessionCard
          session={clickedSession}
          classId={classId}
          onToggleStatus={onToggleStatus}
          onToggleRole={onToggleRole}
          onTimeChange={handleTimeChange}
          onAdd={onAddMembers}
          onDeleteMembers={onDeleteMembers}
          onTextFieldChange={() => {}}
          onDeleteSession={onDeleteSession}
          onSaveSession={onSaveSession}
          onToggleAttended={onToggleAttended}
          onSesionMemberDetailChange={onSesionMemberDetailChange}
          onSessionStatusChange={onSessionStatusChange}
        />
      </div>
    </div>
  );
};

export default ClickedSessionModal;
