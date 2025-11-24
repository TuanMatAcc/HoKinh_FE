import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Header from "../../../../components/Header";
import getDay from "../../../../utils/getVietnameseDay";
import WeeklySessionsGrid from "./WeeklySessionsGrid";
import WeekNavigation from "./WeekNavigation";
import { getCurrentWeekDays } from "../../../../data/getCurrentWeekDays";
import { generateWeekFromDate } from "../../../../data/generateWeekDaysFromDate";
import SuccessAnnouncement from "../../../../components/SuccessAnnouncement";
import { convertDateInputToVN } from "../../../../utils/formatDateAndTimeType";
import SessionCard from "./SessionCard";
import AnnouncementUI from "../../../../components/Announcement";

const ClassScheduleView = ({setSelectedClass, setView, selectedClass}) => {
  // Weekly daysOfWeek data
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const [selectedDate, setSelectedDate] = useState(weekDays[0].date);
  const [clickedSession, setClickedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [showError, setShowError] = useState(null);
  const errorMessage = useRef("");
  const [sessions, setSessions] = useState([
    {
      id: 1,
      date: "2025-11-04",
      startTime: "18:00",
      endTime: "19:30",
      status: 1,
      mainInstructors: [
        {
          id: 1,
          name: "Nguyễn Văn A",
          roleInSession: "leader",
          attended: true,
        },
        {
          id: 2,
          name: "Trần Thị B",
          roleInSession: "assistant",
          attended: true,
        },
      ],
      students: [
        {
          id: "u0022",
          name: "Trần Thị Huhu",
          roleInSession: "student",
          review: "",
          attended: true,
          classId: 2,
          checkinTime: "",
        },
      ],
      topic: "YoGa",
      videoLink: "https://www.youtube.com",
      report: "hu",
    },
    {
      id: 2,
      date: "2025-11-06",
      startTime: "18:00",
      endTime: "19:30",
      status: 0,
      mainInstructors: [
        {
          id: 1,
          name: "Nguyễn Văn A",
          roleInSession: "assistant",
        },
      ],
      students: [
        {
          id: "u0022",
          name: "Trần Thị Huhu",
          roleInSession: "student",
          review: "",
          attended: true,
          classId: 2,
          checkinTime: "",
        },
      ],
      topic: "YoGa",
      videoLink: "https://www.youtube.com",
      report: "hu",
    },
    {
      id: 3,
      date: "2025-11-08",
      startTime: "18:00",
      endTime: "19:30",
      status: 0,
      mainInstructors: [
        {
          id: 2,
          name: "Trần Thị B",
          roleInSession: "assistant",
        },
      ],
      students: [
        {
          id: "u0022",
          name: "Trần Thị Huhu",
          roleInSession: "student",
          review: "",
          attended: true,
          classId: 2,
          checkinTime: "",
        },
      ],
      topic: "YoGa",
      videoLink: "https://www.youtube.com",
      report: "hu",
    },
  ]);

  useEffect(() => {
    if (selectedDate) {
      setWeekDays(generateWeekFromDate(selectedDate));
    }
  }, [selectedDate]);

  const stepAWeek = ({direction}) => weekDays.map((item) => {
      const date = new Date(item.date); // Convert string to Date
      if(direction === 'down') date.setDate(date.getDate() - 7);
      else date.setDate(date.getDate() + 7); // Subtract 7 days
      return {
        day: item.day,
        date: date.toISOString().split("T")[0], // Format as "YYYY-MM-DD"
      };
    });

  const handlePreviousWeekClick = () => {
    const previousWeekDays = stepAWeek({ direction: "down" });
    setSelectedDate(previousWeekDays[0].date);
    setWeekDays(previousWeekDays);
  }

  const handleNextWeekClick = () => {
    const nextWeekDays = stepAWeek({ direction: "up" });
    setSelectedDate(nextWeekDays[0].date);
    setWeekDays(nextWeekDays);
  }

  const onSaveSession = () => {
    const err = validateClickedSession();
    if(!err) {
      setSessions((prev) =>
        prev.map((s) => (s.id === clickedSession.id ? clickedSession : s))
      );
      setShowSuccess(clickedSession.date);
      setClickedSession(null);
    }
    else {
      errorMessage.current = err;
      setShowError(true);
    }
  }

  const onSaveFullSession = () => {
    const err = validateSessionDetail();
    if(!err) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionDetail.id ? sessionDetail : s))
      );
      setShowSuccess(sessionDetail.date);
      setSessionDetail(null);
    }
    else {
      errorMessage.current = err;
      setShowError(true);
    }
  };

  const validateSessionDetail = () => {
    const leaderExist = sessionDetail.mainInstructors.find(
      (instructor) => instructor.roleInSession === "leader"
    );
    if(!leaderExist) return "Mỗi buổi học phải có 1 ca trưởng";
    return "";
  }

  const validateClickedSession = () => {
    const leaderExist = clickedSession.mainInstructors.find(
      (instructor) => instructor.roleInSession === "leader"
    );
    if (!leaderExist) return "Mỗi buổi học phải có 1 ca trưởng";
    return "";
  };

  const handleTimeChange = (startTime, endTime) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      startTime: startTime,
      endTime: endTime,
    }));
  };

  const onToggleStatus = (dayOfWeek, instructorId) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) => {
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

  // Updated toggleInstructorRole function with proper shift head logic
  const onToggleRole = (dayOfWeek, instructorId, isSettingShiftHead) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) => {
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
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.filter(
        (instructor) => instructor.id !== memberId
      ),
      students: sessionDtl.students.filter(
        (student) => student.id !== memberId
      ),
    }));
  };

  const onAddMembers = (dayOfWeek, member, role) => {
    const exist = sessionDetail[role].find((mem) => mem.id === member.id);
    if (!exist) {
      setSessionDetail((sessionDtl) => ({
        ...sessionDtl,
        [role]: [
          ...sessionDtl[role],
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

  const onSesionMemberDetailChange = (memberId, editData) => {
    console.log(editData);
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) =>
        instructor.id === memberId
          ? {
              ...instructor,
              ...editData
            }
          : instructor
      ),
      students: sessionDtl.students.map((student) =>
        student.id === memberId
          ? {
              ...student,
              ...editData
            }
          : student
      ),
    }));
  }

  const onToggleAttended = (memberId) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) =>
        instructor.id === memberId
          ? {
              ...instructor,
              attended: !instructor.attended,
            }
          : instructor
      ),
      students: sessionDtl.students.map((student) =>
        student.id === memberId
          ? {
              ...student,
              attended: !student.attended,
            }
          : student
      ),
    }));
  }

  return (
    <>
      {showSuccess && (
        <SuccessAnnouncement
          actionAnnouncement={"Cập nhật thành công buổi học"}
          detailAnnouncement={
            "Bạn đã cập nhật buổi học ngày " +
            convertDateInputToVN(showSuccess) +
            " thành công"
          }
          onBack={() => setShowSuccess(null)}
        />
      )}
      {showError && (
        <AnnouncementUI
          message={errorMessage.current}
          setVisible={setShowError}
        />
      )}
      {sessionDetail ? (
        <SessionCard
          session={sessionDetail}
          isBrief={false}
          onToggleRole={onToggleRole}
          onToggleAttended={onToggleAttended}
          onAdd={onAddMembers}
          onToggleStatus={onToggleStatus}
          onDeleteMembers={onDeleteMembers}
          onTimeChange={handleTimeChange}
          onSesionMemberDetailChange={onSesionMemberDetailChange}
          onSaveSession={onSaveFullSession}
        />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Back Button */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <button
                onClick={() => {
                  setSelectedClass(null);
                  setView("list");
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Quay lại danh sách lớp</span>
              </button>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {selectedClass.name}
              </h1>
              <div className="flex items-center gap-4 text-blue-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {selectedClass.daysOfWeek
                      .split("-")
                      .map((d) => getDay(d))
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {selectedClass.startTime} - {selectedClass.endTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Week Navigation */}
            <WeekNavigation
              weekDays={weekDays}
              handleNextWeekClick={handleNextWeekClick}
              handlePreviousWeekClick={handlePreviousWeekClick}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Weekly Grid */}
            <WeeklySessionsGrid
              selectedClass={selectedClass}
              sessions={sessions}
              weekDays={weekDays}
              setClickedSession={setClickedSession}
              clickedSession={clickedSession}
              onSaveSession={onSaveSession}
              setSessionDetail={setSessionDetail}
            />

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Thêm Buổi Học Hàng Loạt
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Xuất Lịch Học
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassScheduleView;