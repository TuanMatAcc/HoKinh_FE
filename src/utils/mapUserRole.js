const mapUserRole = (role) => {
 role = parseInt(role);
 const userRoles = {
    0: 'Trưởng Câu Lạc Bộ',
    1: 'Quản lý cơ sở',
    2: 'Huấn luyện viên',
    3: 'Hướng dẫn viên',
    4: 'Võ sinh'
 }

    return userRoles[role];
}

export default mapUserRole