const validateUserForm = ({editUserForm, isStudent}) => {
    const newErrors = {};

    if (isStudent && (!editUserForm.id.trim())) {
      newErrors.id = "ID võ sinh là bắt buộc";
    } 
    else if (editUserForm.id.length > 100) {
      newErrors.id = "ID người dùng không được vượt quá 100 ký tự";
    }

    if (!editUserForm.name.trim()) {
      newErrors.name = "Tên người dùng là bắt buộc";
    } else if (editUserForm.name.length > 100) {
      newErrors.name = "Tên người dùng không được vượt quá 100 ký tự";
    }

    if (!editUserForm.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    }

    if (
      editUserForm.phoneNumber &&
      !/^\d{10}$/.test(editUserForm.phoneNumber)
    ) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }

    if(editUserForm.password && editUserForm.password.length < 7) {
        newErrors.password = "Mật khẩu phải có ít nhất 7 chữ số";
    }

    if (editUserForm.email.length > 100) {
      newErrors.email = "Email không được vượt quá 100 ký tự";
    }

    return newErrors;
  };

export default validateUserForm;