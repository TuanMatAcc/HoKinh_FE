import { useState, useRef } from "react";
import getDay from "../../../../utils/getVietnameseDay";
import { getSessionStatus } from "../../../../utils/getStatusSession";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  BookOpen,
  CheckCircle,
  XCircle,
  PlayCircle,
  CircleDashed,
  Check,
} from "lucide-react";
import SessionStudentSection from "./SessionStudentSection";
import SessionInstructorSection from "./SessionInstructorSection";

// Status color utility
const getStatusColor = (status) => {
  switch (status) {
    case 0: // Chưa bắt đầu
      return "bg-blue-100 text-blue-700 border-blue-300";
    case 1: // Đang diễn ra
      return "bg-green-100 text-green-700 border-green-300";
    case 2: // Đã kết thúc
      return "bg-gray-100 text-gray-700 border-gray-300";
    case 3: // Đã hủy
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// Status icon utility
const getStatusIcon = (status) => {
  switch (status) {
    case 0:
      return <CircleDashed className="w-4 h-4" />;
    case 1:
      return <PlayCircle className="w-4 h-4" />;
    case 2:
      return <CheckCircle className="w-4 h-4" />;
    case 3:
      return <XCircle className="w-4 h-4" />;
    default:
      return <CircleDashed className="w-4 h-4" />;
  }
};

// Session Card Component
const SessionCard = ({
  session,
  onToggleStatus,
  onToggleRole,
  onDeleteMembers,
  onToggleAttended,
  onSesionMemberDetailChange,
  onAdd,
  onTimeChange,
  onTextFieldChange,
  onSaveSession,
  isBrief = true,
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(session.startTime);
  const [tempEndTime, setTempEndTime] = useState(session.endTime);
  const [timeError, setTimeError] = useState("");
  const timeInputContainerRef = useRef(null);

  const handleTimeClick = () => {
    setIsEditingTime(true);
    setTimeError("");
  };

  const validateTimes = (start, end) => {
    if (!start || !end) {
      return "Vui lòng nhập đầy đủ thời gian";
    }

    const startMinutes =
      parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
    const endMinutes =
      parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);

    if (startMinutes >= endMinutes) {
      return "Thời gian bắt đầu phải trước thời gian kết thúc";
    }

    return "";
  };

  const handleTimeBlur = (e) => {
    const container = timeInputContainerRef.current;
    if (container && container.contains(e.relatedTarget)) {
      return;
    }

    const error = validateTimes(tempStartTime, tempEndTime);

    if (error) {
      setTimeError(error);
      setTempStartTime(session.startTime);
      setTempEndTime(session.endTime);
      setTimeout(() => {
        setIsEditingTime(false);
        setTimeError("");
      }, 2000);
      return;
    }

    setIsEditingTime(false);
    setTimeError("");

    if (
      tempStartTime !== session.startTime ||
      tempEndTime !== session.endTime
    ) {
      onTimeChange && onTimeChange(tempStartTime, tempEndTime);
    }
  };

  const handleStartTimeChange = (e) => {
    setTempStartTime(e.target.value);
    setTimeError("");
  };

  const handleEndTimeChange = (e) => {
    setTempEndTime(e.target.value);
    setTimeError("");
  };

  return (
    <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition bg-purple-50">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">
              Buổi học {getDay(session.dayOfWeek)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            {isEditingTime ? (
              <div className="flex flex-col gap-1" ref={timeInputContainerRef}>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={tempStartTime}
                    onChange={handleStartTimeChange}
                    onBlur={handleTimeBlur}
                    autoFocus
                    className={`text-sm text-purple-700 bg-white border rounded px-2 py-0.5 focus:outline-none ${
                      timeError
                        ? "border-red-500 focus:border-red-500"
                        : "border-purple-300 focus:border-purple-500"
                    }`}
                  />
                  <span className="text-sm text-purple-700">-</span>
                  <input
                    type="time"
                    value={tempEndTime}
                    onChange={handleEndTimeChange}
                    onBlur={handleTimeBlur}
                    className={`text-sm text-purple-700 bg-white border rounded px-2 py-0.5 focus:outline-none ${
                      timeError
                        ? "border-red-500 focus:border-red-500"
                        : "border-purple-300 focus:border-purple-500"
                    }`}
                  />
                </div>
                {timeError && (
                  <span className="text-xs text-red-600 font-medium">
                    {timeError}
                  </span>
                )}
              </div>
            ) : (
              <span
                onClick={handleTimeClick}
                className="text-sm text-purple-700 cursor-pointer hover:bg-purple-100 px-2 py-0.5 rounded transition"
                title="Click để chỉnh sửa thời gian"
              >
                {session.startTime} - {session.endTime}
              </span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 font-medium text-sm ${getStatusColor(
            session.status
          )}`}
        >
          {getStatusIcon(session.status)}
          <span>{getSessionStatus(session.status)}</span>
        </div>
      </div>

      {/* Session Details Section */}
      <div className="space-y-3 mb-3">
        {/* Topic */}
        <div className="bg-white rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <label className="text-sm font-semibold text-purple-900">
              Chủ đề buổi học:
            </label>
          </div>
          {isBrief ? (
            <p className="text-sm text-gray-700 ml-6">
              {session.topic || (
                <span className="text-gray-400 italic">Chưa có chủ đề</span>
              )}
            </p>
          ) : (
            <input
              type="text"
              value={session.topic}
              onChange={(e) =>
                onTextFieldChange && onTextFieldChange("topic", e.target.value)
              }
              placeholder="Nhập chủ đề buổi học..."
              className="w-full ml-6 px-3 py-2 border border-purple-200 rounded focus:outline-none focus:border-purple-500 text-sm"
            />
          )}
        </div>

        {/* Video Link */}
        <div className="bg-white rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-purple-600" />
            <label className="text-sm font-semibold text-purple-900">
              Video ghi hình:
            </label>
          </div>
          {isBrief ? (
            session.videoLink ? (
              <a
                href={session.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline ml-6 flex items-center gap-1"
              >
                <Video className="w-3 h-3" />
                Xem video
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic ml-6">Chưa có video</p>
            )
          ) : (
            <input
              type="url"
              value={session.videoLink}
              onChange={(e) =>
                onTextFieldChange &&
                onTextFieldChange("videoLink", e.target.value)
              }
              placeholder="Nhập link video (YouTube, Drive, etc.)..."
              className="w-full ml-6 px-3 py-2 border border-purple-200 rounded focus:outline-none focus:border-purple-500 text-sm"
            />
          )}
        </div>

        {/* Report */}
        <div className="bg-white rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <label className="text-sm font-semibold text-purple-900">
              Báo cáo buổi học:
            </label>
          </div>
          {isBrief ? (
            <div className="ml-6">
              {session.report ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Đã có báo cáo
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400 italic">
                    Chưa có báo cáo
                  </span>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={session.report}
              onChange={(e) =>
                onTextFieldChange && onTextFieldChange("report", e.target.value)
              }
              placeholder="Nhập nội dung báo cáo buổi học..."
              rows={4}
              className="w-full ml-6 px-3 py-2 border border-purple-200 rounded focus:outline-none focus:border-purple-500 text-sm resize-y"
            />
          )}
        </div>
      </div>

      {/* Instructors Section */}
      <SessionInstructorSection
        session={session}
        onToggleStatus={onToggleStatus}
        onDelete={onDeleteMembers}
        onAdd={onAdd}
        onToggleRole={onToggleRole}
        allowEdit={true}
        onToggleAttended={onToggleAttended}
        handleSaveMemberDetail={onSesionMemberDetailChange}
      />

      {/* Students Section - Only in detailed view */}
      {!isBrief && (
        <SessionStudentSection
          onAdd={onAdd}
          session={session}
          onDelete={onDeleteMembers}
          handleToggleAttendance={onToggleAttended}
          allowEdit={true}
          handleSaveMemberDetail={onSesionMemberDetailChange}
        />
      )}

      {/* Save Button - at the end */}
      <div className="mt-4 pt-4 border-t-2 border-purple-200 flex justify-end">
        <button
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm hover:shadow-md"
          onClick={onSaveSession}
        >
          <Check size={20} />
          <span>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
