const validateFacilityForm = ({editFacilityForm}) => {
    const newErrors = {};

    if (!editFacilityForm.name.trim()) {
      newErrors.name = "Tên cơ sở là bắt buộc";
    } else if (editFacilityForm.name.length > 200) {
      newErrors.name = "Tên cơ sở không được vượt quá 200 ký tự";
    }

    if (editFacilityForm.address && editFacilityForm.address.length > 400) {
      newErrors.address = "Địa chỉ không được vượt quá 400 ký tự";
    }

    if (editFacilityForm.phoneNumber && !/^\d{10}$/.test(editFacilityForm.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }

    if (
      editFacilityForm.latitude &&
      (isNaN(editFacilityForm.latitude) ||
        editFacilityForm.latitude < -90 ||
        editFacilityForm.latitude > 90)
    ) {
      newErrors.latitude = "Vĩ độ phải là số từ -90 đến 90";
    }

    if (
      editFacilityForm.longitude &&
      (isNaN(editFacilityForm.longitude) ||
        editFacilityForm.longitude < -180 ||
        editFacilityForm.longitude > 180)
    ) {
      newErrors.longitude = "Kinh độ phải là số từ -180 đến 180";
    }

    return newErrors;
  };

export default validateFacilityForm;