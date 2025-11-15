import { 
  Edit2, Trash2, FileText, Calendar, User,
  RefreshCw
} from 'lucide-react';
import { generateHTMLFromJSON } from '../../../utils/generateHtmlUtils';
import { articleService } from '../../../services/article_api';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import AnnouncementUI from "../../../components/Announcement";
import { ThreeDotLoader } from '../../../components/ActionFallback';
import getTimeSinceDeleted from '../../../utils/getTimeSinceDeleted';
import formatDate from '../../../utils/formatDate';

export function ArticleManagementCard({article, handleAction}) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const queryClient = useQueryClient();
    const [inProgress, setInProgress] = useState(false);
    const [showError, setShowError] = useState(false);
    const errorMessage = useRef("");

    const handleDelete = async () => {
        if(article.deleted) {
            setShowConfirmDialog(true);
        }
        else {
            try {
                const returnedData = (await articleService.patch(article.id, {deleted : true})).data;
                queryClient.setQueryData(['articles_management', article.category.id], oldData => {
                    if(!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter(a => a.id !== article.id)
                    };
                });
                console.log(queryClient.getQueryData(['articles_management', article.category.id]));
                const deletedArticleKey = ['deleted_articles_management'];
                if(queryClient.getQueryData(deletedArticleKey)) {
                    queryClient.setQueryData(deletedArticleKey, oldData => {
                        if(!oldData) return oldData;
                        return {
                            ...oldData,
                            data: [returnedData, ...oldData.data]
                        }
                    })
                }
            }
            catch(error) {
                if(error.response) {
                    console.log(error.response.data);
                }
            }
        }
    }

    const handlePermanentDelete = async () => {
        setShowConfirmDialog(false);
        setInProgress(true);
        try {
            await articleService.delete(article.id);
            queryClient.setQueryData(['deleted_articles_management'], oldData => {
                if(!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter(a => a.id !== article.id)
                };
            });
            setInProgress(false);
        }
        catch(error) {
            if(error.response) {
                errorMessage.current = "Đã xảy ra lỗi khi xóa tin tức. Chi tiết lỗi: " + error.response.data;
                setShowError(true);
                setInProgress(false);
            }
        }
    }

    return (
        <>
            {inProgress && (
                <ThreeDotLoader size="md" color="gray" message= 'Đang xóa bài viết' />
            )}
            {showError && 
                <AnnouncementUI setVisible= {setShowError} 
                                message= {errorMessage.current} 
                />
            }
            {showConfirmDialog && <ConfirmDialog 
                title="Xóa vĩnh viễn tin tức" 
                askDetail="Bạn có chắc chắn muốn xóa vĩnh viễn tin tức này ? Sau khi xóa sẽ không thể khôi phục."
                handleCancel={() => setShowConfirmDialog(false)}
                handleConfirm={() => handlePermanentDelete()}
            />}
            <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {article.deleted && (
                    <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Trash2 size={14} />
                            Đã xóa {getTimeSinceDeleted(article.deletedAt)}
                        </span>
                        <span>{new Date(article.deletedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                )}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {article.coverImage ? (
                    <img 
                        src={article.coverImage} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                        <FileText size={48} className="text-gray-400" />
                    </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 shadow">
                    {article.category.categoryName}
                    </div>
                </div>
                
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14}/>
                        {formatDate({dateString: article.date, showTime: false, region: 'vi-VN'})}
                    </div>
                    </div>

                    <div 
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: generateHTMLFromJSON(article.content) }}
                    />

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => handleAction(article)}
                        className={ 
                            article.deleted ? "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors bg-green-50 text-green-600 hover:bg-green-100" : 
                            "flex-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }
                    >
                        {article.deleted ? 
                        <>
                            <RefreshCw size={16} />
                        </> : 
                        <>
                            <Edit2 size={16} />
                            Chỉnh sửa
                        </>
                        }
                        
                    </button>
                    <button
                        onClick={() => handleDelete(article.id)}
                        className="flex-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={16} />
                        {article.deleted ? "Xóa vĩnh viễn" : "Xóa"}
                    </button>
                    </div>
                </div>
            </div>
        </>
    );
}