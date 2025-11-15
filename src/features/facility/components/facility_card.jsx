import { Plus, Undo ,Trash2, Edit2, Save, Clock, Calendar } from 'lucide-react';
import { useRef, useState } from 'react';
import { storageService } from '../../../services/upload_image_api';
import { facilityService } from '../../../services/facility_api';
import { facilityClassService } from '../../../services/facility_class_api';
import { ThreeDotLoader } from '../../../components/ActionFallback';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import AnnouncementUI from "../../../components/Announcement";
import { ValidatedMessage } from '../../../components/validateMessage';
import { cloudinaryService } from '../../../services/upload_api';

export function BranchCard({
                                branches,
                                branch,
                                allBranches,
                                editingBranch,
                                setBranches,
                                setEditingBranch
                                }) {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [branchInfo, setBranchInfo] = useState(branch);
    const [newClasses, setNewClasses] = useState([]);
    const [showError, setShowError] = useState(false);
    const errorMessage = useRef("");
    // console.log(branchInfo);

    // File input reference
    const fileInputRef = useRef(null);
    // Previous state before updating (used for undo action)
    const originalState = useRef(branch);

    const UPLOAD_PRESET = "hokinh_image"; // from Cloudinary

    // Undo update
    const undoUpdate = () => {
        setBranchInfo(originalState.current);
        clearFile();
        setEditingBranch(null);
        setNewClasses([]);
    }

    // Clear selected file input
    const clearFile = () => {
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setPreview(null);
        setImage(null);
    }
    
    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // local preview
        }
    };

    // Handle upload
    const handleUpload = async () => {
        try {
            const signatureResponse = await cloudinaryService.getSignature(
            {
                "folder": "hokinh/chi_nhanh"
            });
            console.log(signatureResponse);
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
            console.log(uploadResponse);
            return uploadResponse.data.secure_url;
        }
        catch(error) {
            if(error.response) {
                console.log(error.response.data);
                setShowError(true);
                errorMessage.current = "Đã xảy ra lỗi khi upload hình ảnh lên cloud. Chi tiết: " + error.response.data;
            }
        }

    };

    const handleSaveClick = () => {
        if(branchInfo.name === '' || !(/^\d{10}$/.test(branchInfo.phoneNumber))) {
            return;
        }
        // Show dialog to confirm saving action
        setShowDialog(true);
    };

    const handleConfirmUpdate = async () => {
        // Your update logic here
        setShowDialog(false);
        setSaving(true);

        // Edit image case
        if(image) {
            // Upload image before store url in database
            branchInfo.image = await handleUpload();
        }

        let updatedClasses = [];
        // Update branch's information
        try {
            const facilityResponse = await facilityService.update(branchInfo.id, branchInfo);
            const classesResponse = await facilityClassService.updateClasses(branchInfo.classes);
            // Update on local state
            allBranches.current = allBranches.current.map((branch) => branch.id === branchInfo.id ? branchInfo : branch);
        }
        catch(error) {
            if(error.response) {
                setShowError(true);
                setSaving(false);
                errorMessage.current = error.response.data;
            }
            console.log(error);
        }

        originalState.current = {
            ...branchInfo
        };
        setSaving(false);

        // Clear file image input
        clearFile();

        // Close dialog and escape editing mode
        setShowDialog(false);
        setEditingBranch(null);
        
        // Update UI based on response from Backend
        setBranchInfo(originalState.current)
        setNewClasses([]);
    };

    const handleCancelUpdate = () => {
        setShowDialog(false);
    };

    const updateBranch = (field, value) => {
        setBranchInfo(prev => ({
            ...prev,
            [field]: value
        }));
        
    };


    const addClass = () => {
        const newClass = {
            id: Date.now(),
            className: '',
            days: "",
            startHour: '06:00',
            endHour: '07:30'
        };
        
        setNewClasses([ newClass, ...newClasses]);
    };

    const removeClass = (branchId, classId) => {
        setBranches(branches.map(b => 
        b.id === branchId ? { ...b, classes: b.classes.filter(c => c.id !== classId) } : b
        ));
    };


    return (
        <>
            {showError && 
            <AnnouncementUI setVisible= {setShowError} 
                            message= {errorMessage.current} 
            />
            }
            <div id={branchInfo.id} key={branchInfo.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        {editingBranch === branchInfo.id ? (
                        <input
                            type="text"
                            value={branchInfo.name}
                            onChange={(e) => updateBranch('name', e.target.value)}
                            className="text-2xl font-bold text-gray-800 border-b-2 border-red-600 focus:outline-none w-full bg-transparent pb-2"
                        />
                        ) : (
                        <h4 className="text-2xl font-bold bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">{branchInfo.name}</h4>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {editingBranch === branchInfo.id && (
                            <button
                            onClick={() => undoUpdate(branchInfo.id)}
                            className="p-2.5 text-yellow-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                            >
                            <Undo size={20} />
                            </button>
                        )}
                        <button
                        onClick={() => editingBranch === branchInfo.id ? handleSaveClick() : setEditingBranch(branchInfo.id)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                        >
                        {editingBranch === branchInfo.id ? <Save size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>
                </div>
                {branchInfo.name === '' && 
                    <ValidatedMessage message="Tên chi nhánh không được để trống"/>
                }

                <div className="mt-3 grid md:grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                    <input
                    type="text"
                    value={branchInfo.address}
                    onChange={(e) => updateBranch('address', e.target.value)}
                    disabled={editingBranch !== branchInfo.id}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                    <input
                    type="text"
                    value={branchInfo.phoneNumber}
                    onChange={(e) => updateBranch('phoneNumber', e.target.value)}
                    disabled={editingBranch !== branchInfo.id}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                    {!(/^\d{10}$/.test(branchInfo.phoneNumber)) && 
                        <ValidatedMessage message="Số điện thoại phải đủ 10 số"/>
                    }
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Link Google Maps</label>
                    <input
                    type="text"
                    value={branchInfo.mapsLink}
                    onChange={(e) => updateBranch('mapsLink', e.target.value)}
                    disabled={editingBranch !== branchInfo.id}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                </div>


                <div className="block text-sm font-semibold text-gray-700 mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={editingBranch !== branchInfo.id}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />

                    {preview && branchInfo.id === editingBranch && (
                        <div className='mt-3'>
                            <div className='relative inline-block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow'>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover"
                                />
                                
                                {/* Bottom bar with delete button */}
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 flex justify-end">
                                    <button
                                        onClick={() => clearFile()}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1.5 text-sm font-medium"
                                    >
                                        <Trash2 size={16} />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    </div>
                </div>

                {branch.image && (
                <div className="mb-5">
                    <img src={branch.image} alt={branch.name} className="w-full h-56 object-cover rounded-xl shadow-md" />
                </div>
                )}

                <div className="border-t border-gray-200 pt-5">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={20} className="text-red-600" />
                    Lớp học
                    </h5>
                </div>

                {branchInfo.classes.length + newClasses.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-xl text-center border-2 border-dashed border-gray-300">
                    <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">Chưa có lớp học nào. Nhấn "Thêm lớp" để bắt đầu.</p>
                    </div>
                ) : (
                    <ClassSection 
                                branchInfo={branchInfo} 
                                setBranchInfo={setBranchInfo} 
                                editingBranch={editingBranch} 
                                newClasses={newClasses}
                                setNewClasses = {setNewClasses}
                    />
                )}
                </div>
                {/* Confirmation Dialog */}
                {showDialog && (
                    <ConfirmDialog 
                        title={"Xác nhận cập nhật"} 
                        askDetail={"Bạn có muốn lưu thông tin cơ sở ?"} 
                        options={["Không", "Có"]} 
                        handleCancel={handleCancelUpdate} 
                        handleConfirm={handleConfirmUpdate}
                    />
                )}

                {saving && (
                    <ThreeDotLoader size="md" color="gray" message='Đang cập nhật thông tin cơ sở' />
                )}
            </div>
        </>
    );
}

function ClassSection({
    branchInfo, 
    setBranchInfo, 
    editingBranch, 
    newClasses, 
    setNewClasses}) {

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    const convertDayToNumber = (day) => {
        if(day === "Thứ 2") {
            return "2";
        }
        if(day === "Thứ 3") {
            return "3";
        }
        if(day === "Thứ 4") {
            return "4";
        }
        if(day === "Thứ 5") {
            return "5";
        }
        if(day === "Thứ 6") {
            return "6";
        }
        if(day === "Thứ 7") {
            return "7";
        }
        if(day === "CN") {
            return "8";
        }
    };

    const updateClass = (classId, field, value) => {
        setBranchInfo(prev => ({
            ...prev,
            classes: prev.classes.map(c => 
            c.id === classId ? { ...c, [field]: value } : c
            )
        }));
    };

    const updateNewClass = (classId, field, value) => {
        setNewClasses(
            newClasses.map(c =>
            c.id === classId ? {...c, [field]: value} : c
            )
        );
    };

    const toggleDay = (classId, day) => {
        setBranchInfo(prev => ({
            ...prev,
            classes: prev.classes.map(c => 
            c.id === classId ? {
                ...c,
                daysOfWeek: c.daysOfWeek.split("-").includes(day) 
                ? c.daysOfWeek.split("-").filter(d => d !== day).sort().join("-")
                : (c.daysOfWeek.length === 0) ? day : (c.daysOfWeek + "-" + day).split("-").sort().join("-")
            } : c
            )
        }
        ));
    };

    const toggleDayNewClasses = (classId, day) => {
        const newClassesData = newClasses;
        let index = 0;
        
        for(let i = 0; i < newClassesData.length; i++) {
            if(newClassesData[i].id === classId) {
                newClassesData[i].daysOfWeek = newClassesData[i].daysOfWeek.split("-").includes(day) 
                ? newClassesData[i].daysOfWeek.split("-").filter(d => d !== day).sort().join("-")
                : (newClassesData[i].daysOfWeek.length === 0) 
                ? day : (newClassesData[i].daysOfWeek + "-" + day).split("-").sort().join("-");

                index = i;
                break;
            }
        }
        
        // console.log(newClassesData);
        setNewClasses(newClassesData);
        updateNewClass(classId, "className", newClassesData[index].daysOfWeek);
    };

    const removeClass = (branchId, classId) => {
        setBranches(branches.map(b => 
        b.id === branchId ? { ...b, classes: b.classes.filter(c => c.id !== classId) } : b
        ));
    };

    return (
        <div className="space-y-4">
            {/* Show class cards that is already stored in database */}
            {branchInfo.classes.map(cls => (
                <div key={cls.id} className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tên lớp</label>
                    <input
                        type="text"
                        value={cls.name}
                        onChange={(e) => updateClass(cls.id, 'name', e.target.value)}
                        placeholder={"Tên gợi ý: " + cls.daysOfWeek}
                        disabled= {editingBranch !== branchInfo.id}
                        className="placeholder:text-gray-400 placeholder:italic w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Ngày học</label>
                    <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                        <button
                        key={day}
                        disabled= {editingBranch !== branchInfo.id}
                        onClick={() => toggleDay(cls.id, convertDayToNumber(day))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            cls.daysOfWeek.split('-').includes(convertDayToNumber(day))
                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        >
                        {day}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-green-600" />
                        Giờ bắt đầu
                    </label>
                    <input
                        type="time"
                        value={cls.startHour}
                        onChange={(e) => updateClass(cls.id, 'startHour', e.target.value)}
                        disabled= {editingBranch !== branchInfo.id}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none"
                    />
                    </div>
                    <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-red-600" />
                        Giờ kết thúc
                    </label>
                    <input
                        type="time"
                        value={cls.endHour}
                        onChange={(e) => updateClass(cls.id, 'endHour', e.target.value)}
                        disabled= {editingBranch !== branchInfo.id}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none"
                    />
                    </div>
                </div>

                {!cls.className && cls.daysOfWeek.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                        <span className="font-semibold">Tên hiển thị:</span> {cls.daysOfWeek}
                    </p>
                    </div>
                )}
                </div>
            ))}
            </div>
    );
}