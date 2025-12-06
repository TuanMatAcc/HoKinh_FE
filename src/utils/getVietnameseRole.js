export const getRole = ({role, isBrief = true}) => {
    const roleMap = {
        'coach': 'Huấn luyện viên',
        'instructor': 'Hướng dẫn viên',
        'substituted_coach': 'Huấn luyện viên thay thế',
        'substituted_instructor': 'Hướng dẫn viên thay thế',
        'student': 'Võ sinh'
    }

    const briefRoleMap = {
        'coach': 'HLV',
        'instructor': 'HDV',
        'substituted_coach': 'HLV thay thế',
        'substituted_instructor': 'HDV thay thế',
        'student': 'Võ sinh'
    }

    if(isBrief) return briefRoleMap[role];
    return roleMap[role];
}

export const getStatus = (status) => {
    const statusMap = {
        'off': 'Không dạy'
    }
    return statusMap[status] ?? "Dạy";
}

export const getUserRole = (role) => {
    const roleMap = {
        0: 'Trưởng câu lạc bộ',
        1: 'Quản lý',
        2: 'Huấn luyện viên',
        3: 'Hướng dẫn viên',
        4: 'Võ sinh',
        default: 'Không có'
    }
    return roleMap[role];
}