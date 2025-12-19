import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { deleteQuerySession, setQuerySession, setQuerySessionStudents } from "../../hooks/setQuerySession";
import { sessionService } from "../../../../services/session_api";
import { useActiveClassMembers } from "../../../../hooks/useClassMembers";
import { ThreeDotLoader } from "../../../../components/ActionFallback";

const ClassScheduleView = ({setSelectedClass, setView, selectedClass}) => {
  const queryClient = useQueryClient();
  // Weekly daysOfWeek data
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const [selectedDate, setSelectedDate] = useState(weekDays[0].date);
  const deletedUsers = useRef([]);
  const [clickedSession, setClickedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [inProgress, setInProgress] = useState(true);
  const progressStatement = useRef("Đang tải thông tin buổi học...");
  // User for a brand new session (members of class)
  const { data: defaultUsers } = useActiveClassMembers({ classId: selectedClass?.id });
  const [isEdit, setIsEdit] = useState(false);
  const { data: students } = useStudentInSession({
    sessionId: sessionDetail?.id
  });
  console.log(defaultUsers);
  const [showSuccess, setShowSuccess] = useState(null);
  const successAction = useRef("");
  const [showError, setShowError] = useState(null);
  const errorMessage = useRef("");

  const { data: sessions } = useClassSessionInRange({
    startDate: weekDays[0].date,
    endDate: weekDays[weekDays.length - 1].date,
    classId: selectedClass.id,
  });
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
    if(!defaultUsers || !sessions) {
      setInProgress(true);
      progressStatement.current = 'Đang tải thông tin buổi học...';
    }
    else {
      setInProgress(false);
    }
  }, [selectedDate, students, defaultUsers, sessions]);

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

  const onDeleteSession = async (sessionId) => {
    console.log(sessionId);
    try {
      setInProgress(true);
      const delSession = await sessionService.deleteSessionAndUser(sessionId);

      console.log(delSession);
      deleteQuerySession({
        sessionId: sessionId,
        selectedClassId: selectedClass.id,
        startDate: weekDays[0].date,
        endDate: weekDays[weekDays.length - 1].date,
        queryClient: queryClient
      });
      setClickedSession(null);
      setSessionDetail(null);
      setIsEdit(false);
      setShowSuccess(delSession.data.date);
      successAction.current = 'xóa';
    }
    catch(error) {
      if(error?.response) {
        setShowError(true);
        errorMessage.current = error.response.data;
        console.log(error.response.data);
      }
      console.log(error);
    }
    finally {
      setInProgress(false);
    }
  }

  const onSaveSession = async () => {
    onUpdateSession({
      session: clickedSession,
      setSession: setClickedSession,
      validateSession: validateClickedSession,
    });
  }

  const onSaveFullSession = async () => {
    if(sessionDetail.id) {
      onUpdateSession({
        session: sessionDetail,
        setSession: setSessionDetail,
        validateSession: validateSessionDetail,
      });
    }
    else {
      const err = validateSessionDetail();
      if(!err) {
        setInProgress(true);
        progressStatement.current = "Đang tạo buổi học...";
        const sessionData = {
          ...sessionDetail,
          mainInstructors: sessionDetail.mainInstructors.map((instructor) =>
            instructor.isNew ? { ...instructor, id: null } : instructor
          ),
          students: sessionDetail.students.map((student) =>
            student.isNew ? { ...student, id: null } : student
          ),
          classId: selectedClass.id,
        };
        console.log(sessionData);
        try {
          const createdSession = await sessionService.createSessionAndUser(
            sessionData
          );
          setQuerySession({
            session: createdSession.data,
            selectedClassId: selectedClass.id,
            startDate: weekDays[0].date,
            endDate: weekDays[weekDays.length - 1].date,
            queryClient: queryClient,
          });
        } catch (error) {
          setShowError(true);
          if (error.response) {
            errorMessage.current = error.response.data;
          } else {
            errorMessage.current = error;
          }
        } finally {
          setInProgress(false);
          setIsEdit(false);
          setSessionDetail(null);
        }
      }
      else {
        errorMessage.current = err;
        setShowError(true);
      }
    }
  };

  const onUpdateSession = async ({session, setSession, validateSession}) => {
    const err = validateSession();
    if (!err) {
      setInProgress(true);
      progressStatement.current = "Đang cập nhật buổi học...";
      const sessionData = {
        ...session,
        mainInstructors: session.mainInstructors.map((instructor) =>
          instructor.isNew ? { ...instructor, id: null } : instructor
        ),
        students: session.students ? session.students.map((student) =>
          student.isNew ? { ...student, id: null } : student 
        ) : null,
        sessionUserIds: deletedUsers.current
      };
      console.log(sessionData);
      try {
        const updatedSession = await sessionService.updateSessionAndUser(sessionData.id, sessionData);
        
        setQuerySession({
          session: updatedSession.data,
          selectedClassId: selectedClass.id,
          startDate: weekDays[0].date,
          endDate: weekDays[weekDays.length - 1].date,
          queryClient: queryClient,
        });
        setQuerySessionStudents({
          sessionId: updatedSession?.data.id,
          students: updatedSession?.data.students,
          queryClient: queryClient,
        });
        setShowSuccess(session.date);
        successAction.current = 'cập nhật';
        setIsEdit(false);
        setSession(null);
      } catch (error) {
        if (error?.response) {
          errorMessage.current = error.response.data;
          setShowError(true);
        } else {
          errorMessage.current = error;
          setShowError(true);
        }
      }
    } else {
      errorMessage.current = err;
      setShowError(true);
    }
    setInProgress(false);
  };

  const onSessionStatusChange = (statusValue) => {
    setSessionDetail((sessionDtl) => ({
      ...sessionDtl,
      status: statusValue
    }));
  }

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
    let exist = sessionDetail.mainInstructors.find(
      (instructor) => instructor.userId === memberId
    );
    if(!exist) {
      exist = sessionDetail.students.find(
        (student) => student.userId === memberId
      );
    }
    if(exist.id) {
      deletedUsers.current.push(exist.id);
    }
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
    const exist = sessionDetail[role].find((mem) => mem.userId === member.id);
    if (!exist) {
      setSessionDetail((sessionDtl) => ({
        ...sessionDtl,
        [role]: [
          ...sessionDtl[role],
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
              roleInSession: instructor.attended
                ? instructor.roleInSession
                : instructor.roleInSession === "off"
                ? "assistant"
                : instructor.roleInSession,
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

  return (
    <>
      {showSuccess && (
        <SuccessAnnouncement
          actionAnnouncement={"Hoàn tất thao tác"}
          detailAnnouncement={
            "Bạn đã " + successAction.current + " buổi học ngày " +
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
      {inProgress && (
        <ThreeDotLoader
          size="lg"
          color="blue"
          message={progressStatement.current}
        />
      )}
      {isEdit ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button
              onClick={() => {
                setIsEdit(false);
                deletedUsers.current = [];
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
            classId={selectedClass.id}
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
            onDeleteSession={onDeleteSession}
            onTextFieldChange={onSessionFieldChange}
            onSessionStatusChange={onSessionStatusChange}
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
              setIsEdit={setIsEdit}
              setClickedSession={setClickedSession}
              deletedUsers={deletedUsers}
              clickedSession={clickedSession}
              onSaveSession={onSaveSession}
              onDeleteSession={onDeleteSession}
              setSessionDetail={setSessionDetail}
              defaultUsers={defaultUsers}
            />

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-4">
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