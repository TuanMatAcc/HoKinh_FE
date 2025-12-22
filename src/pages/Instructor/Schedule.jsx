import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  MapPin,
  AlertCircle,
  Video,
  FileText,
  Clock,
} from "lucide-react";
import { SessionDetailPage } from "../../features/instructor-session/components/SessionReport";
import { getInstructorSessionStatus } from "../../utils/getStatusSession";
import { getCurrentWeekDays } from "../../data/getCurrentWeekDays";
import WeekNavigation from "../../features/session_management/components/schedule/WeekNavigation";
import { sessionUserService } from "../../services/session_user_api";
import {
  useInstructorSessionInRange,
  useStudentInstructorSession,
} from "../../hooks/useInstructorSessionInRange";
import { ThreeDotLoader } from "../../components/ActionFallback";
import SuccessAnnouncement from "../../components/SuccessAnnouncement";
import { generateWeekFromDate } from "../../data/generateWeekDaysFromDate";
import { sessionService } from "../../services/session_api";
import { useQueryClient } from "@tanstack/react-query";
import AnnouncementUI from "../../components/Announcement";
import { getStudyHour } from "../../utils/formatDateAndTimeType";
import { convertFromDateInputToVN } from "../../utils/formatDateAndTimeType";

// Helper function to format time from LocalDateTime
const formatCheckinTime = (localDateTime) => {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Helper function to extract time from LocalDateTime for comparison
const convertToDateFromLocalDateTime = (localDateTime) => {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  console.log(localDateTime);

  return date;
};

// Helper function to convert LocalTime string to minutes
const convertToDateFromDateAndTime = (date, time) => {
  if (!date || !time) return null;
  console.log(`${date}T${time}`);

  return new Date(`${date}T${time}`);
};

// Check if check-in was late
const isLateCheckin = (checkinTime, date, startTime) => {
  if (!checkinTime || !startTime) return false;
  const checkinMinutes = convertToDateFromLocalDateTime(checkinTime);
  const startMinutes = convertToDateFromDateAndTime(date, startTime);
  return checkinMinutes > startMinutes;
};

const CheckinTimeDisplay = ({ checkinTime, date, startTime }) => {
  if (!checkinTime) return null;

  const isLate = isLateCheckin(checkinTime, date, startTime);
  const formattedTime = formatCheckinTime(checkinTime);

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg text-xs sm:text-sm ${
        isLate
          ? "bg-red-50 border border-red-200"
          : "bg-green-50 border border-green-200"
      }`}
    >
      {isLate ? (
        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
      ) : (
        <Check className="w-4 h-4 shrink-0 text-green-600" />
      )}
      <span
        className={`font-medium ${isLate ? "text-red-700" : "text-green-700"}`}
      >
        {isLate ? "Check-in muộn:" : "Check-in đúng giờ:"} {formattedTime}
      </span>
    </div>
  );
};

const isCheckInEnabled = (date, startTime, endTime) => {
  const now = Date.now();
  const start = Date.parse(`${date}T${startTime}`);
  const end = Date.parse(`${date}T${endTime}`);
  return now >= start - 1800000 && now <= end;
};

// SessionStatusBadge Component
const SessionStatusBadge = ({
  date,
  startTime,
  endTime,
  status,
  report,
  videoLink,
}) => {
  const statusInfo = getInstructorSessionStatus(
    date,
    startTime,
    endTime,
    status,
    report,
    videoLink
  );
  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.color}`}
    >
      {statusInfo.text}
    </span>
  );
};

