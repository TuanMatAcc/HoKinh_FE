import { useState } from "react";
import getDay from "../../../../../utils/getVietnameseDay";
import StudentsSection from "./ClassStudentSection";
import InstructorsSection from "./ClassCoachInstructorSection";
import { Calendar, Clock, Edit2, Trash2 } from "lucide-react";

// Template Card Component
const TemplateCard = ({
  template,
  onToggleStatus,
  onToggleRole,
  onDeleteMembers,
  onAdd,
  onTimeChange,
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(template.startTime);
  const [tempEndTime, setTempEndTime] = useState(template.endTime);
  const [timeError, setTimeError] = useState("");

  const handleTimeClick = () => {
    setIsEditingTime(true);
    setTimeError("");
  };

  const validateTimes = (start, end) => {
    if (!start || !end) {
      return "Vui lòng nhập đầy đủ thời gian";
    }

    // Convert time strings to comparable format
    const startMinutes =
      parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
    const endMinutes =
      parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);

    if (startMinutes >= endMinutes) {
      return "Thời gian bắt đầu phải trước thời gian kết thúc";
    }

    return "";
  };

  const handleTimeBlur = () => {
    const error = validateTimes(tempStartTime, tempEndTime);

    if (error) {
      setTimeError(error);
      // Reset to original values if invalid
      setTempStartTime(template.startTime);
      setTempEndTime(template.endTime);
      // Keep editing mode open to show error
      setTimeout(() => {
        setIsEditingTime(false);
        setTimeError("");
      }, 2000);
      return;
    }

    setIsEditingTime(false);
    setTimeError("");

    // Call the parent component's handler if times have changed
    if (
      tempStartTime !== template.startTime ||
      tempEndTime !== template.endTime
    ) {
      onTimeChange &&
        onTimeChange(template.dayOfWeek, tempStartTime, tempEndTime);
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">
              {getDay(template.dayOfWeek)} (Template)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            {isEditingTime ? (
              <div className="flex flex-col gap-1">
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
                {template.startTime} - {template.endTime}
              </span>
            )}
          </div>
        </div>
      </div>
      <InstructorsSection
        template={template}
        onToggleStatus={onToggleStatus}
        onDelete={onDeleteMembers}
        onAdd={onAdd}
        onToggleRole={onToggleRole}
      />
      <StudentsSection 
        students={template.students} 
        onDelete={onDeleteMembers}
      />
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-xs text-yellow-800">
          💡 Template này sẽ được áp dụng cho tất cả các buổi học vào{" "}
          {getDay(template.dayOfWeek)} trong khoảng thời gian đã chọn
        </p>
      </div>
    </div>
  );
};

export default TemplateCard;