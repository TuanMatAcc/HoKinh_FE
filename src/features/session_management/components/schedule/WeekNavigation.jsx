import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Check, X } from "lucide-react";
import { convertDateInputToVN } from "../../../../utils/formatDateAndTimeType";

const WeekNavigation = ({
  weekDays,
  handleNextWeekClick,
  handlePreviousWeekClick,
  selectedDate,
  setSelectedDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  const handleDateClick = () => {
    setIsEditing(true);
    setTempDate(selectedDate);
  };

  const handleConfirm = () => {
    setSelectedDate(tempDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          onClick={handlePreviousWeekClick}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1">
          <h2 className="text-xl font-bold text-blue-900 mb-3">
            Tuần{" "}
            {" " +
              convertDateInputToVN(weekDays[0].date, "m") +
              " - " +
              convertDateInputToVN(weekDays[weekDays.length - 1].date, "y")}
          </h2>

          {isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="pl-10 pr-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-center"
                />
              </div>
              <button
                onClick={handleConfirm}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Xác nhận (Enter)"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Hủy (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDateClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>{convertDateInputToVN(selectedDate, "y")}</span>
            </button>
          )}
        </div>

        <button
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          onClick={handleNextWeekClick}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WeekNavigation;
