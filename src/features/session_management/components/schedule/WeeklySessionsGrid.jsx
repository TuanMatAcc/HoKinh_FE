import { useState } from "react";
import {
  Clock,
  Users,
  UserCheck,
  UserX,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";

const WeeklySessionsGrid = ({weekDays, sessions, selectedClass}) => {
  const [clickedSession, setClickedSession] = useState(null);
  const getStatusColor = (status) => {
    switch (status) {
      case "Chưa bắt đầu":
        return "bg-blue-100 text-blue-700";
      case "Đang diễn ra":
        return "bg-green-100 text-green-700";
      case "Đã kết thúc":
        return "bg-gray-100 text-gray-700";
      case "Đã hủy":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getInstructorStatusColor = (status) => {
    return status === "Dạy"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
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

        return (
          <div
            key={dayInfo.date}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
            onClick={() => setClickedSession(daySession)}
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
              <p className="text-white text-sm text-center opacity-90">
                {dayInfo.date}
              </p>
            </div>

            {/* Full View */}
            <div className="p-4 space-y-3 min-h-[200px]">
              {daySession ? (
                <div
                  key={daySession.id}
                  className="border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 transition"
                >
                  {/* Session Time and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        {daySession.time}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        daySession.status
                      )}`}
                    >
                      {daySession.status}
                    </span>
                  </div>

                  {/* Main Instructors */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">HLV/HDV Chính:</p>
                    <div className="space-y-1">
                      {daySession.mainInstructors.map((instructor) => (
                        <div
                          key={instructor.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-blue-900 truncate flex-1">
                            {instructor.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ml-1 ${getInstructorStatusColor(
                              instructor.status
                            )}`}
                          >
                            {instructor.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Substitute Instructors */}
                  {daySession.substituteInstructors.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-600 mb-1">
                        HLV/HDV Dạy Thế:
                      </p>
                      <div className="space-y-1">
                        {daySession.substituteInstructors.map((instructor) => (
                          <div
                            key={instructor.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-green-900 truncate">
                              {instructor.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-1 mt-3 pt-2 border-t border-blue-100">
                    <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1">
                      <Edit2 className="w-3 h-3" />
                      Chi tiết
                    </button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : isScheduledDay ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-3">Chưa có buổi học</p>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1 mx-auto">
                    <Plus className="w-4 h-4" />
                    Thêm buổi học
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">Không có lịch học</p>
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
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-white rounded-lg shadow-2xl border-4 border-blue-500 p-6"
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
        <div
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {clickedSession && (
            <div
              key={clickedSession.id}
              className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50"
            >
              {/* Session Time and Status */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-semibold text-blue-900">
                    {clickedSession.time}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    clickedSession.status
                  )}`}
                >
                  {clickedSession.status}
                </span>
              </div>

              {/* Main Instructors */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  HLV/HDV Chính:
                </p>
                <div className="space-y-2">
                  {clickedSession.mainInstructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center justify-between bg-white rounded p-3"
                    >
                      <div className="flex items-center gap-2">
                        {instructor.status === "Dạy" ? (
                          <UserCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <UserX className="w-5 h-5 text-orange-600" />
                        )}
                        <span className="text-sm text-blue-900 font-medium">
                          {instructor.name}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getInstructorStatusColor(
                          instructor.status
                        )}`}
                      >
                        {instructor.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitute Instructors */}
              {clickedSession.substituteInstructors.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    HLV/HDV Dạy Thế:
                  </p>
                  <div className="space-y-2">
                    {clickedSession.substituteInstructors.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-center gap-2 bg-green-50 rounded p-3"
                      >
                        <UserCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-900 font-medium">
                          {instructor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)};

export default WeeklySessionsGrid;
