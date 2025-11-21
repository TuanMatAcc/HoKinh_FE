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