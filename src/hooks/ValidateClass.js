const validateClassForm = ({editClassForm}) => {
    const newErrors = {};

    if (!editClassForm.name.trim()) {
      newErrors.name = "Tên lớp là bắt buộc";
    } else if (editClassForm.name.length > 100) {
      newErrors.name = "Tên lớp không được vượt quá 100 ký tự";
    }

    if (!editClassForm.daysOfWeek.trim()) {
      newErrors.daysOfWeek = "Ngày học là bắt buộc";
    }

    if (editClassForm.description && editClassForm.description.length > 500) {
      newErrors.daysOfWeek = "Mô tả không vượt quá 500 ký tự";
    }

    return newErrors;
  };

export default validateClassForm;