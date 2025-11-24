import {
  X
} from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";
import SessionCard from "./SessionCard";

const ClickedSessionModal = ({
  clickedSession,
  weekDays,
  setClickedSession,
  onSaveSession
}) => {
    const handleTimeChange = (startTime, endTime) => {
        setClickedSession((clkSession) => ({
        ...clkSession,
        startTime: startTime,
        endTime: endTime,
        }));
    };

    const onToggleStatus = (dayOfWeek, instructorId) => {
      setClickedSession((clkSession) => ({
        ...clkSession,
        mainInstructors: clkSession.mainInstructors.map((instructor) => {
          if (instructor.id === instructorId) {
            if (instructor.roleInSession !== "off") {
              return {
                ...instructor,
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
          instructor.id === memberId
            ? {
                ...instructor,
                attended: !instructor.attended,
              }
            : instructor
        ),
        students: clkSession.students.map((student) =>
          student.id === memberId
            ? {
                ...student,
                attended: !student.attended,
              }
            : student
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
          if (instructor.id === instructorId) {
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
          (instructor) => instructor.id !== memberId
        ),
        students: clickedSession.students.filter(
          (student) => student.id !== memberId
        ),
      }));
    };

    const onAddMembers = (dayOfWeek, member, role) => {
      const exist = clickedSession[role].find((mem) => mem.id === member.id);
      if (!exist) {
        setClickedSession((clkSession) => ({
          ...clkSession,
          [role]: [
            ...clkSession[role],
            role === "mainInstructors"
              ? {
                  id: member.id,
                  name: member.name,
                  roleInSession: "assistant",
                }
              : {
                  id: member.id,
                  name: member.name,
                  roleInSession: "student",
                  isRegular: member.classId === selectedClass.id,
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
        className="w-130 bg-white rounded-lg shadow-2xl border-4 border-blue-500 p-6 overflow-y-auto"
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
          onToggleStatus={onToggleStatus}
          onToggleRole={onToggleRole}
          onTimeChange={handleTimeChange}
          onAdd={onAddMembers}
          onDeleteMembers={onDeleteMembers}
          onReportChange={() => {}}
          onTopicChange={() => {}}
          onVideoLinkChange={() => {}}
          onSaveSession={onSaveSession}
          onToggleAttended={onToggleAttended}
        />
      </div>
    </div>
  );
};

export default ClickedSessionModal;
