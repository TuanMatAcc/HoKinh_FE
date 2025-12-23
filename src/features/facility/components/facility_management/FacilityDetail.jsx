import {
  ChevronRight,
  Edit,
  FileText,
  MapPin,
  Phone,
  Users,
  ExternalLink,
  Navigation,
  CalendarClock,
  Plus,
  Calendar,
  Clock,
} from "lucide-react";
import formatDate from "../../../../utils/formatDate";
import { getBriefDayNameFromNumber } from "../../../../utils/formatDateAndTimeType";

const formatTime = (timeString) => timeString.slice(0, 5);

const formatDays = (daysString) => {
    return daysString.split('-').map(d => getBriefDayNameFromNumber(d)).join(', ');
};

const FacilityDetail = ({
  facility,
  setSelectedFacility,
  setView,
  setSelectedClass,
}) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center justify-between">
      <button
        onClick={() => {
          setSelectedFacility(null);
          setView("list");
        }}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        <span className="hidden sm:inline">Quay lại danh sách</span>
        <span className="sm:hidden">Quay lại</span>
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <img
        src={facility.image}
        alt={facility.name}
        className="w-full h-48 sm:h-64 md:h-80 object-cover"
      />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {facility.name}
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                facility.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {facility.isActive ? "Đang hoạt động" : "Tạm ngưng"}
            </span>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => {
              setView("edit");
              setSelectedFacility(facility);
            }}
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>

        {/* Basic Information Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tên cơ sở
                </label>
                <p className="text-gray-900 font-medium wrap-break-word">
                  {facility.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Địa chỉ
                </label>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-gray-900 wrap-break-word">
                    {facility.address}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Số điện thoại
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-gray-900">{facility.phoneNumber}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Quản lý cơ sở
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-gray-900 font-semibold wrap-break-word">
                    {facility.managerName}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Mô tả
                </label>
                <p className="text-gray-900 text-sm leading-relaxed wrap-break-word">
                  {facility.description}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Liên kết Google Maps
                </label>
                <a
                  href={facility.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  Xem trên bản đồ
                </a>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tọa độ
                </label>
                <div className="flex items-start gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-gray-900 break-all">
                    <span className="font-mono">{facility.latitude}</span>,{" "}
                    <span className="font-mono">{facility.longitude}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Trạng thái
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    facility.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {facility.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps Section */}
        <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            Thông tin thời gian
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Ngày tạo
              </label>
              <p className="text-gray-900 text-sm sm:text-base">
                {formatDate({
                  dateString: facility.createdAt,
                  showTime: true,
                  region: "vi-VN",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Cập nhật lần cuối
              </label>
              <p className="text-gray-900 text-sm sm:text-base">
                {formatDate({
                  dateString: facility.updatedAt,
                  showTime: true,
                  region: "vi-VN",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Danh sách lớp học ({facility.classes.length})
            </h3>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={() => {
                setSelectedClass({
                  classId: null,
                  name: "",
                  description: "",
                  daysOfWeek: "",
                  startHour: "06:00",
                  endHour: "07:30",
                  isActive: true,
                  studentCount: 0,
                });
                setView("class");
              }}
            >
              <Plus className="w-4 h-4" />
              Thêm lớp mới
            </button>
          </div>

          {facility.classes.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Chưa có lớp học nào</p>
              <p className="text-gray-400 text-sm mt-1 px-4">
                Nhấn "Thêm lớp mới" để tạo lớp học đầu tiên
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {facility.classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 wrap-break-word">
                        {cls.name}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="wrap-break-word">
                            {formatDays(cls.daysOfWeek)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>
                            {formatTime(cls.startHour)} -{" "}
                            {formatTime(cls.endHour)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>
                            Sĩ số: <strong>{cls.studentCount}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start sm:self-auto"
                      onClick={() => {
                        setView("class");
                        setSelectedClass(cls);
                      }}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default FacilityDetail;
