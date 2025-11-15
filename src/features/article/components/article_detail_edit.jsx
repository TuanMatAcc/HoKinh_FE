import { useState, useRef } from "react";
import { articleService } from "../../../services/article_api";
import { articleCategoryService } from "../../../services/article_category";
import { 
  Plus, Trash2, Save, X, FileText, User, Folder, ImagePlus, Image
} from 'lucide-react';
import { TiptapEditor } from "../../../components/TiptapEditor"; 
import { goToNext, goToPrev } from "../../../utils/paginationUtils";
import { ImageFileCard } from "../../../components/image_file_card";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { ThreeDotLoader } from "../../../components/ActionFallback";
import AnnouncementUI from "../../../components/Announcement";
import { ValidatedMessage } from "../../../components/validateMessage";
import { cloudinaryService } from "../../../services/upload_api";
import { useQueryClient } from "@tanstack/react-query";
import { storageService } from "../../../services/upload_image_api";
import pLimit from "p-limit";

export function ArticleEditView({editingArticle, categories, handleCancelUpdate}) {
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    const [articleInfo, setArticleInfo] = useState(!editingArticle ? {
        id: null,
        title: '',
        content: "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Viết gì đó ở đây...\"}]}]}",
        coverImage: '',
        category: {},
        author: '',
        date: null,
        gallery: [],
        type: "",
        isDeleted: false,
        deletedAt: null
    } : editingArticle);
    const [showDialog, setShowDialog] = useState(false);
    const [categorySaving, setCategorySaving] = useState(false);
    const [newCategory, setNewCategory] = useState({
        id: null,
        categoryName: ""
    });

    const [showError, setShowError] = useState(false);
    const errorMessage = useRef("");

    const coverImageFileInputRef = useRef(null);
    const galleryFileInputRef = useRef(null);

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState();
    const [coverImage, setCoverImage] = useState();

    // State for old gallery
    const itemsPerPage = 5;
    // const 
    const [oldGalleryCurrentPage, setOldGalleryCurrentPage] = useState(0);
    const oldGalleryTotalPages = Math.ceil(articleInfo.gallery.length / itemsPerPage);
    const oldGalleryStartIndex = oldGalleryCurrentPage * itemsPerPage;
    const currentOldGallery = articleInfo.gallery.slice(oldGalleryStartIndex, oldGalleryStartIndex + itemsPerPage);

    // State for deleted old gallery
    const [deletedGallery, setDeletedGallery] = useState([]);
    const [deletedGalleryCurrentPage, setDeletedGalleryCurrentPage] = useState(0);
    const deletedGalleryTotalPages = Math.ceil(deletedGallery.length / itemsPerPage);
    const deletedGalleryStartIndex = deletedGalleryCurrentPage * itemsPerPage;
    const currentDeletedGallery = deletedGallery.slice(deletedGalleryStartIndex, deletedGalleryStartIndex + itemsPerPage);

    // State for new gallery
    const [newGalleryPreview, setNewGalleryPreview] = useState([]);
    const [newGallery, setNewGallery] = useState([]);
    const [newGalleryCurrentPage, setNewGalleryCurrentPage] = useState(0);
    const newGalleryTotalPages = Math.ceil(newGalleryPreview.length / itemsPerPage);
    const newGalleryStartIndex = newGalleryCurrentPage * itemsPerPage;
    const currentNewGallery = newGalleryPreview.slice(newGalleryStartIndex, newGalleryStartIndex+itemsPerPage);
    
    const [content, setContent] = useState(JSON.parse(articleInfo.content));

    const handleFieldChange = (field, value) => {
        setArticleInfo(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const changeCategory = (categoryId) => {
        const selectedCategory = categories.find(category => category.id === Number(categoryId));

        setArticleInfo(prev => ({
            ...prev,
            category: selectedCategory || ""
        }));
    };


    // Clear selected file input
    const clearCoverImageFile = () => {
        if(coverImageFileInputRef.current) {
            coverImageFileInputRef.current.value = '';
        }
        setCoverImagePreview(null);
        setCoverImage(null);
    }
    
    // Handle file selection
    const handleCoverImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file)); // local preview
        }
    };

    // Clear selected file input
    const clearGalleryFiles = () => {
        if(galleryFileInputRef.current) {
            galleryFileInputRef.current.value = '';
        }
        setNewGalleryPreview([]);
        setNewGallery([]);
    }

    // Remove an image out of gallery
    const removeGalleryFile = ({indexToRemove, currentGallery, currentPage, totalPages}) => {
        // Handle case: the last page left no items => set current page to previous page
        if(currentPage === totalPages - 1 && currentGallery.length === 1 && currentPage > 0) {
            setNewGalleryCurrentPage(currentPage - 1);
        }
        // Handle case: there is not any images => clear gallery file to empty
        if(currentPage === 0 && currentGallery.length === 1) {
            clearGalleryFiles();
            return;
        } 
        setNewGalleryPreview(prevPreviews => {
            // revoke the blob URL before removing it
            const urlToRevoke = prevPreviews[indexToRemove];
            if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);

            // return new preview list without the removed one
            return prevPreviews.filter((_, index) => index !== indexToRemove);
        });

        setNewGallery(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    // Remove an image out of old gallery
    const removeGalleryImage = ({indexToRemove, 
                                currentGallery, 
                                currentPage, 
                                totalPages}) => {
        // Handle case: the last page left no items => set current page to previous page
        if(currentPage === totalPages - 1 && currentGallery.length === 1 && currentPage > 0) {
            setOldGalleryCurrentPage(currentPage - 1);
        }
       
        let nextOldGallery = [];
        let deletedValue = '';
        for(let index = 0; index < articleInfo.gallery.length; index++) {
            if(index !== indexToRemove) {
                nextOldGallery.push(articleInfo.gallery[index]);
                continue;
            }
            deletedValue = articleInfo.gallery[index];
        }
        setArticleInfo(prev => ({
            ...prev,
            gallery: nextOldGallery
        }))
        setDeletedGallery(prev => [deletedValue, ...prev])
    };

    const restoreOldGallery = (indexToRestore) => {
        let nextDeletedGallery = [];
        let restoreValue = '';
        for(let index = 0; index < deletedGallery.length; index++) {
            if(index !== indexToRestore) {
                nextDeletedGallery.push(deletedGallery[index]);
                continue;
            }
            restoreValue = deletedGallery[index];
        }
        setDeletedGallery(nextDeletedGallery);
        setArticleInfo(prev => ({
            ...prev,
            gallery: [restoreValue, ...prev.gallery]
        }))
    }
    
    // Handle file selection
    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files) {
            setNewGallery(prev => ([...prev, ...files]));
            setNewGalleryPreview(prev => ([...prev, ...files.map(file => URL.createObjectURL(file))])); // local preview
        }
    };

    // Handle upload

    const handleUpload = async (image, signatureResponse) => {
        
        try {
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
            return data.secure_url; // final hosted image URL
            
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleDeleteUploadedImage = async (image) => {

        try {
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
            return data.secure_url; // final hosted image URL
            
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // Handle remove old gallery image
    const handleRemoveOldImageFromGallery = (imageLink) => {
        setDeletedGallery(prev => ([
            imageLink, ...prev
        ]));
        setArticleInfo(prev => ({
            ...prev,
            gallery: prev.gallery.filter((link) => link !== imageLink)
        }))
    }

    // Handle restore old gallery image
    const handleRestoreImageFromDeletedGallery = (imageLink) => {
        setDeletedGallery(prev => (
            prev.gallery.filter((link) => link !== imageLink)
        ));
        setArticleInfo(prev => ({
            ...prev,
            gallery: [imageLink, ...prev.gallery]
        }))
    }

    const handleDeleteImage = () => {
        
    }

    const handleDeleteImages = async (publicIds) => {
        try {
            const res = await cloudinaryService.deleteImages(publicIds);
        }
        catch(error) {
            if(error.response) {
                setShowError(true);
                errorMessage.current = "Đã xảy ra lỗi khi xóa hình. Chi tiết: " + error.response.data;
            }
        }
    }

    const handleSave = () => {
        setShowDialog(true);
    }

    const handleCancel = () => {
        setShowDialog(false);
    }

    const handleConfirm = async () => {
        setShowDialog(false);
        setSaving(true);

        const articleData = {
            ...articleInfo,
            content: JSON.stringify(content)
        };
        console.log("update");
        console.log(articleData);
        const limit = pLimit(10);

        let returnedData = null;
        if(editingArticle) {
            try {
                // Save new cover image
                if(coverImage) {
                    const signatureCoverImageResponse = await cloudinaryService.getSignature(
                        {
                            "folder" : "hokinh/tin_tuc/" + articleInfo.id + "/" + "anh_bia"
                        }
                    );
                    articleData.coverImage = await handleUpload(coverImage, signatureCoverImageResponse);
                }

                if(deletedGallery.length > 0) {
                    await handleDeleteImages(deletedGallery.map((url) => 
                        "hokinh/tin_tuc/" + articleInfo.id + "/" + "bo_suu_tap/" + url.split('/').at(-1).split('.')[0])
                    );
                    // articleData.ga
                }
                
                if(newGallery.length > 0) {
                    const signatureGalleryResponse = await cloudinaryService.getSignature(
                        {
                            "folder" : "hokinh/tin_tuc/" + articleInfo.id + "/" + "bo_suu_tap"
                        }
                    );

                    const uploadTasks = newGallery.map((galleryImage) => 
                        limit(() => handleUpload(galleryImage, signatureGalleryResponse))
                    );

                    const uploadedImages = await Promise.all(uploadTasks);
                    console.log('upload:');
                    console.log(uploadedImages);
                    articleData.gallery.push(...uploadedImages);
                    clearCoverImageFile();
                    clearGalleryFiles();
                }

                // Delete old gallery images
                // **TODO**

                returnedData = (await articleService.update(articleData.id, articleData)).data;
                console.log("updated1");
                console.log(returnedData);
                
                // If changing category, remove the article out of cached old category data
                if (editingArticle.category.id !== returnedData.category.id) {
                    const oldCategoryKey = ['articles_management', editingArticle.category.id];
                    const newCategoryKey = ['articles_management', returnedData.category.id];

                    // Safely remove from old category cache (if it exists)
                    const oldCategoryCache = queryClient.getQueryData(oldCategoryKey);
                    if(oldCategoryCache) {
                        queryClient.setQueryData(oldCategoryKey, oldData => {
                            if (!oldData) return oldData;
                            return {
                                ...oldData,
                                data: oldData.data.filter(a => a.id !== returnedData.id),
                            };
                        });
                    }


                    // If new category already cached, add to it
                    const newCategoryCache = queryClient.getQueryData(newCategoryKey);

                    if (newCategoryCache) {
                        queryClient.setQueryData(newCategoryKey,  oldData => {
                            if(!oldData) return oldData;
                            return {
                                ...oldData,
                                data: [returnedData, ...oldData.data]
                            }
                        });
                    }
                }
                else {
                    const oldCategoryKey = ['articles_management', editingArticle.category.id];

                    // change cached local state by returned updated data
                    const oldCategoryCache = queryClient.getQueryData(oldCategoryKey);
                    if(oldCategoryCache) {
                        queryClient.setQueryData(oldCategoryKey, oldData => {
                            if (!oldData) return oldData;
                            return {
                                ...oldData,
                                data: oldData.data.map((a) => a.id === returnedData.id ? returnedData : a),
                            };
                        });
                    }
                }

                handleCancelUpdate();
            }
            catch(error) {
                console.log(error);
            }
        }
        else {
            try {
                returnedData = (await articleService.create(articleData)).data;

                // Save new cover image
                if(coverImage) {
                    const signatureCoverImageResponse = await cloudinaryService.getSignature(
                        {
                            "folder" : "hokinh/tin_tuc/" + returnedData.id + "/" + "anh_bia"
                        }
                    );
                    articleData.coverImage = await handleUpload(coverImage, signatureCoverImageResponse);
                }

                if (newGallery.length > 0) {
                  const signatureGalleryResponse =
                    await cloudinaryService.getSignature({
                      folder:
                        "hokinh/tin_tuc/" + returnedData.id + "/" + "bo_suu_tap",
                    });

                  const uploadTasks = newGallery.map((galleryImage) =>
                    limit(() =>
                      handleUpload(galleryImage, signatureGalleryResponse)
                    )
                  );

                  const uploadedImages = await Promise.all(uploadTasks);
                  console.log("upload:");
                  console.log(uploadedImages);
                  articleData.gallery.push(...uploadedImages);
                  clearCoverImageFile();
                  clearGalleryFiles();
                }

                returnedData = (await articleService.update(returnedData.id, articleData)).data;
                
                const newCategoryKey = ['articles_management', returnedData.category.id];

                // If new category already cached, add to it
                const newCategoryCache = queryClient.getQueryData(newCategoryKey);

                if (newCategoryCache) {
                    queryClient.setQueryData(newCategoryKey,  oldData => {
                        if(!oldData) return oldData;
                        return {
                            ...oldData,
                            data: [returnedData, ...oldData.data]
                        }
                    });
                }

                handleCancelUpdate();
            }
            catch(error) {
                console.log(error);
            }
        }
    }

    const handleAddCategory = async () => {
        setCategorySaving(true);
        const returnedCategory = (await articleCategoryService.create(newCategory)).data 
        setCategorySaving(false);
        closeAddCategory();
        queryClient.setQueryData(['article_categories_management'], oldData => {
            if(!oldData) return oldData;
            return {
                ...oldData,
                data: [...oldData.data, returnedCategory]
            }
        });
    }

    const closeAddCategory = () => {
        setShowAddCategory(false);
        setNewCategory({
            id: null,
            categoryName: ""
        });
    }

    const handleNewCategoryFieldChange = (field, value) => {
        setNewCategory(prev => ({
            ...prev,
            [field] : value
        }))
    }

    return (
        <>
        {showError && 
            <AnnouncementUI setVisible= {setShowError} 
                            message= {errorMessage.current} 
            />
        }
        {/* Confirmation Dialog */}
        {showDialog && (
            <ConfirmDialog 
                title={editingArticle ? "Xác nhận cập nhật" : "Xác nhận tạo bài viết"} 
                askDetail={"Bạn có muốn lưu thông tin bài viết?"} 
                options={["Không", "Có"]} 
                handleCancel={handleCancel} 
                handleConfirm={handleConfirm}
            />
        )}
        {/* Show Fallback UI */}
        {saving && (
            <ThreeDotLoader size="md" color="gray" message= {editingArticle ? 'Đang cập nhật bài viết' : 'Đang tiến hành tạo bài viết'} />
        )}
        {/* Show Fallback UI For Creating Category*/}
        {categorySaving && (
            <ThreeDotLoader size="md" color="gray" message='Đang tạo danh mục mới' />
        )}
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex justify-between items-center">
                    <div>
                    <h1 className="text-3xl font-bold mb-1">
                        {editingArticle ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    </h1>
                    <p className="text-blue-100">
                        {editingArticle ? 'Cập nhật bài viết của bạn' : 'Sáng tạo bài viết mới'}
                    </p>
                    </div>
                    <div className="flex gap-3">
                    <button
                        onClick={handleCancelUpdate}
                        className="flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        <X size={18} />
                        Thoát
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                        <Save size={18} />
                        {editingArticle ? 'Cập nhật' : 'Đăng'}
                    </button>
                    </div>
                </div>
                </div>
    
                {/* Form */}
                <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề *
                    </label>
                    <input
                    type="text"
                    value={articleInfo.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                    />
                </div>
                {articleInfo.title === '' && 
                    <ValidatedMessage message={"Tiêu đề không được để trống"}/>
                }

                {/* Type of article */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại *
                    </label>
                    <div className="flex">
                        <label className="flex-1">
                            <input
                            type="radio"
                            name="type"
                            value={"event"}
                            checked= {articleInfo.type === "event"}
                            onChange={(e) => handleFieldChange("type", e.target.value)}
                            />
                            Sự kiện
                        </label>
                        <label className="flex-1">
                            <input
                            type="radio"
                            name="type"
                            value={"article"}
                            checked= {articleInfo.type === "article"}
                            onChange={(e) => handleFieldChange("type", e.target.value)}
                            />
                            Tin tức
                        </label>
                    </div>
                </div>
                {(articleInfo.type === '' 
                    || articleInfo.type === null 
                    || articleInfo.type === undefined) && 
                    <ValidatedMessage message={"Loại không được để trống"}/>
                }
    
                {/* Row 1: Category and Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Folder className="inline mr-1" size={16} />
                    Danh mục *
                    </label>
                    <div className="flex gap-2">
                    <select
                        onChange={(e) => changeCategory(e.target.value)}
                        defaultValue={editingArticle ? articleInfo.category.id : ""}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
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
                        <option disabled value="">Chọn danh mục</option>
                        {categories.map((cat, index) => (
                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Add new category"
                    >
                        <Plus size={20} />
                    </button>
                    </div>
                    
                    {showAddCategory && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên danh mục mới
                        </label>
                        <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory.categoryName}
                            onChange={(e) => handleNewCategoryFieldChange("categoryName", e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            placeholder="Nhập tên danh mục..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Thêm
                        </button>
                        {/* Close edit view of category */}
                        <button
                            type="button"
                            onClick={() => {
                            setShowAddCategory(false);
                            setNewCategory({
                                id: null,
                                categoryName: ""
                            });
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Hủy
                        </button>
                        </div>
                    </div>
                    )}
                    {categories.length === 0 && 
                        <ValidatedMessage message={"Chưa có danh mục nào hãy tạo một danh mục mới"}/>
                    }
                </div>
                
    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline mr-1" size={16} />
                        Tác giả *
                    </label>
                    <input
                        type="text"
                        value={articleInfo.author}
                        onChange={(e) => handleFieldChange("author", e.target.value)}
                        placeholder="Enter author name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {(articleInfo.author === '' ||
                      articleInfo.author === null ||
                      articleInfo.author === undefined) && 
                        <ValidatedMessage message={"Tên tác giả không được để trống"}/>
                    }
                    </div>
                    
                </div>
    
                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Image className="inline mr-1" size={16} />
                    Ảnh bìa
                    </label>
                    <input
                    ref={coverImageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageFileChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                    {coverImagePreview && (
                        <div className='mt-3'>
                            <div className='relative inline-block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow'>
                                <img
                                    src={coverImagePreview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover"
                                />
                                
                                {/* Bottom bar with delete button */}
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 flex justify-end">
                                    <button
                                        onClick={() => clearCoverImageFile()}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1.5 text-sm font-medium"
                                    >
                                        <Trash2 size={16} />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    )}
                    {articleInfo.coverImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                        src={articleInfo.coverImage} 
                        alt="Cover preview" 
                        className="w-full h-48 object-cover"
                        />
                    </div>
                    )}
                </div>
    
                {/* Gallery */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImagePlus className="inline mr-1" size={16} />
                    Các hình ảnh đính kèm bài viết
                    </label>
                    <input
                    ref={galleryFileInputRef}
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFilesChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                    />
                    <div className="relative">
                        {newGalleryTotalPages > 1 && newGalleryCurrentPage > 0 && (
                            <button
                            onClick={() => goToPrev({
                                currentPage: newGalleryCurrentPage,
                                setCurrentPage: setNewGalleryCurrentPage
                            })}
                            className="lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            </button>
                        )}

                        <div className="flex gap-2">
                            {currentNewGallery.map((newGal, index) => (
                                <ImageFileCard key={index} imagePath={newGal} typeAction={'delete'} handleAction={() => removeGalleryFile({
                                    indexToRemove: newGalleryStartIndex + index,
                                    currentGallery: currentNewGallery,
                                    currentPage: newGalleryCurrentPage,
                                    totalPages: newGalleryTotalPages
                                })}/>
                            ))}
                        </div>

                        {newGalleryTotalPages > 1 && newGalleryCurrentPage < newGalleryTotalPages - 1 &&(
                            <button
                            onClick={() => goToNext({
                                currentPage: newGalleryCurrentPage,
                                setCurrentPage: setNewGalleryCurrentPage,
                                totalPages: newGalleryTotalPages
                            })}
                            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                            </button>
                        )}
                    </div>
                </div>

                {editingArticle && (<>
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImagePlus className="inline mr-1" size={16} />
                    Các hình ảnh đã tải lên trước đó
                    </label>
                    <div className="relative">
                        {oldGalleryTotalPages > 1 && oldGalleryCurrentPage > 0 && (
                            <button
                            onClick={() => goToPrev({
                                currentPage: oldGalleryCurrentPage,
                                setCurrentPage: setOldGalleryCurrentPage
                            })}
                            className="lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            </button>
                        )}

                        <div className="flex gap-2">
                            {currentOldGallery.map((oldGal, index) => (
                                <ImageFileCard key={index} imagePath={oldGal} typeAction={'delete'} handleAction={() => removeGalleryImage({
                                    indexToRemove: oldGalleryStartIndex + index,
                                    currentGallery: currentOldGallery,
                                    currentPage: oldGalleryCurrentPage,
                                    totalPages: oldGalleryTotalPages,
                                    setGallery: (updatedGallery) => setArticleInfo(prev => ({
                                        ...prev,
                                        gallery: updatedGallery
                                    })),
                                    setGalleryCurrentPage: setOldGalleryCurrentPage
                                })}/>
                            ))}
                        </div>

                        {oldGalleryTotalPages > 1 && oldGalleryCurrentPage < oldGalleryTotalPages - 1 &&(
                            <button
                            onClick={() => goToNext({
                                currentPage: oldGalleryCurrentPage,
                                setCurrentPage: setOldGalleryCurrentPage,
                                totalPages: oldGalleryTotalPages
                            })}
                            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImagePlus className="inline mr-1" size={16} />
                    Các hình ảnh sẽ xóa
                    </label>
                    <div className="relative">
                        {deletedGalleryTotalPages > 1 && deletedGalleryCurrentPage > 0 && (
                            <button
                            onClick={() => goToPrev({
                                currentPage: deletedGalleryCurrentPage,
                                setCurrentPage: setDeletedGalleryCurrentPage
                            })}
                            className="lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            </button>
                        )}

                        <div className="flex gap-2">
                            {currentDeletedGallery.map((delGal, index) => (
                                <ImageFileCard key={index} imagePath={delGal} typeAction={'restore'} handleAction={() => restoreOldGallery(index)}/>
                            ))}
                        </div>

                        {deletedGalleryTotalPages > 1 && deletedGalleryCurrentPage < deletedGalleryTotalPages - 1 &&(
                            <button
                            onClick={() => goToNext({
                                currentPage: deletedGalleryCurrentPage,
                                setCurrentPage: setDeletedGalleryCurrentPage,
                                totalPages: deletedGalleryTotalPages
                            })}
                            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                            </button>
                        )}
                    </div>
                </div>
                </>)}
    
                {/* Content - Placeholder for Tiptap Editor */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung bài viết *
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-300 p-3 text-gray-500">
                            <FileText className="inline mr-2" size={20} />
                            <TiptapEditor articleContent={content} setArticleContent={setContent}/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}