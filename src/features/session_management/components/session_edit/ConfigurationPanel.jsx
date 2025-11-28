import {
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";
import { getStudyHour } from "../../../../utils/formatDateAndTimeType";

// Date Range Validator Component
const DateRangeValidator = ({ dateRange, maxDaysPeriod }) => {
  if (!dateRange.start || !dateRange.end) return null;

  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  const diffTime = endDate - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let error = "";
  if (diffDays < 0) {
    error = "Ngày kết thúc phải sau ngày bắt đầu";
  } else if (diffDays > maxDaysPeriod) {
    error = `Khoảng thời gian không được vượt quá ${maxDaysPeriod} ngày`;
  }

  return (
    <div className="mt-4">
      {error ? (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      ) : (
        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            Khoảng thời gian: {diffDays} ngày
            <span className="text-green-600 ml-2">
              (Tối đa: {maxDaysPeriod} ngày)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

// Configuration Panel Component
const ConfigurationPanel = ({
  facilities,
  selectedFacility,
  setSelectedFacility,
  selectedClass,
  setSelectedClass,
  setSelectedDays,
  setTemplates,
  dateRange,
  setDateRange,
  maxDaysPeriod,
  isCreateDisabled,
  handleCreateTemplate
}) => {
  const selectedClassData = selectedClass;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        Cấu Hình Buổi Học
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Chọn Cơ Sở
          </label>
          <select
            defaultValue={""}
            onChange={(e) => {
              setSelectedFacility(
                facilities.find((fac) => fac.id === parseInt(e.target.value))
              );
              setTemplates([]);
              setSelectedDays([]);
              setSelectedClass(null);
            }}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Chọn cơ sở --</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Chọn Lớp
          </label>
          <select
            defaultValue={""}
            onChange={(e) => {
              setSelectedDays([]);
              setTemplates([]);
              setSelectedClass(
                selectedFacility
                  ? selectedFacility.classes.find(
                      (cls) => cls.id === parseInt(e.target.value)
                    )
                  : []
              );
            }
            }
            disabled={!selectedFacility}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Chọn lớp --</option>
            {selectedFacility
              ? selectedFacility.classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))
              : []}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Ngày Bắt Đầu
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Ngày Kết Thúc
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <DateRangeValidator dateRange={dateRange} maxDaysPeriod={maxDaysPeriod} />

      {selectedClassData && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Lịch Học Của Lớp</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                {selectedClassData.daysOfWeek
                  .split("-")
                  .map((d) => getDay(d))
                  .join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                {getStudyHour(selectedClassData.startHour)} - {getStudyHour(selectedClassData.endHour)}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isCreateDisabled}
        onClick={handleCreateTemplate}
      >
        <Plus className="w-5 h-5" />
        Tạo Các Buổi Học
      </button>
    </div>
  );
};

export default ConfigurationPanel;
