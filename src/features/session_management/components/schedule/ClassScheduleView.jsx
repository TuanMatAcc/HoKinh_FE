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
import { convertDateInputToVN, getStudyHour } from "../../../../utils/formatDateAndTimeType";
import SessionCard from "./SessionCard";
import AnnouncementUI from "../../../../components/Announcement";
import { useClassSessionInRange, useStudentInSession } from "../../../../hooks/useClassSessionInRange";
import Button from "../../../../components/Button";
import { useQueryClient } from "@tanstack/react-query";

const ClassScheduleView = ({setSelectedClass, setView, selectedClass}) => {
  const queryClient = useQueryClient();
  // Weekly daysOfWeek data
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const [selectedDate, setSelectedDate] = useState(weekDays[0].date);
  const [clickedSession, setClickedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const { data: students } = useStudentInSession({
    sessionId: sessionDetail?.id
  });
  const [showSuccess, setShowSuccess] = useState(null);
  const [showError, setShowError] = useState(null);
  const errorMessage = useRef("");

  const { data: sessions } = useClassSessionInRange({
    startDate: weekDays[0].date,
    endDate: weekDays[weekDays.length - 1].date,
    classId: selectedClass.id,
  });
  console.log(weekDays);
  console.log(sessions);

  useEffect(() => {
    if (selectedDate) {
      setWeekDays(generateWeekFromDate(selectedDate));
    }
    if(sessionDetail) {
      setSessionDetail(sessionDtl => ({
        ...sessionDtl,
        students: students?.data ? students.data : []
      }))
    }
  }, [selectedDate, students]);

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
    if (!err) {
      queryClient.setQueryData(
        [
          "sessions",
          selectedClass.id,
          weekDays[0].date,
          weekDays[weekDays.length - 1].date,
        ],
        (prev) => ({
          ...prev,
          data: prev.data.map((s) =>
            s.id === clickedSession.id ? clickedSession : s
          ),
        })
      );
      setShowSuccess(clickedSession.date);
      setClickedSession(null);
    } else {
      errorMessage.current = err;
      setShowError(true);
    }
  }

  const onSaveFullSession = () => {
    const err = validateSessionDetail();
    if (!err) {
      queryClient.setQueryData(
        [
          "sessions",
          selectedClass.id,
          weekDays[0].date,
          weekDays[weekDays.length - 1].date,
        ],
        (prev) => ({
          ...prev,
          data: prev.data.map((s) =>
            s.id === sessionDetail.id ? sessionDetail : s
          ),
        })
      );
      setShowSuccess(sessionDetail.date);
      setSessionDetail(null);
    } else {
      errorMessage.current = err;
      setShowError(true);
    }
    queryClient.setQueryData(
      ["session", "students", sessionDetail?.id],
      (prev) => ({
        ...prev,
        data: sessionDetail.students,
      })
    );
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
        if (instructor.userId === instructorId) {
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

  const onSessionFieldChange = (name, value) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      [name]: value
  }));
  }

  // Updated toggleInstructorRole function with proper shift head logic
  const onToggleRole = (dayOfWeek, instructorId, isSettingShiftHead) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) => {
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
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.filter(
        (instructor) => instructor.userId !== memberId
      ),
      students: sessionDtl.students.filter(
        (student) => student.userId !== memberId
      ),
    }));
  };

  const onAddMembers = (dayOfWeek, member, role) => {
    const exist = sessionDetail[role].find((mem) => mem.userId === member.userId);
    if (!exist) {
      setSessionDetail((sessionDtl) => ({
        ...sessionDtl,
        [role]: [
          ...sessionDtl[role],
          role === "mainInstructors"
            ? {
                id: member.userId,
                name: member.name,
                roleInSession: "assistant",
              }
            : {
                id: member.userId,
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
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      mainInstructors: sessionDtl.mainInstructors.map((instructor) =>
        instructor.userId === memberId
          ? {
              ...instructor,
              ...editData
            }
          : instructor
      ),
      students: sessionDtl.students.map((student) =>
        student.userId === memberId
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
        instructor.userId === memberId
          ? {
              ...instructor,
              attended: !instructor.attended,
            }
          : instructor
      ),
      students: sessionDtl.students.map((student) =>
        student.userId === memberId
          ? {
              ...student,
              attended: !student.attended,
            }
          : student
      ),
    }));
  }

  const updateStudents = (memberId, name, value) => {
    queryClient.setQueryData(['session', 'students', sessionDetail?.id], prev => ({
      ...prev,
      data: prev.data.map((student) => student.id === memberId ? ({
        ...student,
        [name]: value
      }) : student)
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
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button
              onClick={() => {
                setSessionDetail(null);
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
                  {getStudyHour(selectedClass.startHour)} - {getStudyHour(selectedClass.endHour)}
                </span>
              </div>
            </div>
          </div>
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
            onTextFieldChange={onSessionFieldChange}
          />
        </>
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
                    {getStudyHour(selectedClass.startHour)} - {getStudyHour(selectedClass.endHour)}
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
              sessions={sessions?.data ? sessions.data : []}
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