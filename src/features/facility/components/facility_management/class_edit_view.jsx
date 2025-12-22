import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Save,
  X,
  Edit2,
  UserPlus,
  Users,
  Power,
  ChevronDown,
  ChevronUp,
  Camera,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";
import { userService } from "../../../../services/user_api";
import { LoadingErrorUI } from "../../../../components/LoadingError";
import AnnouncementUI from "../../../../components/Announcement";
import generateHVCode from "../../../../utils/createStudentId";
import getBeltLabel from "../../../../utils/formatBeltLevel";
import validateUserForm from "../../../../hooks/ValidateUser";
import validateClassForm from "../../../../hooks/ValidateClass";
import mapUserRole from "../../../../utils/mapUserRole";
import { deleteActiveClassMembers, useActiveClassMembers, useInactiveClassMembers } from "../../../../hooks/useClassMembers"
import { MemberCardSkeleton } from "../../../../components/skeleton/MemberCardSkeleton";
import { ThreeDotLoader } from "../../../../components/ActionFallback";
import UserImportSystem from "../../../import-excel-users/UserImportSystem";

const ClassDetailPage = ({ classDetail, facilityId, onSave, onCancel }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState("new"); // 'new' or 'existing'
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfirmDeleteMemberDialog, setShowConfirmDeleteMemberDialog] = useState("");
  const delMem = useRef("");
  const [deletedMembers, setDeletedMembers] = useState([]);
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");
  const action = useRef("");
  const [expandedSections, setExpandedSections] = useState({
    coaches: true,
    instructors: true,
    students: true,
  });
  const [newEditedUser, setNewEditedUser] = useState({
    id: "",
    previousId: "",
    name: "",
    phoneNumber: "",
    dateOfBirth: "2000-02-25",
    email: "",
    password: null,
    avatar: "",
    createdAt: null,
    role: 2,
    beltLevel: "",
    isActiveInClass: true,
    facilityId: facilityId,
    classId: classDetail ? classDetail.id : null ,
    roleInClass: "coach"
  });
  const [duplicatedUsers, setDuplicatedUsers] = useState([]);

  const [newUsers, setNewUsers] = useState({
    'coach': [],
    'instructor': [],
    'student': [],
  });
  const [newMembers, setNewMembers] = useState({
    'coach': [],
    'instructor': [],
    'student': [],
  });
  // Containing existing users that were modified 
  const modifiedExistedMembers = useRef([]);
  const toUpdateClassMembers = useRef([]);
  const [inProgress, setInProgress] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [typeSearch, setTypeSearch] = useState("coach");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [errors, setErrors] = useState({});
  const [classErrors, setClassErrors] = useState({});

  // Mock data
  const [classInfo, setClassInfo] = useState(
    classDetail
  );

  const toggleDay = (day) => {
    setClassInfo((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.split("-").includes(day)
        ? prev.daysOfWeek
            .split("-")
            .filter((d) => d !== day)
            .sort()
            .join("-")
        : prev.daysOfWeek.length === 0
        ? day
        : (prev.daysOfWeek + "-" + day).split("-").sort().join("-"),
    }));
  };

  const {
    isPending: isActiveMemberPending,
    isSuccess: isActiveMemberSuccess,
    data: activeMembers,
    refetch: refetchActiveMembers,
  } = useActiveClassMembers({classId: classDetail?.id});

  const {
    isPending: isInactiveMemberPending,
    isSuccess: isInactiveMemberSuccess,
    data: inactiveMembers,
    refetch: refetchInactiveMembers,
  } = useInactiveClassMembers({ classId: classDetail?.id });

  const {
    isPending: isPendingSearch,
    error: errorSearch,
    data: searchUsers,
    refetch: refetchSearchUsers,
  } = useQuery({
    queryKey: [
      "users",
      "search",
      typeSearch,
      activeSearch,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      typeSearch === "student"
        ? userService.getActiveStudentByName(
            activeSearch,
            currentPage-1,
            pageSize
          )
        : userService.getActiveCoachInstructorByName(
            activeSearch,
            currentPage-1,
            pageSize
          ),
    enabled: activeSearch !== '',
    staleTime: 60000*5
  });
  
  const changeUserInMemberList = (user) => {
    if(user.isActiveInClass) {
      queryClient.setQueryData(
        ["members", "active", classDetail.id],
        (prev) => ({
          ...prev,
          data: prev.data.map((mem) => (mem.id === user.id ? user : mem)),
        })
      );
    }
    else {
      queryClient.setQueryData(
        ["members", "inactive", classDetail.id],
        (prev) => ({
          ...prev,
          data: prev.data.map((mem) => (mem.id === user.id ? user : mem)),
        })
      );
    }

  };

  const changeUserInNewMemberList = (user) => {
    let previousRoleInClass = user.roleInClass;
    for(const [role, listMem] of Object.entries(newMembers)) {
      const exist = listMem.find((mem) => mem.id === user.id);
      if(exist) {
        previousRoleInClass = role;
        break;
      }
    }
    // Case: Role In Class doesn't change
    if(previousRoleInClass === user.roleInClass) {
      setNewMembers((prev) => ({
        ...prev,
        [user.roleInClass]: prev[user.roleInClass].map((mem) =>
          mem.id === user.id ? user : mem
        ),
      }));
    }
    // Case: Role In Class change
    else {

      setNewMembers((prev) => {
        const updated = { ...prev };
        // Remove out previous role list
        updated[previousRoleInClass] = updated[previousRoleInClass].filter(
          (mem) => mem.id !== user.id
        );
        // Add into current role list
        updated[user.roleInClass] = [...updated[user.roleInClass], user];
        return updated;
      });
    }
    
  };

  const checkDuplicatedUserId = (userId) => {
    if(activeMembers) {
      
    }
  }

  const changeUserInNewUserList = (user) => {
    
    let previousRoleInClass = user.roleInClass;
    // newUsers contain previous data, so use newUsers to get previous role of this user
    for (const [role, listMem] of Object.entries(newUsers)) {
      const exist = listMem.find((mem) => mem.id === user.id);
      if (exist) {
        previousRoleInClass = role;
        break;
      }
    }
    // Case: Role In Class doesn't change
    if (previousRoleInClass === user.roleInClass) {
      setNewUsers((prev) => ({
        ...prev,
        [user.roleInClass]: prev[user.roleInClass].map((mem) =>
          mem.id === user.previousId ? {
            ...user,
            previousId: user.id
          } : mem
        ),
      }));
    }
    // Case: Role In Class change
    else {
      setNewUsers((prev) => {
        const updated = { ...prev };
        // Remove out previous role list
        updated[previousRoleInClass] = updated[previousRoleInClass].filter(
          (mem) => mem.id !== user.previousId
        );
        // Add into current role list
        updated[user.roleInClass] = [...updated[user.roleInClass], {...user, previousId: user.id}];
        return updated;
      });
    }
    
  };

  const handleSearch = () => {
    setActiveSearch(searchInput);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle user type change
  const handleTypeSearchChange = (e) => {
    setTypeSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when changing type
    // Note: activeSearch stays the same, so it will search with new type
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];

  const daysMap = {
    "Thứ 2": "2",
    "Thứ 3": "3",
    "Thứ 4": "4",
    "Thứ 5": "5",
    "Thứ 6": "6",
    "Thứ 7": "7",
    CN: "8",
  };

  const editNewUser = (field, value) => {
    setNewEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmCancel = () => {
    setShowConfirmDialog(true);
    action.current = "cancel";
  };

  const confirmSave = () => {
    setShowConfirmDialog(true);
    action.current = "store";
  };

  const handleSubmit = async () => {
    const check = validateClassForm({editClassForm : classInfo});
    if(Object.keys(check).length === 0) {
      try {
        setInProgress(true);
        await onSave({
          classInfo: classInfo,
          facilityId: facilityId,
          newUsers: newUsers,
          newMembers: newMembers,
          usersToUpdate: modifiedExistedMembers.current,
          deletedMembers: deletedMembers,
          classMembersChangeStatus: toUpdateClassMembers.current
        });
        onCancel();
      } catch (error) {
        setInProgress(false)
        setShowError(true);
        if(error.duplicatedUsers) {
          setDuplicatedUsers(error.duplicatedUsers);
        }
        errorMessage.current = error.message;
        
        console.log(error);
      }
    }
    setShowConfirmDialog(false);
    setClassErrors(check);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleAddNewUser = () => {
    if (validateNewUserForm()) {
      setNewUsers((prev) => ({
        ...prev,
        [newEditedUser.roleInClass]: prev[newEditedUser.roleInClass]
          ? [{ ...newEditedUser }, ...prev[newEditedUser.roleInClass]]
          : [{ ...newEditedUser }],
      }));
      setNewEditedUser({
        id: "",
        name: "",
        phoneNumber: "",
        dateOfBirth: "2000-02-25",
        email: "",
        password: null,
        avatar: "",
        createdAt: null,
        role: 2,
        beltLevel: "",
        isActiveInClass: true,
        facilityId: facilityId,
        classId: classDetail.id,
        roleInClass: "coach",
      });
      setShowAddModal(false);
    }
  };

  const handleAddNewMember = (user) => {
    const activeMembersInClass = [];
    const activeNewMembersInClass = [];
    const inactiveMembersInClass = [];
    if(activeMembers) {
      for (const value of Object.values(activeMembers)) {
        activeMembersInClass.push(...value.map((mem) => mem.id));
      }
    }
    
    if(inactiveMembers) {
      for (const value of Object.values(inactiveMembers)) {
        inactiveMembersInClass.push(value.map((mem) => mem.id));
      }
    }

    for(const value of Object.values(newMembers)) {
        activeNewMembersInClass.push(...(value.map((mem) => mem.id)));
    }

    if(activeMembersInClass.includes(user.id)) {
        setShowError(true);
        errorMessage.current = "Người dùng này đã thuộc lớp này";
    }
    else if (inactiveMembersInClass.includes(user.id)) {
        setShowError(true);
        errorMessage.current = "Người dùng này đang ở trạng thái ngưng hoạt động ở lớp này. Hãy kích hoạt lại người dùng";
    }
    else if (activeNewMembersInClass.includes(user.id)) {
        setShowError(true);
        errorMessage.current = "Người dùng này đã được thêm mới vào lớp này";
    }
    else if (user.roleInClass) {
      setNewMembers((prev) => ({
        ...prev,
        [user.roleInClass]: prev[user.roleInClass]
          ? [{ ...user }, ...prev[user.roleInClass]]
          : [{ ...user }],
      }));
      setShowAddModal(false);
    }
  };

  const validateNewUserForm = () => {
    const newErrors = {};

    if(!newEditedUser.id.trim()) {
      newErrors.id = "ID người dùng là bắt buộc";
    }
    else if (newEditedUser.id.length > 100) {
      newErrors.id = "ID người dùng không được vượt quá 100 ký tự";
    }

    if (!newEditedUser.name.trim()) {
      newErrors.name = "Tên người dùng là bắt buộc";
    } else if (newEditedUser.name.length > 100) {
      newErrors.name = "Tên người dùng không được vượt quá 100 ký tự";
    }

    if (!newEditedUser.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    }

    if (
      newEditedUser.phoneNumber &&
      !/^\d{10}$/.test(newEditedUser.phoneNumber)
    ) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
    }

    if (newEditedUser.email.length > 100) {
      newErrors.email = "Email không được vượt quá 100 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(deletedMembers);
  const handleDeleteMember = (userId) => {
    setDeletedMembers((currentDelMems) => [userId, ...currentDelMems]);
    setShowConfirmDeleteMemberDialog(false);
    delMem.current = "";
    setShowConfirmDeleteMemberDialog("");
  }

  const MemberCard = ({ member, type, isActiveInClass, state = "inClass", setMemberList, duplicatedUser }) => {
    const [editForm, setEditForm] = useState(member);
    const isEditing = editingId === member.id;
    const [memberCardErrors, setMemberCardErrors] = useState({});

    const handleOnChange = (field, value) => {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Determine badge and styling based on state
    const getStateBadge = () => {
      if (state === "newUser" && duplicatedUser) {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            ID trùng: {duplicatedUser}
          </span>
        );
      }
      if (state === "newUser") {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
            Chưa lưu
          </span>
        );
      }
      if (state === "newMember") {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            Thành viên mới
          </span>
        );
      }
      return null;
    };

    const getBorderColor = () => {
      if(state === "newUser" && duplicatedUser) return "border-red-200 bg-red-50";
      if (state === "newUser") return "border-amber-200 bg-amber-50";
      if (state === "newMember") return "border-purple-200 bg-purple-50";
      return "border-blue-100";
    };

    return (
      <div
        className={`bg-white rounded-lg border ${getBorderColor()} p-4 hover:shadow-md transition-shadow`}
      >
        {!isEditing ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shrink-0">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-semibold text-gray-900 truncate">
                  {member.name}
                </h4>
                <span className="text-xs text-gray-500">({member.id})</span>
                {getStateBadge()}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">SĐT:</span> {member.phoneNumber}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Đai:</span>{" "}
                  {getBeltLabel(member.beltLevel)}
                </span>
                {member.role && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Chức danh:</span>{" "}
                    {mapUserRole(member.role)}
                  </span>
                )}
              </div>
              {state === "newUser" && duplicatedUser && (
                <p className="text-xs text-red-600 mt-1">
                  Người dùng mới thêm phát hiện trùng ID với người dùng khác
                </p>
              )}
              {state === "newUser" && !duplicatedUser && (
                <p className="text-xs text-amber-600 mt-1">
                  Người dùng mới chưa được lưu vào cơ sở dữ liệu
                </p>
              )}
              {state === "newMember" && (
                <p className="text-xs text-purple-600 mt-1">
                  Thành viên đã tồn tại trong hệ thống, chưa thuộc lớp này
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {state === "inClass" && (
                <>
                  <button
                    onClick={() => {
                      editForm.name = member.name ? member.name : "";
                      editForm.phoneNumber = member.phoneNumber
                        ? member.phoneNumber
                        : "";
                      editForm.email = member.email ? member.email : "";
                      editForm.beltLevel = member.beltLevel
                        ? member.beltLevel
                        : "";
                      editForm.password = "";
                      editForm.roleInClass = member.roleInClass
                        ? member.roleInClass
                        : "";
                      setEditingId(member.id);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isActiveInClass
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={isActiveInClass ? "Ngưng hoạt động" : "Kích hoạt"}
                    onClick={() => {
                      member.isActiveInClass = !member.isActiveInClass;
                      if (isActiveInClass) {
                        queryClient.setQueryData(
                          ["members", "inactive", classDetail.id],
                          (prev) => ({
                            ...prev,
                            data: [member, ...prev.data],
                          })
                        );
                        queryClient.setQueryData(
                          ["members", "active", classDetail.id],
                          (prev) => ({
                            ...prev,
                            data: prev.data.filter(
                              (mem) => mem.id !== member.id
                            ),
                          })
                        );
                      } else {
                        queryClient.setQueryData(
                          ["members", "active", classDetail.id],
                          (prev) => ({
                            ...prev,
                            data: [member, ...prev.data],
                          })
                        );
                        queryClient.setQueryData(
                          ["members", "inactive", classDetail.id],
                          (prev) => ({
                            ...prev,
                            data: prev.data.filter(
                              (mem) => mem.id !== member.id
                            ),
                          })
                        );
                      }

                      const isExist = toUpdateClassMembers.current.some(
                        (em) => em.userId === member.id
                      );
                      if (isExist) {
                        toUpdateClassMembers.current =
                          toUpdateClassMembers.current.map((em) =>
                            em.userId === member.id
                              ? {
                                  userId: member.id,
                                  isActiveInClass: member.isActiveInClass,
                                  roleInClass: member.roleInClass,
                                }
                              : em
                          );
                      } else {
                        toUpdateClassMembers.current.push({
                          userId: member.id,
                          isActiveInClass: member.isActiveInClass,
                          roleInClass: member.roleInClass,
                        });
                      }
                    }}
                  >
                    <Power size={18} />
                  </button>
                  <button
                    onClick={() => {
                      delMem.current = member.id;
                      setShowConfirmDeleteMemberDialog(member.name);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa thành viên lớp"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              {(state === "newUser" || state === "newMember") && (
                <>
                  <button
                    onClick={() => {
                      if (state === "newUser") {
                        editForm.id = member.id ? member.id : "";
                      }
                      editForm.name = member.name ? member.name : "";
                      editForm.phoneNumber = member.phoneNumber
                        ? member.phoneNumber
                        : "";
                      editForm.email = member.email ? member.email : "";
                      editForm.beltLevel = member.beltLevel
                        ? member.beltLevel
                        : "";
                      editForm.password = "";
                      editForm.roleInClass = member.roleInClass
                        ? member.roleInClass
                        : "";
                      setEditingId(member.id);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                    onClick={() => {
                      if (state === "newUser") {
                        setNewUsers((prev) => ({
                          ...prev,
                          [member.roleInClass]: prev[member.roleInClass].filter(
                            (mem) => mem.id !== member.id
                          ),
                        }));
                      } else if (state === "newMember") {
                        setNewMembers((prev) => ({
                          ...prev,
                          [member.roleInClass]: prev[member.roleInClass].filter(
                            (mem) => mem.id !== member.id
                          ),
                        }));
                      }
                    }}
                  >
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {state === "newUser" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Người dùng *
                </label>
                <input
                  type="text"
                  value={editForm.id}
                  onChange={(e) => handleOnChange("id", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 italic mt-1">
                  Vui lòng{" "}
                  <strong className="text-gray-900">kiểm tra thật kỹ ID</strong>{" "}
                  vì sau khi tạo sẽ không thể thay đổi
                </p>
                {memberCardErrors.id && (
                  <p className="mt-1 text-sm text-red-500">
                    {memberCardErrors.id}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-3">
              {/* Row 1: Họ tên and Ngày sinh */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => {
                      handleOnChange("name", e.target.value);
                      if (state === "newUser") {
                        handleOnChange(
                          "id",
                          generateHVCode(e.target.value, editForm.dateOfBirth)
                        );
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {memberCardErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {memberCardErrors.name}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => {
                      handleOnChange("dateOfBirth", e.target.value);
                      if (state === "newUser") {
                        handleOnChange(
                          "id",
                          generateHVCode(editForm.name, e.target.value)
                        );
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {memberCardErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">
                      {memberCardErrors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Số điện thoại and Email */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      handleOnChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {memberCardErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {memberCardErrors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    placeholder="email@example.com"
                    onChange={(e) => handleOnChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {memberCardErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {memberCardErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Cấp đai and Mật khẩu (conditional) */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp đai
                  </label>
                  <select
                    value={editForm.beltLevel}
                    onChange={(e) =>
                      handleOnChange("beltLevel", e.target.value)
                    }
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="">Không</option>
                    <option value="white">Đai Trắng</option>
                    <option value="yellow">Đai Vàng</option>
                    <option value="green">Đai Xanh Lục</option>
                    <option value="blue">Đai Xanh</option>
                    <option value="red">Đai Đỏ</option>
                    <option value="black/1">Đai Đen 1 Đẳng</option>
                    <option value="black/2">Đai Đen 2 Đẳng</option>
                    <option value="black/3">Đai Đen 3 Đẳng</option>
                    <option value="black/4">Đai Đen 4 Đẳng</option>
                    <option value="black/5">Đai Đen 5 Đẳng</option>
                    <option value="black/6">Đai Đen 6 Đẳng</option>
                    <option value="black/7">Đai Đen 7 Đẳng</option>
                    <option value="black/8">Đai Đen 8 Đẳng</option>
                    <option value="black/9">Đai Đen 9 Đẳng</option>
                    <option value="black/10">Đai Đen 10 Đẳng</option>
                  </select>
                </div>
                {state !== "newUser" && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      value={editForm.password}
                      placeholder="••••••••"
                      onChange={(e) =>
                        handleOnChange("password", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {memberCardErrors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {memberCardErrors.password}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Row 4: Vai trò trong lớp (full width if shown) */}
              {member.role !== 4 && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức danh *
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => handleOnChange("role", e.target.value)}
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="2">Huấn luyện viên</option>
                    <option value="3">Hướng dẫn viên</option>
                  </select>
                </div>
              )}
              {type !== "students" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò trong lớp
                  </label>
                  <select
                    value={editForm.roleInClass}
                    onChange={(e) =>
                      handleOnChange("roleInClass", e.target.value)
                    }
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="coach">Huấn luyện viên</option>
                    <option value="instructor">Hướng dẫn viên</option>
                  </select>
                </div>
              )}

              {/* Row 5: Hình đại diện (full width) */}
              
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Hoàn tác
              </button>
              <button
                onClick={() => {
                  // Change local information
                  const updatedMember = {
                    ...member,
                    id: editForm.id,
                    name: editForm.name,
                    email: editForm.email,
                    role: editForm.role,
                    phoneNumber: editForm.phoneNumber,
                    dateOfBirth: editForm.dateOfBirth,
                    password: editForm.password,
                    roleInClass: editForm.roleInClass,
                    beltLevel: editForm.beltLevel,
                  };
                  const check = validateUserForm({
                    editUserForm: updatedMember,
                  });
                  if (Object.keys(check).length > 0) {
                    setMemberCardErrors(check);
                    return;
                  }
                  setMemberCardErrors(check);
                  setMemberList(updatedMember);

                  if (state === "inClass") {
                    const isExist = toUpdateClassMembers.current.some(
                      (em) => em.userId === member.id
                    );

                    if (isExist) {
                      toUpdateClassMembers.current =
                        toUpdateClassMembers.current.map((cm) =>
                          cm.userId === member.id
                            ? {
                                userId: member.id,
                                roleInClass: member.roleInClass,
                                isActiveInClass: member.isActiveInClass,
                              }
                            : cm
                        );
                    } else {
                      toUpdateClassMembers.current.push({
                        userId: member.id,
                        roleInClass: member.roleInClass,
                        isActiveInClass: member.isActiveInClass,
                      });
                    }
                  }
                  if (state !== "newUser") {
                    // Add to later updated users
                    // Each user has a only newest record for updated purpose
                    const isExist = modifiedExistedMembers.current.some(
                      (em) => em.id === member.id
                    );
                    if (isExist) {
                      modifiedExistedMembers.current =
                        modifiedExistedMembers.current.map((em) =>
                          em.id === member.id
                            ? {
                                ...member,
                                name: editForm.name,
                                email: editForm.email,
                                role: editForm.role,
                                phoneNumber: editForm.phoneNumber,
                                password: editForm.password,
                                roleInClass: editForm.roleInClass,
                                beltLevel: editForm.beltLevel,
                              }
                            : em
                        );
                    } else {
                      modifiedExistedMembers.current.push({
                        ...member,
                        name: editForm.name,
                        email: editForm.email,
                        role: editForm.role,
                        phoneNumber: editForm.phoneNumber,
                        password: editForm.password,
                        roleInClass: editForm.roleInClass,
                        beltLevel: editForm.beltLevel,
                      });
                    }
                  }

                  setEditingId(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MemberSection = ({
    title,
    members,
    newUsers,
    newMembers,
    type,
    isActiveInClass,
  }) => {
    const sectionKey = type;
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            {title}
            <span className="text-sm font-normal text-gray-500">
              ({members.length})
            </span>
          </h3>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isExpanded && (
          <div className="space-y-3">
            {newUsers.length > 0 &&
              newUsers.map((user) => (
                <MemberCard
                  key={user.id}
                  member={user}
                  type={type}
                  isActiveInClass={isActiveInClass}
                  state="newUser"
                  duplicatedUser={duplicatedUsers.find(
                    (userId) => userId === user.id
                  )}
                  setMemberList={changeUserInNewUserList}
                />
              ))}
            {newMembers.length > 0 &&
              newMembers.map((newMem) => {
                return (
                  <MemberCard
                    key={newMem.id}
                    member={newMem}
                    type={type}
                    isActiveInClass={isActiveInClass}
                    state="newMember"
                    duplicatedUser={null}
                    setMemberList={changeUserInNewMemberList}
                  />
                );
              })}
            {members.length > 0 ? (
              members.map((member) =>
                !deletedMembers.includes(member.id) && (
                  <MemberCard
                    key={member.id}
                    member={member}
                    type={type}
                    isActiveInClass={isActiveInClass}
                    state="inClass"
                    duplicatedUser={null}
                    setMemberList={changeUserInMemberList}
                  />
                )
              )
            ) : (
              <p className="text-center text-gray-500 py-4">Không có dữ liệu</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {showError && (
        <AnnouncementUI
          setVisible={setShowError}
          message={errorMessage.current}
        />
      )}
      {showConfirmDialog && classDetail && (
        <ConfirmDialog
          title={
            action.current === "cancel"
              ? "Hủy cập nhật thông tin lớp học"
              : "Cập nhật thông tin lớp học"
          }
          askDetail={
            action.current === "cancel"
              ? "Bạn có muốn hủy cập nhật lớp học hiện tại không ?"
              : "Bạn có muốn lưu thông tin cập nhật lớp học không ?"
          }
          handleCancel={() => setShowConfirmDialog(false)}
          handleConfirm={
            action.current === "cancel" ? handleCancel : handleSubmit
          }
        />
      )}

      {showConfirmDialog && !classDetail && (
        <ConfirmDialog
          title={
            action.current === "cancel" ? "Hủy tạo lớp học" : "Tạo lớp học"
          }
          askDetail={
            action.current === "cancel"
              ? "Bạn có muốn hủy tạo lớp học hiện tại không ?"
              : "Bạn có muốn tạo lớp học không ?"
          }
          handleCancel={() => setShowConfirmDialog(false)}
          handleConfirm={
            action.current === "cancel" ? handleCancel : handleSubmit
          }
        />
      )}

      {showConfirmDeleteMemberDialog && (
        <ConfirmDialog
          title={"Xóa " + showConfirmDeleteMemberDialog}
          askDetail={
            "Bạn có chắc chắn muốn xóa " +
            showConfirmDeleteMemberDialog +
            " ra khỏi lớp " +
            classDetail.name +
            " không ?"
          }
          handleCancel={() => setShowConfirmDeleteMemberDialog(false)}
          handleConfirm={() => handleDeleteMember(delMem.current)}
        />
      )}

      {inProgress && (
        <ThreeDotLoader message="Đang cập nhật thông tin lớp..." />
      )}
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi Tiết Lớp Học
              </h1>
              <p className="text-gray-600">
                Quản lý thông tin lớp học và thành viên
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
                {classDetail ? "Lưu thay đổi" : "Tạo cơ sở"}
              </button>
            </div>
          </div>

          {/* Class Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              Thông Tin Lớp Học
            </h2>

            <div className="flex">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  value={classInfo.name}
                  onChange={(e) =>
                    setClassInfo({ ...classInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {classErrors.name && (
                  <p className="mt-1 mb-3 text-sm text-red-500">
                    {classErrors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ bắt đầu *
                </label>
                <input
                  type="time"
                  value={classInfo.startHour}
                  onChange={(e) =>
                    setClassInfo({ ...classInfo, startHour: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ kết thúc *
                </label>
                <input
                  type="time"
                  value={classInfo.endHour}
                  onChange={(e) =>
                    setClassInfo({ ...classInfo, endHour: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ngày học
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(daysMap[day])}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      classInfo.daysOfWeek.split("-").includes(daysMap[day])
                        ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {classErrors.daysOfWeek && (
                <p className="mt-1 mb-3 text-sm text-red-500">
                  {classErrors.daysOfWeek}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={classInfo.description}
                onChange={(e) =>
                  setClassInfo({ ...classInfo, description: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {classErrors.description && (
                <p className="mt-1 mb-3 text-sm text-red-500">
                  {classErrors.description}
                </p>
              )}
            </div>
          </div>

          {/* Add Member Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <UserPlus size={20} />
              Thêm Thành Viên
            </button>
          </div>

          {/* Members List with Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex gap-2 mb-6 border-b">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "active"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Còn Hoạt Động
              </button>
              <button
                onClick={() => setActiveTab("inactive")}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "inactive"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Ngưng Hoạt Động
              </button>
            </div>

            {activeTab === "active" && classDetail?.id ? (
              isActiveMemberPending ? (
                <>
                  <MemberCardSkeleton />
                  <MemberCardSkeleton />
                  <MemberCardSkeleton />
                </>
              ) : isActiveMemberSuccess ? (
                <div>
                  <MemberSection
                    title="Huấn Luyện Viên"
                    members={activeMembers.coach ? activeMembers.coach : []}
                    newUsers={newUsers.coach ? newUsers.coach : []}
                    newMembers={newMembers.coach ? newMembers.coach : []}
                    type="coaches"
                    isActiveInClass={true}
                  />
                  <MemberSection
                    title="Hướng Dẫn Viên"
                    members={
                      activeMembers.instructor ? activeMembers.instructor : []
                    }
                    newUsers={newUsers.instructor ? newUsers.instructor : []}
                    newMembers={
                      newMembers.instructor ? newMembers.instructor : []
                    }
                    type="instructors"
                    isActiveInClass={true}
                  />
                  <MemberSection
                    title="Võ Sinh"
                    members={activeMembers.student ? activeMembers.student : []}
                    newUsers={newUsers.student ? newUsers.student : []}
                    newMembers={newMembers.student ? newMembers.student : []}
                    type="students"
                    isActiveInClass={true}
                  />
                </div>
              ) : (
                <LoadingErrorUI
                  errorMessage="Đã xảy ra lỗi khi tải thông tin thành viên lớp học. Vui lòng thử lại"
                  refetchData={refetchActiveMembers}
                />
              )
            ) : (
              <></>
            )}

            {activeTab === "inactive" && classDetail?.id ? (
              isInactiveMemberPending ? (
                <>
                  <MemberCardSkeleton />
                  <MemberCardSkeleton />
                  <MemberCardSkeleton />
                </>
              ) : isInactiveMemberSuccess ? (
                <div>
                  <MemberSection
                    title="Huấn Luyện Viên"
                    members={inactiveMembers.coach ? inactiveMembers.coach : []}
                    newUsers={[]}
                    newMembers={[]}
                    type="coaches"
                    isActiveInClass={false}
                  />
                  <MemberSection
                    title="Hướng Dẫn Viên"
                    members={
                      inactiveMembers.instructor
                        ? inactiveMembers.instructor
                        : []
                    }
                    newUsers={[]}
                    newMembers={[]}
                    type="instructors"
                    isActiveInClass={false}
                  />
                  <MemberSection
                    title="Võ Sinh"
                    members={
                      inactiveMembers.student ? inactiveMembers.student : []
                    }
                    newUsers={[]}
                    newMembers={[]}
                    type="students"
                    isActiveInClass={false}
                  />
                </div>
              ) : (
                <LoadingErrorUI
                  errorMessage="Đã xảy ra lỗi khi tải thông tin thành viên cũ của lớp học này. Vui lòng thử lại"
                  refetchData={refetchInactiveMembers}
                />
              )
            ) : (
              <></>
            )}

            {activeTab === "active" && !classDetail.id && (
              <div>
                <MemberSection
                  title="Huấn Luyện Viên"
                  members={[]}
                  newUsers={newUsers.coach ? newUsers.coach : []}
                  newMembers={newMembers.coach ? newMembers.coach : []}
                  type="coaches"
                  isActiveInClass={true}
                />
                <MemberSection
                  title="Hướng Dẫn Viên"
                  members={[]}
                  newUsers={newUsers.instructor ? newUsers.instructor : []}
                  newMembers={
                    newMembers.instructor ? newMembers.instructor : []
                  }
                  type="instructors"
                  isActiveInClass={true}
                />
                <MemberSection
                  title="Võ Sinh"
                  members={[]}
                  newUsers={newUsers.student ? newUsers.student : []}
                  newMembers={newMembers.student ? newMembers.student : []}
                  type="students"
                  isActiveInClass={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Thêm Thành Viên
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setAddType("new")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      addType === "new"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Thêm Mới
                  </button>
                  <button
                    onClick={() => setAddType("existing")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      addType === "existing"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Thêm Từ Hệ Thống
                  </button>
                </div>

                {addType === "new" ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chức danh *
                        </label>
                        <select
                          className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                          onChange={(e) => {
                            editNewUser("role", parseInt(e.target.value));
                            if (e.target.value === "4") {
                              editNewUser("roleInClass", "student");
                            }
                          }}
                          value={newEditedUser.role}
                        >
                          <option value="2">Huấn luyện viên</option>
                          <option value="3">Hướng dẫn viên</option>
                          <option value="4">Võ sinh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Người dùng *
                        </label>
                        <input
                          type="text"
                          value={newEditedUser.id}
                          onChange={(e) => {
                            editNewUser("id", e.target.value);
                            editNewUser("previousId", e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 italic mt-1">
                          Vui lòng{" "}
                          <strong className="text-gray-900">
                            kiểm tra thật kỹ ID
                          </strong>{" "}
                          vì sau khi tạo sẽ không thể thay đổi
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ tên *
                          </label>
                          <input
                            type="text"
                            value={newEditedUser.name}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.name ? "border-red-500" : "border-gray-500"
                            }`}
                            onChange={(e) => {
                              editNewUser("name", e.target.value);
                              editNewUser(
                                "id",
                                generateHVCode(
                                  e.target.value,
                                  newEditedUser.dateOfBirth
                                )
                              );
                              editNewUser(
                                "previousId",
                                generateHVCode(
                                  e.target.value,
                                  newEditedUser.dateOfBirth
                                )
                              );
                            }}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày sinh *
                          </label>
                          <input
                            type="date"
                            value={newEditedUser.dateOfBirth}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.dateOfBirth
                                ? "border-red-500"
                                : "border-gray-500"
                            }`}
                            onChange={(e) => {
                              editNewUser("dateOfBirth", e.target.value);
                              editNewUser(
                                "id",
                                generateHVCode(
                                  newEditedUser.name,
                                  e.target.value
                                )
                              );
                              editNewUser(
                                "previousId",
                                generateHVCode(
                                  newEditedUser.name,
                                  e.target.value
                                )
                              );
                            }}
                          />
                          {errors.dateOfBirth && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.dateOfBirth}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-gray-500"
                            }`}
                            onChange={(e) =>
                              editNewUser("phoneNumber", e.target.value)
                            }
                            value={newEditedUser.phoneNumber}
                          />
                          {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-500"
                            }`}
                            onChange={(e) =>
                              editNewUser("email", e.target.value)
                            }
                            value={newEditedUser.email}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cấp đai
                        </label>
                        <select
                          className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                          onChange={(e) =>
                            editNewUser("beltLevel", e.target.value)
                          }
                          value={newEditedUser.beltLevel}
                        >
                          <option value="">Không</option>
                          <option value="white">Đai Trắng</option>
                          <option value="yellow">Đai Vàng</option>
                          <option value="green">Đai Xanh Lục</option>
                          <option value="blue">Đai Xanh</option>
                          <option value="red">Đai Đỏ</option>
                          <option value="black/1">Đai Đen 1 Đẳng</option>
                          <option value="black/2">Đai Đen 2 Đẳng</option>
                          <option value="black/3">Đai Đen 3 Đẳng</option>
                          <option value="black/4">Đai Đen 4 Đẳng</option>
                          <option value="black/5">Đai Đen 5 Đẳng</option>
                          <option value="black/6">Đai Đen 6 Đẳng</option>
                          <option value="black/7">Đai Đen 7 Đẳng</option>
                          <option value="black/8">Đai Đen 8 Đẳng</option>
                          <option value="black/9">Đai Đen 9 Đẳng</option>
                          <option value="black/10">Đai Đen 10 Đẳng</option>
                        </select>
                      </div>

                      {newEditedUser.role !== 4 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vai trò trong lớp
                          </label>
                          <select
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                            disabled={newEditedUser.role === 4}
                            onChange={(e) =>
                              editNewUser("roleInClass", e.target.value)
                            }
                            value={newEditedUser.roleInClass}
                          >
                            <option value="coach">Huấn luyện viên</option>
                            <option value="instructor">Hướng dẫn viên</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hình đại diện
                        </label>
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                            <Camera size={18} />
                            Chọn ảnh
                          </button>
                          <span className="text-sm text-gray-500">
                            Chưa chọn file
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t">
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleAddNewUser()}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <UserPlus size={18} />
                        Thêm Thành Viên
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vai trò trong lớp
                      </label>
                      <select
                        className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                        value={typeSearch}
                        onChange={handleTypeSearchChange}
                      >
                        <option value="coach">Huấn luyện viên</option>
                        <option value="instructor">Hướng dẫn viên</option>
                        <option value="student">Võ sinh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm thành viên
                      </label>
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Nhập tên để tìm kiếm..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onKeyUp={handleKeyUp}
                        />
                      </div>
                    </div>

                    {/* Search Results */}
                    <div className="mt-6">
                      {isPendingSearch ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600">
                            Đang tải...
                          </span>
                        </div>
                      ) : errorSearch ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-800">
                            <strong>Lỗi:</strong> {errorSearch.message}
                          </p>
                        </div>
                      ) : searchUsers?.data.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                          <Search
                            className="mx-auto text-gray-400 mb-3"
                            size={48}
                          />
                          <p className="text-gray-600 font-medium">
                            Không tìm thấy kết quả
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Thử tìm kiếm với từ khóa khác
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Results Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-700">
                              Kết quả tìm kiếm (
                              {searchUsers?.data.page.totalElements})
                            </h3>
                            <div className="text-sm text-gray-500">
                              Trang {currentPage} /{" "}
                              {searchUsers?.data.page.totalPages}
                            </div>
                          </div>

                          {/* User List */}
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {searchUsers?.data.content.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                              >
                                {/* User Info */}
                                <div className="flex items-start space-x-4 flex-1">
                                  {/* Avatar */}
                                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0">
                                    {/* Name and ID */}
                                    <div className="flex items-center space-x-2 mb-2">
                                      <p className="font-semibold text-gray-900">
                                        {user.name}
                                      </p>
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                        {user.id}
                                      </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                      {/* Phone Number */}
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-400 shrink-0"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                          {user.phoneNumber}
                                        </span>
                                      </div>

                                      {/* Belt Level */}
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-400 shrink-0"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                          />
                                        </svg>
                                        <span className="text-sm font-medium text-blue-600">
                                          {user.beltLevel}
                                        </span>
                                      </div>

                                      {/* Date of Birth */}
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-400 shrink-0"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                          {user.dateOfBirth}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Add Button */}
                                <button
                                  onClick={() => {
                                    const addedMember = {
                                      ...user,
                                      classId: classDetail.id
                                        ? classDetail.id
                                        : null,
                                      roleInClass: typeSearch,
                                    };
                                    handleAddNewMember(addedMember);
                                  }}
                                  className="ml-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
                                >
                                  Thêm
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {searchUsers?.data.page.totalElements > pageSize && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                              <button
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span>←</span>
                                <span>Trước</span>
                              </button>

                              {/* Page Numbers */}
                              <div className="flex items-center space-x-1">
                                {[
                                  ...Array(
                                    Math.min(
                                      5,
                                      searchUsers?.data.page.totalPages
                                    )
                                  ),
                                ].map((_, idx) => {
                                  const pageNum = idx + 1;
                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => handlePageChange(pageNum)}
                                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === pageNum
                                          ? "bg-blue-600 text-white"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={
                                  currentPage >=
                                  searchUsers?.data.page.totalPages
                                }
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span>Sau</span>
                                <span>→</span>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Khi thêm võ sinh từ lớp khác,
                        trạng thái hoạt động ở lớp cũ sẽ chuyển thành "Ngưng
                        hoạt động"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {classDetail.id && <UserImportSystem classId={classDetail.id} />}
      </div>
    </>
  );
};

export default ClassDetailPage;