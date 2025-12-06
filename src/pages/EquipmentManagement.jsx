import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Edit2, Save, X, Plus } from "lucide-react";
import Header from "../components/Header";
import Button from "../components/Button";
import CreateEquipmentPage from "../features/equipment/components/equipment_add/CreateEquipmentPage";
import { useFacility } from "../hooks/useFacilityData";
import { EquipmentTableSkeleton } from "../components/skeleton/EquipmentRowSkeleton";
import { equipmentService } from "../services/equipment_api";
import { useEquipments } from "../hooks/useEquipments";
import { ThreeDotLoader } from "../components/ActionFallback";
import AnnouncementUI from "../components/Announcement";
import SuccessAnnouncement from "../components/SuccessAnnouncement";

// Filter Bar Component
const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  facilityFilter,
  setFacilityFilter,
  facilities,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm thiết bị..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="damaged">Hư</option>
          <option value="fixable">Cần sửa chữa</option>
          <option value="good">Tốt</option>
        </select>
      </div>

      {/* Facility Filter */}
      <div>
        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả cơ sở</option>
          {facilities && facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ type, quantity, description, onClick }) => {
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
const DescriptionModal = ({
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
const EditDescriptionModal = ({
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
    facilities && facilities.find((f) => f.id === equipment.facilityId)?.name || "N/A";
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

// Main Component
const EquipmentManagement = () => {
  const { data: facilities } = useFacility();
  const {data: equipmentData} = useEquipments();
  const [showSuccess, setShowSuccess] = useState("");
  const [showError, setShowError] = useState("");
  const [inProgress, setInProgress] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [changedEquipments, setChangedEquipments] = useState(new Map());
  console.log(changedEquipments);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    description: "",
    equipment: null,
  });
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    type: "",
    quantity: 0,
    description: "",
    equipment: null,
  });

  // Filter equipments
  const filteredEquipments = useMemo(() => {
    return equipments.filter((eq) => {
      const matchesSearch = eq.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFacility =
        facilityFilter === "all" || eq.facilityId === parseInt(facilityFilter);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "damaged" && eq.damagedQuantity > 0) ||
        (statusFilter === "fixable" && eq.fixableQuantity > 0) ||
        (statusFilter === "good" && eq.goodQuantity > 0);

      return matchesSearch && matchesFacility && matchesStatus;
    });
  }, [equipments, searchTerm, statusFilter, facilityFilter]);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id) => {
    const equipment = equipments.find((eq) => eq.id === id);
    setChangedEquipments(new Map(changedEquipments.set(id, equipment)));
    setEditingId(null);
  };

  const handleCancel = (id) => {
    // Restore from changedEquipments if exists, otherwise restore from original
    const saved = changedEquipments.get(id);
    if (saved) {
      setEquipments(equipments.map((eq) => (eq.id === id ? { ...saved } : eq)));
    }
    setEditingId(null);
  };

  const handleChange = (id, field, value) => {
    setEquipments(
      equipments.map((eq) => {
        if (eq.id === id) {
          const updated = { ...eq, [field]: value };
          return updated;
        }
        return eq;
      })
    );
  };

  const handleSaveAll = async () => {
    console.log("Saving changes:", Object.fromEntries(changedEquipments));
    try {
        setInProgress("Đang cập nhật thiết bị");
        await equipmentService.updateEquipments([...changedEquipments.values()]);
        setShowSuccess("Bạn đã cập nhật thành công các thiết bị");
    }
    catch(error) {
        let errorMessage = "";
        if(error.response) {
            errorMessage = error.response.data;
        }
        else {
            errorMessage = error;
        }
        setShowError("Đã xảy ra lỗi khi cập nhật thiết bị. Chi tiết lỗi: " + errorMessage);
    }
    finally {
        setInProgress("");
    }
  };

  const handleShowDescription = (type, description, equipment) => {
    setModalState({ isOpen: true, type, description, equipment });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: "",
      description: "",
      equipment: null,
    });
  };

  const handleEditDescription = (type, quantity, description, equipment) => {
    setEditModalState({
      isOpen: true,
      type,
      quantity,
      description,
      equipment,
    });
  };

  const handleCloseEditModal = () => {
    setEditModalState({
      isOpen: false,
      type: "",
      quantity: 0,
      description: "",
      equipment: null,
    });
  };

  const handleSaveDescription = (type, quantity, description) => {
    const quantityField = `${type}Quantity`;
    const descriptionField = `${type}Description`;

    setEquipments(
      equipments.map((eq) => {
        if (eq.id === editModalState.equipment.id) {
          return {
            ...eq,
            [quantityField]: quantity,
            [descriptionField]: description,
          };
        }
        return eq;
      })
    );
  };

  useEffect(() => {
    if(equipmentData) {
        setEquipments(equipmentData.data);
    }
  }, [equipmentData])

  if(view === 'edit') {
    return (
      <>
        {inProgress && <ThreeDotLoader message={inProgress} />}
        {showError && (
          <AnnouncementUI message={showError} setVisible={setShowError} />
        )}
        {showSuccess && (
          <SuccessAnnouncement
            actionAnnouncement={"Thao tác thành công"}
            detailAnnouncement={showSuccess}
            onBack={() => setShowSuccess("")}
          />
        )}
        <CreateEquipmentPage setView={setView} facilities={facilities.data} />
      </>
    );
  }

  if(view === 'list') {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
        {inProgress && <ThreeDotLoader message={inProgress} />}
        {showError && (
          <AnnouncementUI message={showError} setVisible={setShowError} />
        )}
        {showSuccess && (
          <SuccessAnnouncement
            actionAnnouncement={"Thao tác thành công"}
            detailAnnouncement={showSuccess}
            onBack={() => setShowSuccess("")}
          />
        )}
        <div className="max-w-7xl mx-auto">
          <Header
            title="Quản lý thiết bị"
            description="Thêm và quản lý thiết bị"
            functionButton={
              <Button
                title={"Thêm thiết bị"}
                icon={<Plus />}
                background={true}
                handleOnClick={() => setView("edit")}
              />
            }
          />

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            facilityFilter={facilityFilter}
            setFacilityFilter={setFacilityFilter}
            facilities={facilities?.data}
          />

          {changedEquipments.size > 0 && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-blue-800">
                Có {changedEquipments.size} thay đổi chưa lưu
              </span>
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu tất cả
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tên thiết bị
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Cơ sở
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Đơn vị
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Hư
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Cần sửa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tốt
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tổng
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Cập nhật
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipments ? (
                    filteredEquipments.map((equipment) => (
                      <EquipmentRow
                        key={equipment.id}
                        equipment={equipment}
                        isEditing={editingId === equipment.id}
                        onEdit={() => handleEdit(equipment.id)}
                        onSave={() => handleSave(equipment.id)}
                        onCancel={() => handleCancel(equipment.id)}
                        onChange={(field, value) =>
                          handleChange(equipment.id, field, value)
                        }
                        facilities={facilities?.data}
                        onShowDescription={handleShowDescription}
                        onEditDescription={handleEditDescription}
                      />
                    ))
                  ) : (
                    <EquipmentTableSkeleton />
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DescriptionModal
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
            type={modalState.type}
            description={modalState.description}
            equipment={modalState.equipment}
          />

          <EditDescriptionModal
            isOpen={editModalState.isOpen}
            onClose={handleCloseEditModal}
            type={editModalState.type}
            quantity={editModalState.quantity}
            description={editModalState.description}
            equipment={editModalState.equipment}
            onSave={handleSaveDescription}
          />
        </div>
      </div>
    );
  }
};

export default EquipmentManagement;
