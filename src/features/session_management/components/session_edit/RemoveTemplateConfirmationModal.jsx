import { AlertTriangle } from "lucide-react";
import getDay from "../../../../utils/getVietnameseDay";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, dayOfWeek }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Xác Nhận Xóa Template
          </h3>
        </div>
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa template cho{" "}
          <strong>{getDay(dayOfWeek)}</strong>? Template này sẽ được áp dụng cho
          tất cả các buổi học vào {getDay(dayOfWeek)} trong khoảng thời gian đã
          chọn.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Xác Nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
