import React, { useState } from "react";
import { Save, X, AlertCircle, CheckCircle, ChevronLeft, ArrowLeft } from "lucide-react";
import Header from "../../../../components/Header";
import Button from "../../../../components/Button";
import { equipmentService } from "../../../../services/equipment_api";
import { useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-lg p-4 mb-6 flex items-start justify-between`}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <p className={`${style.text} text-sm`}>{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Input Field Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// Select Field Component
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Chọn cơ sở</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

// Textarea Field Component
const TextareaField = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  </div>
);

// Status Section Component
const StatusSection = ({
  title,
  color,
  quantityName,
  descriptionName,
  formData,
  onChange,
}) => {
  const colorClasses = {
    red: {
      border: "border-red-300",
      bg: "bg-red-50",
      text: "text-red-700",
      badge: "bg-red-500",
    },
    yellow: {
      border: "border-yellow-300",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      badge: "bg-yellow-500",
    },
    green: {
      border: "border-green-300",
      bg: "bg-green-50",
      text: "text-green-700",
      badge: "bg-green-500",
    },
  };

  const colorClass = colorClasses[color];

  return (
    <div
      className={`border ${colorClass.border} ${colorClass.bg} rounded-lg p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`${colorClass.badge} w-3 h-3 rounded-full`}></span>
        <h3 className={`font-semibold ${colorClass.text}`}>{title}</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng
          </label>
          <input
            type="number"
            name={quantityName}
            value={formData[quantityName]}
            onChange={onChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            name={descriptionName}
            value={formData[descriptionName]}
            onChange={onChange}
            rows="3"
            placeholder="Nhập mô tả chi tiết..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
};

// Main Create Equipment Component
const CreateEquipmentPage = ({
  setView,
  facilities,
  setShowSuccess,
  setShowError,
  setInProgress
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    facilityId: "",
    unit: "",
    damagedQuantity: 0,
    fixableQuantity: 0,
    goodQuantity: 0,
    damagedDescription: "",
    fixableDescription: "",
    goodDescription: "",
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      facilityId: "",
      unit: "",
      damagedQuantity: 0,
      fixableQuantity: 0,
      goodQuantity: 0,
      damagedDescription: "",
      fixableDescription: "",
      goodDescription: "",
    });
    setView('list');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setAlert({ type: "error", message: "Vui lòng nhập tên thiết bị" });
      return;
    }
    if (!formData.facilityId) {
      setAlert({ type: "error", message: "Vui lòng chọn cơ sở" });
      return;
    }
    if (!formData.unit.trim()) {
      setAlert({ type: "error", message: "Vui lòng nhập đơn vị" });
      return;
    }

    // Prepare data to send to backend
    const equipmentData = {
      name: formData.name,
      facilityId: parseInt(formData.facilityId, 10),
      unit: formData.unit,
      damagedQuantity: formData.damagedQuantity,
      fixableQuantity: formData.fixableQuantity,
      goodQuantity: formData.goodQuantity,
      damagedDescription: formData.damagedDescription,
      fixableDescription: formData.fixableDescription,
      goodDescription: formData.goodDescription,
    };
    try {
      setInProgress("Đang tạo thiết bị");
      const createdEquipment = (await equipmentService.createEquipment(equipmentData)).data;
      setView("list");
      setShowSuccess("Tạo thiết bị thành công");
      queryClient.setQueryData(["equipments", "management"], prev => {
        if(!prev) return prev;
        return ({
          ...prev,
          data: [...prev.data, createdEquipment]
        });
      });
      console.log("Submitting equipment:", equipmentData);
    }
    catch(error) {
      let errorMessage = "";
      if (error.response) {
        errorMessage = error.response.data;
      } else {
        errorMessage = error;
      }
      setShowError(
        "Đã xảy ra lỗi khi tạo thiết bị. Chi tiết lỗi: " + errorMessage
      );
      console.log(error);
    } 
    finally {
      setInProgress("")
    }
  };

  const totalQuantity =
    formData.damagedQuantity + formData.fixableQuantity + formData.goodQuantity;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          title="Tạo thiết bị mới"
          description="Thêm thiết bị mới vào hệ thống quản lý"
          backButton={
            <Button
              title={"Quay lại trang quản lý thiết bị"}
              icon={<ArrowLeft/>}
              handleOnClick={() => setView('list')}
              background={false}
            />
          }
        />

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Thông tin cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Tên thiết bị"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Găng tay boxing"
                />
                <SelectField
                  label="Cơ sở"
                  name="facilityId"
                  value={formData.facilityId}
                  onChange={handleChange}
                  options={facilities}
                  required
                />
                <InputField
                  label="Đơn vị"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: đôi, cái, bộ"
                />
                <div className="flex items-end">
                  <div className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Tổng số lượng:{" "}
                    </span>
                    <span className="text-lg font-semibold text-blue-700">
                      {totalQuantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Sections */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trạng thái thiết bị
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusSection
                  title="Thiết bị hư"
                  color="red"
                  quantityName="damagedQuantity"
                  descriptionName="damagedDescription"
                  formData={formData}
                  onChange={handleChange}
                />
                <StatusSection
                  title="Cần sửa chữa"
                  color="yellow"
                  quantityName="fixableQuantity"
                  descriptionName="fixableDescription"
                  formData={formData}
                  onChange={handleChange}
                />
                <StatusSection
                  title="Tình trạng tốt"
                  color="green"
                  quantityName="goodQuantity"
                  descriptionName="goodDescription"
                  formData={formData}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Tạo thiết bị
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipmentPage;
