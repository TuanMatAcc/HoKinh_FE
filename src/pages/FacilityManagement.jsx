import { useState } from 'react';
import { Search, Plus, MapPin, Phone, Users, Clock, Calendar, Edit, Eye, ChevronRight, FileText, ExternalLink, Navigation, CalendarClock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { facilityService } from '../services/facility_api';
import { facilityClassService } from '../services/facility_class_api'
import EditFacility from '../features/facility/components/facility_management/facility_edit_view';
import { cloudinaryService } from '../services/upload_api';
import { storageService } from '../services/upload_image_api';
import formatDate from '../utils/formatDate';
import ClassDetailPage from '../features/facility/components/facility_management/class_edit_view';
import { userService } from '../services/user_api';
import { facilityClassUserService } from '../services/facility_class_user_api';
import pLimit from 'p-limit';
import { useManagerOptions } from '../hooks/useManagerOptionsData'
import { ThreeDotLoader } from '../components/ActionFallback';
import FacilityDetail from '../features/facility/components/facility_management/FacilityDetail';
import FacilityCard from '../features/facility/components/facility_management/FacilityCard';
import { useFacility } from '../hooks/useFacilityData';
import Header from '../components/Header';
import { deleteActiveClassMembers, deleteInactiveClassMembers } from '../hooks/useClassMembers';

const FacilityManagement = () => {
  const [user] = useState({
    ...JSON.parse(
      localStorage.getItem("userInfo")
        ? localStorage.getItem("userInfo")
        : getDefaultUser()
    )
  });
    const [view, setView] = useState('list'); // 'list' or 'detail'
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
    const { data: managerOptions, isPending: isLoadingManagerOptions } = useManagerOptions();

    const {data: facilities, isPending: isLoadingFacilities} = useFacility();

    const queryClient = useQueryClient();

    // Just get hour and minute
    const formatTime = (timeString) => timeString.slice(0, 5);

    const onCancelEdit = () => {
        if(selectedFacility) {
            setView('detail');
        }
        else {
            setView('list');
        }
    }

    const onSaveEditClass = async ({classInfo, facilityId, newUsers, newMembers, deletedMembers, usersToUpdate, classMembersChangeStatus}) => {
        try {
            if(classInfo.id) {
                console.log("ON SAVE:")
                await facilityClassService.update(classInfo.id, classInfo);
                queryClient.setQueryData(["facilities", 'management'], prev => ({
                    ...prev,
                    data: prev.data.map((fac) => fac.id === facilityId ? {
                        ...fac,
                        classes: fac.classes.map((cls) => cls.id === classInfo.id ? classInfo : cls)
                    } : fac)
                }));
                setSelectedFacility(prev => ({
                    ...prev,
                    classes: prev.classes.map((cls) => cls.id === classInfo.id ? classInfo : cls)
                }));
                console.log("Save Class Success");
                const limit = pLimit(3);
                // Create new users
                // TODO : check which type is empty, only call when containing users
                const tasks = Object.entries(newUsers).map(([role, users]) =>
                    limit(async () => {
                        let result = [];
                        if(users.length !== 0) {
                            result = (await userService.createMemberForClass(
                              users.map((u) => ({
                                ...u,
                                facilityId: facilityId,
                                classId: classInfo.id,
                                password: "aaaaaaaa"
                              })),
                              classInfo.id
                            )).data;
                            result = result.map((user) => ({
                              ...user,
                              classId: classInfo.id,
                              roleInClass: role,
                            }));
                        }
                        // Return both the role and its corresponding result array
                        return { role, result };
                    })
                );
                console.log("Send request");
                const results = await Promise.all(tasks);
                console.log("Create User and bring them to class Success ");
                console.log(results);

                // Bring all results to an array
                const createdUsers = results.flatMap(item => item.result)
                queryClient.setQueryData(
                  ["members", "active", classInfo.id],
                  (prev) => ({
                    ...prev,
                    data: [...createdUsers, ...prev.data],
                  })
                );
                console.log(queryClient.getQueryData(["members", "active", classInfo.id]));
                console.log("Map by type:");
                console.log(createdUsers);
                
                const newUsersWithRole = [];
                Object.keys(newMembers).forEach((key) => {
                  for (const u of newMembers[key]) {
                    newUsersWithRole.push({
                      userId: u.id,
                      roleInClass: key,
                      isActiveInClass: u.isActiveInClass
                    });
                  }
                });
                
                const memberList = {
                    facilityClassId: classInfo.id,
                    users: [
                        ...newUsersWithRole
                    ]
                };

                console.log("Member list to bring into class:");
                console.log(memberList);
                if(memberList.users.length !== 0) {
                  // Bring all members to class
                  await facilityClassUserService.createMembersForClass(
                    memberList
                  );
                }
                
                queryClient.setQueryData(
                  ["members", "active", classInfo.id],
                  (prev) => ({
                    ...prev,
                    data: [...Object.values(newMembers).flat(), ...prev.data],
                  })
                );
                console.log("Bring into class success");
                const allMembers = [
                  ...Object.values(createdUsers),
                  ...Object.values(newMembers),
                ].flat();
                queryClient.setQueryData(["members", "active", classInfo.id], prev => ({
                    ...prev,
                    ...allMembers
                }));

                console.log(deletedMembers);
                console.log(classInfo.id);
                if(deletedMembers.length != 0) {
                  await facilityClassUserService.deleteUsersInClass(
                    deletedMembers,
                    classInfo.id
                  );
                }
                deleteActiveClassMembers({
                  classId: classInfo.id,
                  memIds: deletedMembers,
                  queryClient: queryClient
                });

                deleteInactiveClassMembers({
                  classId: classInfo.id,
                  memIds: deletedMembers,
                  queryClient: queryClient,
                });
            
                console.log("Users need to update");
                console.log(usersToUpdate);
                if(usersToUpdate.length !== 0) {
                  await userService.updateUsers(usersToUpdate, classInfo.id);
                }
                
                console.log("Update multiple users success");
                if(classMembersChangeStatus.length !== 0) {
                    await facilityClassUserService.updateUsersInClass({
                        facilityClassId: classInfo.id,
                        users: classMembersChangeStatus
                    }, classInfo.id);
                }
                console.log("Update users in class success");
                
                // Return created users for updating user id on local state
                // Object returned by update call is unecessary => null
                return [null, createdUsers];
            }
            else {
                const createdClass = (await facilityClassService.create(
                  {
                    ...classInfo,
                    facilityId: facilityId
                  }
                )).data;

                queryClient.setQueryData(["facilities", 'management'], (prev) => ({
                  ...prev,
                  data: prev.data.map((fac) =>
                    fac.id === facilityId
                      ? {
                          ...fac,
                          classes: [createdClass, ...fac.classes],
                        }
                      : fac
                  ),
                }));
                console.log(
                  queryClient.getQueryData(["facilities", 'management'])
                );
                setSelectedFacility((prev) => ({
                  ...prev,
                  classes: [createdClass, ...prev.classes]
                }));

                const limit = pLimit(3);
                // Create new users
                // TODO : check which type is empty, only call when containing users
                const tasks = Object.entries(newUsers).map(([role, users]) =>
                  limit(async () => {
                    let result = [];
                    console.log(users);
                    if (users.length !== 0) {
                      result = (
                        await userService.createMemberForClass(
                          users.map((u) => ({
                            ...u,
                            facilityId: facilityId,
                            classId: createdClass.id,
                            password: "aaaaaaaa",
                          })),
                          createdClass.id
                        )
                      ).data;
                      result = result.map((user) => ({
                        ...user,
                        classId: classInfo.id,
                        roleInClass: role,
                      }));
                    }
                    // Return both the role and its corresponding result array
                    return { role, result };
                  })
                );
                console.log("Send request");
                const results = await Promise.all(tasks);
                console.log("Create User and bring them to class Success ");
                console.log(results);

                // Bring all results to an array
                const createdUsers = results.flatMap((item) => item.result);
                console.log("Map by type:");
                console.log(createdUsers);

                const newUsersWithRole = [];
                Object.keys(newMembers).forEach((key) => {
                  for (const u of newMembers[key]) {
                    newUsersWithRole.push({
                      userId: u.id,
                      roleInClass: key,
                      isActiveInClass: u.isActiveInClass,
                    });
                  }
                });

                const memberList = {
                  facilityClassId: createdClass.id,
                  users: [...newUsersWithRole],
                };

                console.log("Member list to bring into class:");
                console.log(memberList);
                if (memberList.users.length !== 0) {
                  // Bring all members to class
                  await facilityClassUserService.createMembersForClass(
                    memberList
                  );
                }

                if (usersToUpdate.length !== 0) {
                  await userService.updateUsers(usersToUpdate);
                }
                
                // Return created users for updating user id on local state
                return [createdClass, createdUsers];
            }
        }
        catch(error) {
          console.log(error);
            if(error?.response?.data) {
              if(Array.isArray(error.response.data.duplicateIds)) {
                const err = new Error(error.response.data.message);
                err.duplicatedUsers = error.response.data.duplicateIds;
                throw err;
              }
              throw new Error(error.response.data);
            }
            throw error;
        }
    }

    // Handle upload
    const handleUpload = async (image) => {
        try {
            console.log("signature start");
            const signatureResponse = await cloudinaryService.getSignature(
            {
                "folder": "hokinh/chi_nhanh"
            });
            console.log("signature passed");
            const formData = new FormData();

            formData.append("file", image);
            formData.append("api_key", signatureResponse.data.apiKey);
            formData.append("folder", signatureResponse.data.folder);
            formData.append("timestamp", signatureResponse.data.timestamp);
            formData.append("overwrite", signatureResponse.data.overwrite);
            formData.append("use_filename", signatureResponse.data.useFileName);
            formData.append("unique_filename", signatureResponse.data.uniqueFileName);
            formData.append("signature", signatureResponse.data.signature);

            const uploadResponse = await storageService.uploadImage(formData);
            console.log("cloudinary passed");
            return uploadResponse.data.secure_url;
        }
        catch(error) {
            console.log(error);
            if(error.response) {
                let message;
                if(error.response.data.error) {
                    // Error from cloudinary
                    message = error.response.data.error?.message;
                }
                else {
                    // Error from backend
                    message = error.response.data
                }
                throw new Error("Đã xảy ra lỗi khi upload hình ảnh lên cloud. Chi tiết lỗi: " + message);
            }
        }
    };

    const onSaveEdit = async ({facility, image}) => {
        try {
            let returnedData;
            // Update on backend
            if(image) {
                facility.image = await handleUpload(image);
            }
            if(facility.id) {
                returnedData = (await facilityService.update(facility.id, facility)).data;
                console.log(returnedData);
                // update on local state
                queryClient.setQueryData(['facilities', 'management'], oldData => {
                    if(!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((fac) => 
                            fac.id === facility.id ? 
                            {
                                ...fac,
                                ...returnedData
                            } : fac
                        ) 
                    }
                });
                
                
            }
            else {
                // Update on backend
                if(image) {
                  facility.image = await handleUpload(image);
                }
                returnedData = (await facilityService.create(facility)).data;
                // update on local state
                queryClient.setQueryData(['facilities', 'management'], oldData => {
                    if(!oldData) return oldData;

                    return {
                        ...oldData,
                        data: [
                            returnedData,
                            ...oldData.data
                        ]
                    }
                });
                return returnedData;
            }
        }
        catch(error) {
            if(error.response) {
                throw new Error("Đã xảy ra lỗi khi lưu cơ sở. Chi tiết lỗi: " + error.response.data);
            }
        }
    }

    const filteredFacilities = !facilities ? [] : facilities.data
    .filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.managerName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && f.isActive) ||
        (statusFilter === 'inactive' && !f.isActive);
        
        return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'managerName') return a.managerName.localeCompare(b.managerName);
        return 0;
    });

    return (
      <>
        {isLoadingFacilities ||
          (isLoadingManagerOptions && (
            <ThreeDotLoader message="Đang tải thông tin cơ sở. Vui lòng chờ" />
          ))}
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            {view === "list" ? (
              <>
                <Header
                  title={"Quản lý Cơ sở"}
                  description={"Quản lý thông tin các cơ sở"}
                  functionButton={
                    user.role === 0 && (
                      <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
                        onClick={() => setView("edit")}
                      >
                        <Plus className="w-5 h-5" />
                        Thêm cơ sở mới
                      </button>
                    )
                  }
                />

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-4 relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên cơ sở, địa chỉ, hoặc tên quản lý..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
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
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Tạm ngưng</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
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
                      <option value="name">Sắp xếp: Tên cơ sở</option>
                      <option value="managerName">Sắp xếp: Quản lý</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFacilities.map((facility) => (
                    <FacilityCard 
                      key={facility.id} 
                      facility={facility} 
                      setSelectedFacility={setSelectedFacility}
                      setView={setView}
                    />
                  ))}
                </div>

                {filteredFacilities.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Không tìm thấy cơ sở nào</p>
                  </div>
                )}
              </>
            ) : view === "detail" ? (
              <FacilityDetail 
                facility={selectedFacility} 
                setSelectedClass={setSelectedClass}
                setSelectedFacility={setSelectedFacility}
                setView={setView}
              />
            ) : view === "class" ? (
              <ClassDetailPage
                classDetail={selectedClass}
                facilityId={selectedFacility.id}
                onCancel={onCancelEdit}
                onSave={onSaveEditClass}
              />
            ) : (
              <EditFacility
                managerOptions={managerOptions.data}
                setFacility={setSelectedFacility}
                facility={selectedFacility}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
              />
            )}
          </div>
        </div>
      </>
    );
};

export default FacilityManagement;