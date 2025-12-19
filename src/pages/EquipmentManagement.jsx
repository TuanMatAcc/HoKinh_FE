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
import { FilterBar } from "../features/equipment/components/equipment_management/FilterBar";
import { EditDescriptionModal, DescriptionModal } from "../features/equipment/components/equipment_management/EquipmentStatus";
import EquipmentRow from "../features/equipment/components/equipment_management/EquipmentRow";

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
    console.log(equipments);
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
        setChangedEquipments(new Map());
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
      setEquipments([...equipmentData.data]);
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
        <CreateEquipmentPage
          setView={setView}
          facilities={facilities.data}
          setInProgress={setInProgress}
          setShowError={setShowError}
          setShowSuccess={setShowSuccess}
        />
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
