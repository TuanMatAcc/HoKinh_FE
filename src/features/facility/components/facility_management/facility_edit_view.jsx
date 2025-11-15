import { useState, useRef, act } from "react";
import {
  Save,
  X,
  Upload,
  MapPin,
  Phone,
  FileText,
  Navigation,
  Link,
  User,
  Image,
} from "lucide-react";
import AnnouncementUI from "../../../../components/Announcement";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";
import { ThreeDotLoader } from "../../../../components/ActionFallback";
import validateFacilityForm from "../../../../hooks/ValidateFacility";

const EditFacility = ({ managerOptions, facility, setFacility, onSave, onCancel }) => {
  console.log(managerOptions);
  const [formData, setFormData] = useState({
    id: facility?.id || null,
    name: facility?.name || "",
    address: facility?.address || "",
    phoneNumber: facility?.phoneNumber || "",
    description: facility?.description || "",
    managerUserId: facility?.managerId || "",
    managerName: facility?.managerName || "",
    mapsLink: facility?.mapsLink || "",
    latitude: facility?.latitude || "",
    longitude: facility?.longitude || "",
    image: facility?.image || "",
    isActive: facility?.isActive ?? true,
  });
  const imageFile = useRef(null);
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const action = useRef("");
  const title = useRef("");
  const askDetail = useRef("");
  const cancel = useRef(null);
  const confirm = useRef(null);

  const [inProgress, setInProgress] = useState(false);

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(facility?.image || "");

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Clear selected file input
  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
    imageFile.current = null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      console.log(file);
      imageFile.current = file;
    }
  };

  const validateForm = () => {
    const newErrors = validateFacilityForm({editFacilityForm: formData});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show dialog when confirming update
  const confirmSave = () => {
    setShowConfirmDialog(true);
    action.current = "store";
    title.current = facility ? "Lưu thông tin cơ sở" : "Tạo cơ sở";
    askDetail.current = facility
      ? "Bạn có muốn cập nhật thông tin cơ sở không ?"
      : "Bạn có muốn tạo cơ sở không ?";
    cancel.current = () => setShowConfirmDialog(false);
    confirm.current = handleSubmit;
  };

  // Show dialog when canceling update
  const confirmCancel = () => {
    setShowConfirmDialog(true);
    action.current = "cancel";
    title.current = facility ? "Hủy cập nhật cơ sở" : "Hủy tạo cơ sở";
    askDetail.current = facility
      ? "Bạn có muốn hủy cập nhật thông tin cơ sở không ?"
      : "Bạn có muốn hủy tạo cơ sở không ?";
    cancel.current = () => setShowConfirmDialog(false);
    confirm.current = handleCancel;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        console.log(formData);
        setShowConfirmDialog(false);
        setInProgress(true);
        const returnedData = await onSave({
          facility: formData,
          image: imageFile.current,
        });
        if (facility) {
          setFacility((prev) => ({
            ...prev,
            ...formData,
            managerId: formData.managerUserId,
            managerName: formData.managerName
          }));
        }
        clearFile();
        setInProgress(false);
        onCancel();
      } catch (error) {
        setShowError(true);
        setInProgress(false);
        errorMessage.current = error.message;
      }
    }
    else {
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showError && (
        <AnnouncementUI
          setVisible={setShowError}
          message={errorMessage.current}
        />
      )}
      {inProgress && (
        <ThreeDotLoader message="Đang thao tác bạn hãy chờ chút nhé..." />
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          action={action.current}
          title={title.current}
          askDetail={askDetail.current}
          handleCancel={cancel.current}
          handleConfirm={confirm.current}
        />
      )}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {facility ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
              </h1>
              <p className="text-gray-600 mt-1">
                {facility
                  ? `Cập nhật thông tin cho ${facility.name}`
                  : "Nhập thông tin cho cơ sở mới"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {facility ? "Lưu thay đổi" : "Tạo cơ sở"}
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên cơ sở <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên cơ sở"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ cơ sở"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Số điện thoại
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="0901234567"
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Quản lý cơ sở
              </label>
              <select
                name="managerUserId"
                value={formData.managerUserId ? formData.managerUserId : ""}
                onChange={(e) => {
                  // Update manager's id
                  handleChange(e);
                  // Update manager's name
                  if(e.target.value !== '') {
                    setFormData((prev) => ({
                      ...prev,
                      managerName:
                        e.target.options[e.target.selectedIndex].text,
                    }));
                  }
                  else {
                    setFormData((prev) => ({
                      ...prev,
                      managerName: "",
                    }));
                  }
                }}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white text-sm rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                          block w-full pl-10 pr-10 py-3
                          cursor-pointer shadow-sm
                          hover:border-gray-400 dark:hover:border-gray-500
                          hover:shadow-md transition-all duration-200
                          appearance-none
                          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                          dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%239ca3af%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                          bg-size-[1.5em_1.5em] bg-position-[right_0.5rem_center] bg-no-repeat"
              >
                <option value="">Không</option>
                {managerOptions.map(((manager) => (
                  <option key={manager.userId} value={manager.userId}>{manager.userName}</option>
                )))}
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả về cơ sở..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Cơ sở đang hoạt động
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Thông tin vị trí
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Maps Link */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Link className="w-4 h-4 inline mr-1" />
                Liên kết Google Maps
              </label>
              <input
                type="url"
                name="mapsLink"
                value={formData.mapsLink}
                onChange={handleChange}
                placeholder="Dán đường dẫn địa chỉ cơ sở trên google maps..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Dán liên kết từ Google Maps để hiển thị vị trí chính xác
              </p>
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vĩ độ (Latitude)
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder=""
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.latitude ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kinh độ (Longitude)
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder=""
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.longitude ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" />
            Hình ảnh cơ sở
          </h2>

          <div className="space-y-4">
            {imagePreview && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {imagePreview ? "Thay đổi hình ảnh" : "Tải lên hình ảnh"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc. Vui lòng điền
            đầy đủ thông tin trước khi lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditFacility;
