import { useState, useRef } from 'react';
import { Trash2, Edit2, Save, Award, Trophy } from 'lucide-react';
import { storageService } from '../../../services/upload_image_api';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ThreeDotLoader } from '../../../components/ActionFallback';
import { awardService } from '../../../services/award_api';
import AnnouncementUI from '../../../components/Announcement';
import { cloudinaryService } from '../../../services/upload_api';

export function AwardCard({award, editingAward, setEditingAward, setAwards}) {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [awardInfo, setAwardInfo] = useState(award);
    const [showError, setShowError] = useState(false);
    const errorMessage = useRef("");

    // File input reference
    const fileInputRef = useRef(null);
    // Previous state before updating (used for undo action)
    const originalState = useRef(award);

    const UPLOAD_PRESET = "hokinh_image"; // from Cloudinary

    const updateAward = (field, value) => {
        setAwardInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const removeAward = async (awardId) => {
        try {
            await awardService.patch(awardId, {isDeleted: true});
        }
        catch(error) {
            if(error.response) {
                errorMessage.current = error.response.data;
                setShowError(errorMessage.current);
            }
        }
        setAwards(prev => prev.filter(award => award.id !== awardId));
    }

    // Undo update
    const undoUpdate = () => {
        setEditingAward(null);
        setAwardInfo(originalState.current);
    }

    const handleCancelUpdate = () => {
        setShowDialog(false);
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
                    "folder" : "hokinh/giai_thuong",
                    "public_id": image.name.split('.').slice(0, -1).join('.')
                }
            );
            
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

            const data = uploadResponse.data;
            awardInfo.image = data.secure_url; // final hosted image URL
            
        } catch (error) {
            if(error.response) {
                console.log(error);
                if(error.response.data.error.message) {
                    errorMessage.current = error.response.data.error.message;
                }
                else {
                    errorMessage.current = error.response.data;
                }
                setShowError(true);
            }
            setSaving(false);
        }
    };

    const handleConfirmUpdate = async () => {
        // Your update logic here
        setShowDialog(false);
        setSaving(true);

        // Edit image case
        if(image) {
            // Upload image before store url in database
            await handleUpload();
        }

        try {
            // Update Award's information
            const updatedAward = (await awardService.update(awardInfo.id, awardInfo)).data;
            originalState.current = updatedAward;
            setSaving(false);

            // Clear file image input
            clearFile();

            // Close dialog and escape editing mode
            setShowDialog(false);
            setEditingAward(null);
            setAwards(prev => prev.map(award => award.id === updatedAward.id ? updatedAward : award));
            // Update UI based on response from Backend
            // setAwardInfo(updatedAward)
        }
        catch(error) {
            if(error.response) {
                errorMessage.current = error.response.data;
                setSaving(false);
                setShowError(true);
            }
        }
    };

    const handleSaveClick = () => {
        setShowDialog(true);
    }


    return (
        <>
            {showError && 
            <AnnouncementUI setVisible= {setShowError} 
                            message= {errorMessage.current} 
            />
            }
            {showDialog && (
                <ConfirmDialog
                    title={"Xác nhận cập nhật"} 
                    askDetail={"Bạn có muốn lưu thông tin giải thưởng ?"} 
                    options={["Không", "Có"]} 
                    handleCancel={handleCancelUpdate} 
                    handleConfirm={handleConfirmUpdate}
                />
            )}
            {saving && (
                <ThreeDotLoader size="md" color="gray" message='Đang cập nhật thông tin giải thưởng' />
            )}
            <div key={awardInfo.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Trophy size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                    {editingAward === awardInfo.id ? (
                        <input
                        type="text"
                        value={awardInfo.name}
                        onChange={(e) => updateAward('name', e.target.value)}
                        className="text-lg font-bold text-gray-800 border-b-2 border-yellow-600 focus:outline-none w-full bg-transparent"
                        placeholder="Tên giải thưởng"
                        />
                    ) : (
                        <h4 className="text-lg font-bold text-gray-800">{awardInfo.name || 'Tên giải thưởng'}</h4>
                    )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={() => editingAward === awardInfo.id ? handleSaveClick() : setEditingAward(awardInfo.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                    >
                    {editingAward === awardInfo.id ? <Save size={18} /> : <Edit2 size={18} />}
                    </button>
                    <button
                    onClick={() => removeAward(awardInfo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
                </div>

                {awardInfo.image && (
                <div className="mb-4">
                    <img src={awardInfo.image} alt={awardInfo.name} className="w-full h-40 object-cover rounded-xl shadow-md" />
                </div>
                )}

                <div className="space-y-3 mb-3">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hạng</label>
                    <input
                    type="text"
                    value={awardInfo.rank}
                    onChange={(e) => updateAward('rank', e.target.value)}
                    disabled={editingAward !== awardInfo.id}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="VD: Vàng, Bạc, Đồng, Nhất, Nhì..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                    <textarea
                    value={awardInfo.description}
                    onChange={(e) => updateAward('description', e.target.value)}
                    disabled={editingAward !== awardInfo.id}
                    rows="2"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                    placeholder="Mô tả chi tiết về giải thưởng"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Năm</label>
                    <input
                        type="number"
                        value={awardInfo.year}
                        onChange={(e) => updateAward('year', parseInt(e.target.value))}
                        disabled={editingAward !== awardInfo.id}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link hình ảnh</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={editingAward !== awardInfo.id}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />

                    {preview && awardInfo.id === editingAward && (
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
                </div>

                {awardInfo.rank && (
                <div className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-yellow-100 to-yellow-200 px-3 py-1.5 rounded-full">
                    <Award size={16} className="text-yellow-700" />
                    <span className="text-sm font-semibold text-yellow-800">{awardInfo.rank}</span>
                </div>
                )}

            </div>
        </>
    );
}