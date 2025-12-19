import { Edit2, Save, X } from "lucide-react";
import { StatusBadge } from "./EquipmentStatus";

// Equipment Row Component
const EquipmentRow = ({
  equipment,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  facilities,
  onShowDescription,
  onEditDescription,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const facilityName =
    (facilities &&
      facilities.find((f) => f.id === equipment.facilityId)?.name) ||
    "N/A";
  const totalQuantity =
    equipment.damagedQuantity +
    equipment.fixableQuantity +
    equipment.goodQuantity;

  if (isEditing) {
    return (
      <tr className="bg-blue-50 border-l-4 border-blue-500">
        <td className="px-4 py-3">
          <input
            type="text"
            value={equipment.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{facilityName}</td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={equipment.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() =>
              onEditDescription(
                "damaged",
                equipment.damagedQuantity,
                equipment.damagedDescription,
                equipment
              )
            }
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Hư: {equipment.damagedQuantity}
            <div className="text-xs mt-1">Nhấn để chỉnh sửa</div>
          </button>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() =>
              onEditDescription(
                "fixable",
                equipment.fixableQuantity,
                equipment.fixableDescription,
                equipment
              )
            }
            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
          >
            Cần sửa: {equipment.fixableQuantity}
            <div className="text-xs mt-1">Nhấn để chỉnh sửa</div>
          </button>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() =>
              onEditDescription(
                "good",
                equipment.goodQuantity,
                equipment.goodDescription,
                equipment
              )
            }
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            Tốt: {equipment.goodQuantity}
            <div className="text-xs mt-1">Nhấn để chỉnh sửa</div>
          </button>
        </td>
        <td className="px-4 py-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {totalQuantity}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatDate(equipment.createdAt)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatDate(equipment.updatedAt)}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              title="Lưu"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              title="Hủy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-800">{equipment.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{facilityName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment.unit}</td>
      <td className="px-4 py-3">
        <StatusBadge
          type="damaged"
          quantity={equipment.damagedQuantity}
          description={equipment.damagedDescription}
          onClick={() =>
            onShowDescription(
              "damaged",
              equipment.damagedDescription,
              equipment
            )
          }
        />
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          type="fixable"
          quantity={equipment.fixableQuantity}
          description={equipment.fixableDescription}
          onClick={() =>
            onShowDescription(
              "fixable",
              equipment.fixableDescription,
              equipment
            )
          }
        />
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          type="good"
          quantity={equipment.goodQuantity}
          description={equipment.goodDescription}
          onClick={() =>
            onShowDescription("good", equipment.goodDescription, equipment)
          }
        />
      </td>
      <td className="px-4 py-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          {totalQuantity}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(equipment.createdAt)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(equipment.updatedAt)}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onEdit}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Chỉnh sửa"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
 
export default EquipmentRow;