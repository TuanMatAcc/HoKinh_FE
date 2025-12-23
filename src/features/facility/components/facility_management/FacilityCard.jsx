import { Eye, Edit, MapPin, Phone, Users, ChevronRight } from "lucide-react";

const FacilityCard = ({ facility, setSelectedFacility, setView }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row">
      <img
        src={
          facility.image ||
          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"
        }
        alt={facility.name}
        className="w-full sm:w-48 h-48 object-cover"
      />
      <div className="flex-1 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {facility.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                facility.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {facility.isActive ? "Đang hoạt động" : "Tạm ngưng"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedFacility(facility);
                setView("detail");
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Xem chi tiết"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Chỉnh sửa"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="wrap-break-word">{facility.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{facility.phoneNumber}</span>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="wrap-break-word">
              Quản lý: <strong>{facility.managerName}</strong>
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            <span className="text-gray-600">
              Số lớp học:{" "}
              <strong className="text-gray-900">
                {facility.classes.length}
              </strong>
            </span>
            <button
              onClick={() => {
                setSelectedFacility(facility);
                setView("detail");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 self-start sm:self-auto"
            >
              Xem chi tiết
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FacilityCard;
