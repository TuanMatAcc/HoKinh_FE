import getDay from "../../../../utils/getVietnameseDay";

// Day of Week Filter Component
const DayOfWeekFilter = ({
  selectedClass,
  selectedDays,
  onToggleDay,
  onRemoveDay,
}) => {
  const selectedClassData = selectedClass;

  if (!selectedClassData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        Chọn Ngày Trong Tuần
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Chọn các ngày trong tuần để tạo template. Template sẽ được áp dụng cho
        tất cả các buổi học trong khoảng thời gian đã chọn.
      </p>
      <div className="flex flex-wrap gap-3">
        {selectedClassData.daysOfWeek.split("-").map((day) => (
          <label
            key={day}
            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition ${
              selectedDays.includes(day)
                ? "border-purple-400 bg-purple-50"
                : "border-blue-200 hover:border-blue-400"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={(e) => {
                if (e.target.checked) {
                  onToggleDay(day);
                } else {
                  onRemoveDay(day);
                }
              }}
              className="w-4 h-4 text-purple-600"
            />
            <span
              className={`text-sm font-medium ${
                selectedDays.includes(day) ? "text-purple-900" : "text-blue-900"
              }`}
            >
              {getDay(day)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DayOfWeekFilter;
