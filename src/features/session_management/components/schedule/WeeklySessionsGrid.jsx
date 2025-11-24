import { useState } from "react";
import {
  Clock,
  Plus,
  Edit2,
  AlertCircle,
} from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";
import { convertDateInputToVN } from "../../../../utils/formatDateAndTimeType";
import ClickedSessionModal from "./ClickedSessionModal";
import { getSessionStatus } from "../../../../utils/getStatusSession";
import SessionInstructorSection from "./SessionInstructorSection";

const WeeklySessionsGrid = ({ weekDays, sessions, selectedClass, clickedSession, setClickedSession, onSaveSession, setSessionDetail }) => {

  const [enabledOffScheduleDays, setEnabledOffScheduleDays] = useState(
    new Set()
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-blue-100 text-blue-700";
      case 1:
        return "bg-green-100 text-green-700";
      case 2:
        return "bg-gray-100 text-gray-700";
      case 3:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleEnableOffScheduleDay = (date) => {
    setEnabledOffScheduleDays((prev) => {
      const newSet = new Set(prev);
      newSet.add(date);
      return newSet;
    });
  };

  const handleDisableOffScheduleDay = (date) => {
    setEnabledOffScheduleDays((prev) => {
      const newSet = new Set(prev);
      newSet.delete(date);
      return newSet;
    });
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map((dayInfo) => {
          const daySession = sessions.find(
            (session) => session.date === dayInfo.date
          );
          const isScheduledDay = selectedClass.daysOfWeek
            .split("-")
            .includes(dayInfo.day);
          const isOffScheduleDayEnabled = enabledOffScheduleDays.has(
            dayInfo.date
          );

          return (
            <div
              key={dayInfo.date}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
              onClick={(e) => {
                // Only open detail if clicking on existing session
                if (daySession && e.target.closest(".session-card")) {
                  setClickedSession({
                    ...daySession,
                    dayOfWeek: dayInfo.day
                  });
                }
              }}
            >
              {/* Day Header */}
              <div
                className={`p-4 ${
                  isScheduledDay ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                <h3 className="text-white font-bold text-center">
                  {getDay(dayInfo.day)}
                </h3>
                <p className="text-white text-md text-center opacity-90">
                  {convertDateInputToVN(dayInfo.date, 'y')}
                </p>
              </div>

              {/* Full View */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {daySession ? (
                  <div
                    key={daySession.id}
                    className="session-card border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 transition cursor-pointer"
                  >
                    {/* Session Time and Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">
                          {daySession.startTime + " - " + daySession.endTime}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          daySession.status
                        )}`}
                      >
                        {getSessionStatus(daySession.status)}
                      </span>
                    </div>

                    {/* Main Instructors TODO */}
                    <SessionInstructorSection
                      session={daySession}
                      onToggleRole={() => {}}
                      onAdd={() => {}}
                      onDelete={() => {}}
                      onToggleStatus={() => {}}
                      allowEdit={false}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-1 mt-3 pt-2 border-t border-blue-100">
                      <button 
                        className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionDetail(daySession);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ) : isScheduledDay ? (
                  // Scheduled day without session
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">
                      Chưa có buổi học
                    </p>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1 mx-auto">
                      <Plus className="w-4 h-4" />
                      Thêm buổi học
                    </button>
                  </div>
                ) : isOffScheduleDayEnabled ? (
                  // Off-schedule day - enabled for adding
                  <div className="text-center py-6">
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <p className="text-yellow-800 text-sm font-medium">
                          Buổi học trái ca
                        </p>
                      </div>
                      <p className="text-yellow-700 text-xs">
                        Ngày này không nằm trong lịch học thường xuyên
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" />
                        Thêm buổi học
                      </button>
                      <button
                        onClick={() =>
                          handleDisableOffScheduleDay(dayInfo.date)
                        }
                        className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  // Off-schedule day - not enabled yet
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">
                      Ngày không có lịch học
                    </p>
                    <button
                      onClick={() => handleEnableOffScheduleDay(dayInfo.date)}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm flex items-center gap-1 mx-auto"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Thêm buổi trái ca
                    </button>
                  </div>
                )}

                {/* Add Session Button for days with existing sessions */}
                {daySession && isScheduledDay && (
                  <button className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" />
                    Thêm buổi học
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Detail Panel - Positioned absolutely outside grid */}
      {clickedSession && (
        <ClickedSessionModal
          clickedSession={clickedSession}
          setClickedSession={setClickedSession}
          weekDays={weekDays}
          onSaveSession={onSaveSession}
        />
      )}
    </div>
  );
};

export default WeeklySessionsGrid;
