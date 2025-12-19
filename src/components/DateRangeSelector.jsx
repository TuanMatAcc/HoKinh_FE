import { Calendar, X } from "lucide-react";

// Date Range Selector Component
const DateRangeSelector = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // If end date is before new start date, adjust end date
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    // If start date is after new end date, adjust start date
    if (startDate && newEndDate < startDate) {
      setStartDate(newEndDate);
    }
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const setPresetRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysDifference = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysDiff = getDaysDifference();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn khoảng thời gian
          </h3>
        </div>
        {(startDate || endDate) && (
          <button
            onClick={clearDates}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <X size={16} />
            Xóa
          </button>
        )}
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setPresetRange(7)}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          7 ngày qua
        </button>
        <button
          onClick={() => setPresetRange(30)}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          30 ngày qua
        </button>
        <button
          onClick={() => setPresetRange(90)}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          90 ngày qua
        </button>
        <button
          onClick={() => {
            const end = new Date();
            const start = new Date(end.getFullYear(), 0, 1);
            setStartDate(start.toISOString().split("T")[0]);
            setEndDate(end.toISOString().split("T")[0]);
          }}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          Năm nay
        </button>
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {startDate && (
            <p className="mt-1 text-xs text-gray-500">
              {formatDate(startDate)}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            max={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {endDate && (
            <p className="mt-1 text-xs text-gray-500">{formatDate(endDate)}</p>
          )}
        </div>
      </div>

      {/* Summary */}
      {startDate && endDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Khoảng thời gian:</span>{" "}
            {formatDate(startDate)} - {formatDate(endDate)}
            {daysDiff !== null && (
              <span className="ml-2">({daysDiff + 1} ngày)</span>
            )}
          </p>
        </div>
      )}

      {/* Validation Message */}
      {!startDate && !endDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Vui lòng chọn khoảng thời gian để xem thống kê
          </p>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;