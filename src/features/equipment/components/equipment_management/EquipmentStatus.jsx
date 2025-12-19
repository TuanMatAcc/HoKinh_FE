import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

// Status Badge Component
export const StatusBadge = ({ type, quantity, description, onClick }) => {
  const colors = {
    damaged: "bg-red-100 text-red-700 border-red-300",
    fixable: "bg-yellow-100 text-yellow-700 border-yellow-300",
    good: "bg-green-100 text-green-700 border-green-300",
  };

  const labels = {
    damaged: "Hư",
    fixable: "Cần sửa",
    good: "Tốt",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[type]} hover:opacity-80 transition-opacity`}
      title={description || "Xem mô tả"}
    >
      {labels[type]}: {quantity}
    </button>
  );
};

// Description Modal Component (View Only)
export const DescriptionModal = ({
  isOpen,
  onClose,
  type,
  description,
  equipment,
}) => {
  if (!isOpen) return null;

  const labels = {
    damaged: "Mô tả thiết bị hư",
    fixable: "Mô tả thiết bị cần sửa",
    good: "Mô tả thiết bị tốt",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-600">{labels[type]}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700">{description || "Không có mô tả"}</p>
      </div>
    </div>
  );
};

// Edit Description Modal Component
export const EditDescriptionModal = ({
  isOpen,
  onClose,
  type,
  quantity,
  description,
  equipment,
  onSave,
}) => {
  const [editedQuantity, setEditedQuantity] = useState(quantity);
  const [editedDescription, setEditedDescription] = useState(description);

  // Update local state when props change
  useEffect(() => {
    setEditedQuantity(quantity);
    setEditedDescription(description);
  }, [quantity, description, isOpen]);

  if (!isOpen) return null;

  const labels = {
    damaged: "Chỉnh sửa thiết bị hư",
    fixable: "Chỉnh sửa thiết bị cần sửa",
    good: "Chỉnh sửa thiết bị tốt",
  };

  const colors = {
    damaged: "bg-red-500",
    fixable: "bg-yellow-500",
    good: "bg-green-500",
  };

  const handleSave = () => {
    onSave(type, editedQuantity, editedDescription);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {equipment.name}
            </h3>
            <p
              className={`text-sm font-medium mt-1 ${colors[type]} text-white px-3 py-1 rounded-full inline-block`}
            >
              {labels[type]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng
            </label>
            <input
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="8"
              placeholder="Nhập mô tả chi tiết về tình trạng thiết bị..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