// RoleBadge Component
const RoleBadge = ({ role }) => {
  if (role === "off") {
    return (
      <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
        Không dạy
      </span>
    );
  }
  const isLeader = role === "leader";
  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        isLeader ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"
      }`}
    >
      {isLeader ? "Trưởng ca" : "HLV/HDV"}
    </span>
  );
};

// MissingDataAlert Component
const MissingDataAlert = ({ report, videoLink }) => {
  const missingReport = !report;
  const missingVideo = !videoLink;

  if (!missingReport && !missingVideo) return null;

  return (
    <div className="flex items-center gap-2 mt-3 p-2 sm:p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
      <div className="text-xs sm:text-sm text-amber-800">
        <span className="font-semibold">Cần hoàn thiện:</span>
        {missingReport && <span className="ml-1">Báo cáo</span>}
        {missingReport && missingVideo && <span>, </span>}
        {missingVideo && <span className="ml-1">Video</span>}
      </div>
    </div>
  );
};

// CheckInButton Component
const CheckInButton = ({
  sessionId,
  date,
  startTime,
  endTime,
  checkinStatus,
  role,
  onCheckIn,
}) => {
  const enabled =
    isCheckInEnabled(date, startTime, endTime) &&
    !checkinStatus &&
    role !== "off";
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCheckIn = () => {
    if (!enabled) return;
    if (!navigator.geolocation) {
      setErrorMessage("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onCheckIn({
          sessionId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          sessionDate: date,
        });
      },
      (error) => {
        console.log("Geo error:", error);

        if (error.code === 2) {
          let watchTimeout;
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              clearTimeout(watchTimeout);
              navigator.geolocation.clearWatch(watchId);
              onCheckIn({
                sessionId,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                sessionDate: date,
              });
            },
            (watchError) => {
              console.log("watchPosition also failed:", watchError);
              clearTimeout(watchTimeout);
              navigator.geolocation.clearWatch(watchId);
              setTimeout(() => {
                setErrorMessage(
                  "Trình duyệt không thể lấy vị trí. Vui lòng đóng trình duyệt hoàn toàn và mở lại."
                );
              }, 0);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );

          watchTimeout = setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
            setTimeout(() => {
              setErrorMessage(
                "Safari không thể lấy vị trí. Vui lòng đóng Safari hoàn toàn và mở lại."
              );
            }, 0);
          }, 6000);

          return;
        }

        setTimeout(() => {
          if (error.code === 1) {
            setErrorMessage(
              "Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt."
            );
          } else {
            setErrorMessage("Không thể lấy vị trí. Vui lòng bật định vị.");
          }
        }, 0);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <>
      <button
        onClick={handleCheckIn}
        disabled={!enabled}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition w-full sm:w-auto ${
          enabled
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {checkinStatus ? (
          <Check className="w-4 h-4" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        {checkinStatus ? "Đã check in" : "Check in"}
      </button>

      {errorMessage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setErrorMessage(null)}
        >
          <div
            className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-800 text-sm sm:text-base mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const ReportButton = ({ setSelectedSession, setView }) => {
  return (
    <button
      onClick={() => {
        setView();
        setSelectedSession();
      }}
      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
    >
      Báo cáo
    </button>
  );
};

const SessionCard = ({ session, onCheckIn, setSelectedSession, setView }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 ${
        session.role === "leader"
          ? "border-purple-500"
          : session.role === "assistant"
          ? "border-teal-500"
          : "border-red-500"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 wrap-break-word">
            {session.className}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 wrap-break-word">
            {session.facilityName}
          </p>
        </div>
        <div className="flex flex-row sm:flex-col gap-2 items-start sm:items-end w-full sm:w-auto">
          <RoleBadge role={session.role} />
          <SessionStatusBadge
            date={session.date}
            startTime={session.startTime}
            endTime={session.endTime}
            status={session.status}
            report={session.report}
            videoLink={session.videoLink}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-700 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0 text-blue-600" />
          <span>
            {getStudyHour(session.startTime)} - {getStudyHour(session.endTime)}
          </span>
        </div>
        {session.facilityMapsLink && (
          <a
            href={session.facilityMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-blue-600 hover:text-blue-800 wrap-break-word"
          >
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="wrap-break-word">{session.facilityAddress}</span>
          </a>
        )}
        {session.topic && (
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 shrink-0 text-gray-600 mt-0.5" />
            <span className="wrap-break-word">Chủ đề: {session.topic}</span>
          </div>
        )}
      </div>

      {session.checkinTime && (
        <div className="mb-3">
          <CheckinTimeDisplay
            date={session.date}
            checkinTime={session.checkinTime}
            startTime={session.startTime}
          />
        </div>
      )}

      {session.report && (
        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200 text-xs sm:text-sm text-green-800">
          <FileText className="w-4 h-4 inline mr-2" />
          Đã có báo cáo
        </div>
      )}

      {session.videoLink && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200 text-xs sm:text-sm text-blue-800 wrap-break-word">
          <Video className="w-4 h-4 inline mr-2" />
          <a
            href={session.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 break-all"
          >
            Đã có video
          </a>
        </div>
      )}

      <MissingDataAlert report={session.report} videoLink={session.videoLink} />

      {session.status === 0 && (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
          <ReportButton
            setSelectedSession={setSelectedSession}
            setView={setView}
          />
          {session.role !== "off" && (
            <CheckInButton
              sessionId={session.id}
              date={session.date}
              startTime={session.startTime}
              checkinStatus={session.attended}
              role={session.role}
              endTime={session.endTime}
              onCheckIn={onCheckIn}
            />
          )}
        </div>
      )}
    </div>
  );
};

// DayColumn Component
const DayColumn = ({
  dayInfo,
  sessions,
  onCheckIn,
  setSelectedSession,
  setView,
}) => {
  const dayNames = [
    "",
    "",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];
  const isToday = dayInfo.date === new Date().toISOString().split("T")[0];

  return (
    <div
      className={`flex-1 min-w-full sm:min-w-[280px] lg:min-w-[300px] ${
        isToday ? "bg-blue-50" : "bg-gray-50"
      } rounded-lg p-3 sm:p-4`}
    >
      <div
        className={`text-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 ${
          isToday ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <h3
          className={`font-bold text-base sm:text-lg ${
            isToday ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {dayNames[parseInt(dayInfo.day)]}
        </h3>
        <p
          className={`text-xs sm:text-sm ${
            isToday ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {convertFromDateInputToVN(dayInfo.date, "y")}
        </p>
      </div>

      <div className="space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onCheckIn={onCheckIn}
              setSelectedSession={() => setSelectedSession(session)}
              setView={setView}
            />
          ))
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">Không có lịch</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const InstructorSessionUI = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState("list");
  const [showSuccess, setShowSuccess] = useState("");
  const [showError, setShowError] = useState("");
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const [inProgress, setInProgress] = useState("");

  const { data: mockSessions } = useInstructorSessionInRange({
    startDate: weekDays[0].date,
    endDate: weekDays[weekDays.length - 1].date,
  });

  const { data: students } = useStudentInstructorSession({
    sessionId: selectedSession?.id,
  });

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  useEffect(() => {
    if (selectedDate) {
      setWeekDays(generateWeekFromDate(selectedDate));
    }
    if (!mockSessions && !students) {
      setInProgress("Đang tải lịch dạy...");
    } else {
      setInProgress("");
    }
    if (students?.data) {
      setSelectedSession((prev) => ({
        ...prev,
        students: students?.data ? students.data : [],
      }));
      console.log(students.data);
    }
  }, [selectedDate, mockSessions, students]);
  console.log(mockSessions);

  const handleCheckIn = async (checkInData) => {
    try {
      const res = (await sessionUserService.checkIn(checkInData)).data;
      setShowSuccess(res.message);
      queryClient.invalidateQueries([
        "sessions",
        "instructor",
        weekDays[0].date,
        weekDays[weekDays.length - 1].date,
      ]);
      console.log("Check-in data:", checkInData);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        setShowError(message);
        if (status === 404) {
          console.error("Not found:", message);
        } else if (status === 403) {
          console.error("Forbidden:", message);
        } else if (status === 500) {
          console.error("Server error:", message);
        } else {
          console.error("Unexpected error:", status, message);
        }
      }
    }
  };

  const reportSession = async (session) => {
    setInProgress("Đang lưu báo cáo môn học");
    const sessionData = {
      id: session.id,
      topic: session.topic,
      report: session.report,
      videoLink: session.videoLink,
      students: session.students,
    };
    try {
      setShowSuccess((await sessionService.reportSession(sessionData)).data);
      queryClient.invalidateQueries({
        queryKey: [
          "sessions",
          "instructor",
          weekDays[0].date,
          weekDays[weekDays.length - 1].date,
        ],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["session", "instructor", "students", session.id],
        exact: true,
      });
    } catch (error) {
      if (error.response) {
        const message = error.response.data;
        setShowError(message);
      }
    } finally {
      setInProgress("");
    }
  };

  if (view === "list") {
    return (
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">
        {inProgress && <ThreeDotLoader message={inProgress} />}
        {showSuccess && (
          <SuccessAnnouncement
            actionAnnouncement={"Thao tác thành công"}
            detailAnnouncement={showSuccess}
            onBack={() => setShowSuccess("")}
          />
        )}
        {showError && (
          <AnnouncementUI message={showError} setVisible={setShowError} />
        )}
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Lịch Huấn Luyện
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Quản lý lịch dạy và điểm danh
            </p>
          </div>

          <WeekNavigation
            weekDays={weekDays}
            handleNextWeekClick={handleNextWeek}
            handlePreviousWeekClick={handlePreviousWeek}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-x-auto pb-4">
            {weekDays.map((day) => (
              <DayColumn
                key={day.date}
                dayInfo={day}
                sessions={
                  mockSessions?.get(day.date) ? mockSessions.get(day.date) : []
                }
                setSelectedSession={setSelectedSession}
                setView={() => setView("detail")}
                onCheckIn={handleCheckIn}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (view === "detail") {
    return (
      <>
        {showSuccess && (
          <SuccessAnnouncement
            actionAnnouncement={"Thao tác thành công"}
            detailAnnouncement={showSuccess}
            onBack={() => setShowSuccess("")}
          />
        )}
        {showError && (
          <AnnouncementUI message={showError} setVisible={setShowError} />
        )}
        <SessionDetailPage
          session={selectedSession}
          setSession={setSelectedSession}
          onSave={reportSession}
          onBack={() => {
            setView("list");
            setSelectedSession(null);
          }}
        />
      </>
    );
  }
};

export default InstructorSessionUI;
