import { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Folder, ArrowLeft, FolderOpen, Tag
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { articleCategoryService } from '../../../services/article_category';
import AnnouncementUI from '../../../components/Announcement';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ThreeDotLoader } from '../../../components/ActionFallback';

// Category Management Component
const CategoryManagement = ({ categories, onBack }) => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const confirmMessage = useRef(""); 
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");

  const handleCreateCategory = async () => {
    setInProgress(true);
    if (!newCategoryName.trim()) {
      setShowError(true);
      errorMessage.current = "Tên danh mục không được để trống";
      return;
    };
    
    const newCategory = {
      id: null,
      categoryName: newCategoryName.trim()
    };
    setIsCreating(true);
    try {
      const returnedData = await articleCategoryService.create(newCategory);
      queryClient.setQueryData(['article_categories_management'], oldData => {
        if(!oldData) return oldData;
        return {
          ...oldData,
          data: [returnedData, ...oldData.data]
        }
      });
      setNewCategoryName('');
      setIsCreating(false);
      setInProgress(false);
    }
    catch(error) {
      setInProgress(false);
      if(error.response) {
        setShowError(true);
        errorMessage.current = "Xảy ra lỗi khi tạo danh mục. Chi tiết lỗi: " + error.response.data;
      }
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    setInProgress(true);
    if (!newName.trim()) return;
    const updatedCategory = {
      id: id,
      categoryName: newName.trim()
    };
    try {
      const returnedData = (await articleCategoryService.update(id, updatedCategory)).data;
      
      queryClient.setQueryData(['article_categories_management'], oldData => {
        if(!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((cat) => cat.id === id ? returnedData : cat)
        }
      });
      setInProgress(false);
    }
    catch(error) {
      setInProgress(false);
      if(error.response) {
        setShowError(true);
        errorMessage.current = "Xảy ra lỗi khi cập nhật danh mục. Chi tiết lỗi: " + error.response.data;
      }
    }

    setEditingCategory(null);
  };

  const handleDeleteCategory = async () => {
      setInProgress(true);
      try {
        const returnedData = await articleCategoryService.delete(editingCategory);
      
        queryClient.setQueryData(['article_categories_management'], oldData => {
          if(!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter(cat => cat.id !== editingCategory)
          }
        });
        editingCategory = null;
        setInProgress(false);
      }
      catch(error) {
        setInProgress(false);
        if(error.response) {
          setShowError(true);
          errorMessage.current = "Xảy ra lỗi khi xóa danh mục. Chi tiết lỗi: " + error.response.data;
        }
        setShowConfirmDialog(false);
      }
  };

  return (
    <>
      {inProgress && (
          <ThreeDotLoader size="md" color="gray" message= 'Đang thao tác...' />
      )}
      {showConfirmDialog && <ConfirmDialog 
        title="Thao tác danh mục" 
        askDetail={confirmMessage.current}
        handleCancel={() => setShowConfirmDialog(false)}
        handleConfirm={() => handleDeleteCategory()}
      />}
      {showError && <AnnouncementUI message={errorMessage.current} setVisible={setShowError}/>}
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FolderOpen size={28} className="text-blue-600" />
                    Quản lý danh mục
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Thêm, sửa, xóa danh mục bài viết</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Thêm danh mục
              </button>
            </div>
          </div>

          {/* Create New Category Form */}
          {isCreating && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={20} className="text-blue-600" />
                Tạo danh mục mới
              </h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                />
                <button
                  onClick={handleCreateCategory}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategoryName('');
                  }}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700">
                Danh sách danh mục ({categories.length})
              </h4>
            </div>
            
            {categories.length === 0 ? (
              <div className="text-center py-16">
                <Folder size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có danh mục nào</h3>
                <p className="text-gray-500 mb-6">Hãy tạo danh mục đầu tiên để bắt đầu</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Thêm danh mục
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((category, index) => {
                  console.log(category.id);
                  return <div
                    key={category.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {editingCategory === category.id ? (
                      <div className="flex gap-3 items-center">
                        <span className="text-gray-400 font-medium w-8">#{index + 1}</span>
                        <input
                          type="text"
                          defaultValue={category.categoryName}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCategory(category.id, e.target.value);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.closest('div').querySelector('input');
                            handleUpdateCategory(category.id, input.value);
                          }}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-gray-400 font-medium w-8">#{index + 1}</span>
                          <Tag size={18} className="text-blue-600" />
                          <span className="text-gray-800 font-medium">{category.categoryName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCategory(category.id)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              confirmMessage.current = "Bạn có muốn xóa danh mục không ?";
                              setEditingCategory(category.id);
                              setShowConfirmDialog(true);
                            }
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default CategoryManagement;