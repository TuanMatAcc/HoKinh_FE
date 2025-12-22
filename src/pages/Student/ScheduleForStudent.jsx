import { useEffect, useState } from "react";
import { Calendar, X, Clock, MapPin, MessageSquare, User } from "lucide-react";
import { convertFromDateInputToVN } from "../../utils/formatDateAndTimeType";
import { getCurrentWeekDays } from "../../data/getCurrentWeekDays";
import { generateWeekFromDate } from "../../data/generateWeekDaysFromDate";
import WeekNavigation from "../../features/session_management/components/schedule/WeekNavigation";
import getDay from "../../utils/getVietnameseDay";
import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../../services/session_api";
import { ThreeDotLoader } from "../../components/ActionFallback";

const getDisplayStatus = (startTime, endTime, date, status) => {
  if (status === 1) return { label: "Đã hủy", code: -1 };

  const now = new Date();
  const sessionDate = new Date(date);
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startDateTime = new Date(sessionDate);
  startDateTime.setHours(startHour, startMin, 0);

  const endDateTime = new Date(sessionDate);
  endDateTime.setHours(endHour, endMin, 0);

  if (now < startDateTime) return { label: "Chưa bắt đầu", code: 0 };
  if (now >= startDateTime && now <= endDateTime)
    return { label: "Đang diễn ra", code: 1 };
  return { label: "Đã kết thúc", code: 2 };
};

const getStatusColor = (displayStatusCode) => {
  switch (displayStatusCode) {
    case -1:
      return "bg-red-100 text-red-700 border-red-300";
    case 0:
      return "bg-blue-100 text-blue-700 border-blue-300";
    case 1:
      return "bg-green-100 text-green-700 border-green-300";
    case 2:
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// SessionCard Component
const SessionCard = ({ session, onViewReview }) => {
  const displayStatus = getDisplayStatus(
    session.startTime,
    session.endTime,
    session.date,
    session.status
  );
  const statusColor = getStatusColor(displayStatus.code);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-3 sm:p-4 hover:shadow-md transition mb-2 sm:mb-3">
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
            {session.className}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>
              {session.startTime.slice(0, 5)} - {session.endTime.slice(0, 5)}
            </span>
          </div>
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${statusColor} whitespace-nowrap shrink-0`}
        >
          {displayStatus.label}
        </span>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="font-medium">{session.facilityName}</div>
            <a
              href={session.mapsLink ? session.mapsLink : null}
              className={`${
                session.mapsLink
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {session.address}
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 gap-2">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
          <span
            className={`text-xs sm:text-sm font-medium ${
              session.attended ? "text-green-600" : "text-red-600"
            }`}
          >
            {session.attended ? "Có mặt" : "Vắng"}
          </span>
        </div>

        <button
          onClick={() => onViewReview(session)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm font-medium whitespace-nowrap shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Nhận xét
        </button>
      </div>
    </div>
  );
};

// DayColumn Component
const DayColumn = ({ day, sessions, onViewReview }) => {
  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;

  return (
    <div
      className={`w-full md:flex-1 md:min-w-[280px] ${
        isToday ? "bg-blue-50" : "bg-gray-50"
      } rounded-lg p-3 sm:p-4 mb-3 md:mb-0`}
    >
      <div
        className={`text-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 ${
          isToday ? "border-blue-400" : "border-gray-300"
        }`}
      >
        <div
          className={`text-xs sm:text-sm font-medium ${
            isToday ? "text-blue-600" : "text-gray-600"
          } mb-1`}
        >
          {getDay(day.day)}
        </div>
        <div
          className={`text-base sm:text-lg font-bold ${
            isToday ? "text-blue-900" : "text-gray-900"
          }`}
        >
          {convertFromDateInputToVN(day.date, "m")}
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session, idx) => (
            <SessionCard
              key={idx}
              session={session}
              onViewReview={onViewReview}
            />
          ))
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">Không có lịch học</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ReviewModal Component
const ReviewModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Nhận xét buổi học
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">
              {session.className}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{convertFromDateInputToVN(session.date, "y")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>
                  {session.startTime.slice(0, 5)} -{" "}
                  {session.endTime.slice(0, 5)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              Nhận xét từ giáo viên:
            </h4>
            {session.review ? (
              <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                {session.review}
              </p>
            ) : (
              <p className="text-gray-400 italic text-sm sm:text-base">
                Chưa có nhận xét
              </p>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function StudentSchedule() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const [selectedSession, setSelectedSession] = useState(null);
  const [inProgress, setInProgress] = useState("Đang tải thời khóa biểu...");

  // Sample data
  const {data: sessions} = useQuery({
    queryKey: [
      "session",
      "student-use",
      weekDays[0].date,
      weekDays[weekDays.length - 1].date,
    ],
    queryFn: () =>
      sessionService.getScheduleForStudent(
        weekDays[0].date,
        weekDays[weekDays.length - 1].date
      ),
    staleTime: 600000,
  });

  const handlePreviousWeek = () => {
    const firstDay = new Date(weekDays[0].date);
    firstDay.setDate(firstDay.getDate() - 7);
    const newWeek = generateWeekFromDate(firstDay.toISOString().split("T")[0]);
    setWeekDays(newWeek);
  };

  const handleNextWeek = () => {
    const firstDay = new Date(weekDays[0].date);
    firstDay.setDate(firstDay.getDate() + 7);
    const newWeek = generateWeekFromDate(firstDay.toISOString().split("T")[0]);
    setWeekDays(newWeek);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const newWeek = generateWeekFromDate(newDate);
    setWeekDays(newWeek);
  };

  const getSessionsForDay = (date) => {
    return sessions.data.filter((session) => session.date === date);
  };

  useEffect(() => {
    if(sessions?.data) {
        setInProgress("");
    }
    else {
        setInProgress("Đang tải thời khóa biểu...");
    }
  }, [sessions]);

  return (
    <>
     {inProgress && 
     <ThreeDotLoader
        message={inProgress}
     />}
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Lịch học trong tuần
          </h1>

          <WeekNavigation
            weekDays={weekDays}
            handleNextWeekClick={handleNextWeek}
            handlePreviousWeekClick={handlePreviousWeek}
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
          />

          {/* Mobile: Vertical Stack, Desktop: Horizontal Scroll */}
          <div className="flex flex-col md:flex-row md:gap-4 md:overflow-x-auto md:pb-4">
            {weekDays.map((day) => (
              <DayColumn
                key={day.date}
                day={day}
                sessions={sessions ? getSessionsForDay(day.date) : []}
                onViewReview={setSelectedSession}
              />
            ))}
          </div>

          {selectedSession && (
            <ReviewModal
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
