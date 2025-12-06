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
  ChevronDown,
  Check,
  Trash2,
} from "lucide-react";
import SessionStudentSection from "./SessionStudentSection";
import SessionInstructorSection from "./SessionInstructorSection";
import formatDate from "../../../../utils/formatDate";
import { getStudyHour } from "../../../../utils/formatDateAndTimeType";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";

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

// Status options
const STATUS_OPTIONS = [
  { value: 0, label: "Chưa bắt đầu", icon: <CircleDashed className="w-4 h-4" /> },
  { value: 1, label: "Đang diễn ra", icon: <PlayCircle className="w-4 h-4" /> },
  { value: 2, label: "Đã kết thúc", icon: <CheckCircle className="w-4 h-4" /> },
  { value: 3, label: "Đã hủy", icon: <XCircle className="w-4 h-4" /> },
];

// Session Card Component
const SessionCard = ({
  session,
  classId,
  onToggleStatus,
  onToggleRole,
  onSessionStatusChange,
  onDeleteMembers,
  onToggleAttended,
  onSesionMemberDetailChange,
  onAdd,
  onTimeChange,
  onTextFieldChange,
  onSaveSession,
  onDeleteSession,
  isBrief = true,
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(session.startTime);
  const [tempEndTime, setTempEndTime] = useState(session.endTime);
  const [timeError, setTimeError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timeInputContainerRef = useRef(null);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

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

    const handleStatusClick = () => {
      setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

    const handleStatusChange = (newStatus) => {
      if (newStatus !== session.status) {
        onSessionStatusChange && onSessionStatusChange(newStatus);
      }
      setIsStatusDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    useState(() => {
      if (isStatusDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [isStatusDropdownOpen]);

  return (
    <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition bg-purple-50">
      {showDeleteConfirm && (
        <ConfirmDialog
          action="remove"
          title={"Xóa buổi học"}
          askDetail={
            "Bạn có muốn xóa buổi học " +
            formatDate({
              dateString: session.date,
              showTime: false,
              region: "vi-VN",
            }) +
            " không ?"
          }
          handleCancel={() => setShowDeleteConfirm(false)}
          handleConfirm={() => {
            setShowDeleteConfirm(false);
            console.log("fuckkk");
            onDeleteSession(session.id);
          }}
        />
      )}
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">
              Buổi học {getDay(session.dayOfWeek)}{" "}
              {formatDate({
                dateString: session.date,
                showTime: false,
                region: "vi-VN",
              })}
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
                {getStudyHour(session.startTime)} -{" "}
                {getStudyHour(session.endTime)}
              </span>
            )}
          </div>
        </div>

        {/* Status Badge with Dropdown */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            onClick={handleStatusClick}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 font-medium text-sm cursor-pointer hover:opacity-80 transition ${getStatusColor(
              session.status
            )}`}
            title="Click để thay đổi trạng thái"
          >
            {getStatusIcon(session.status)}
            <span>{getSessionStatus(session.status)}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Dropdown Menu */}
          {isStatusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-purple-200 z-10">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-50 transition first:rounded-t-lg last:rounded-b-lg ${
                    option.value === session.status
                      ? "bg-purple-100 font-semibold"
                      : ""
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {option.value === session.status && (
                    <Check className="w-4 h-4 ml-auto text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          )}
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
          classId={classId}
          handleToggleAttendance={onToggleAttended}
          allowEdit={true}
          handleSaveMemberDetail={onSesionMemberDetailChange}
        />
      )}

      {/* Save Button - at the end */}
      <div className="mt-4 pt-4 border-t-2 border-purple-200 flex justify-between">
        <button
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm hover:shadow-md"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={20}/>
          <span>Xóa</span>
        </button>
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
