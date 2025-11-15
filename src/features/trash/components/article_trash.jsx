import { Trash2, RotateCcw, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ThreeDotLoader } from '../../../components/ActionFallback';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { articleService } from '../../../services/article_api';
import { ArticleManagementCard } from '../../article/components/article_card';

const ArticleTrash = () => {
    const queryClient = useQueryClient();
    const {
        isError,
        isPending,
        isSuccess,
        data: deletedArticles
    } = useQuery({
        queryKey: ['deleted_articles_management'],
        queryFn: () => articleService.getAllDeletedArticles(),
        staleTime: 60000 * 5
    });
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    const handleRestore = async ({categoryId, id}) => {
        setInProgress(true);
        
        try {
            console.log(1);
            const returnedData = (await articleService.patch(id, {deleted : false})).data;
            console.log(returnedData);
            queryClient.setQueryData(['deleted_articles_management'], oldData => {
                if(!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter(a => a.id !== id)
                };
            });
            console.log(3);
            const articleKey = ['articles_management', categoryId];
            console.log(4);
            if(queryClient.getQueryData(articleKey)) {
                queryClient.setQueryData(articleKey, oldData => {
                    if(!oldData) return oldData;
                    return {
                        ...oldData,
                        data: [returnedData, ...oldData.data]
                    }
                })
            }
            console.log(5);
            setInProgress(false);
        }
        catch(error) {
            if(error.response) {
                console.log(error.response.data);
            }
        }
        
    };

    const getTotalDeletedCount = () => {
        return deletedArticles ? deletedArticles.data.length : 0;
    }

    return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Thùng Rác</h3>
                <p className="text-sm text-gray-500 mt-1">Các mục đã xóa - Khôi phục hoặc xóa vĩnh viễn</p>
            </div>
            {getTotalDeletedCount() > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle size={18} className="text-red-600" />
                <span className="text-sm font-semibold text-red-600">
                    {getTotalDeletedCount()} mục trong thùng rác
                </span>
                </div>
            )}
        </div>
        {inProgress && (
            <ThreeDotLoader size="md" color="gray" message='Đang thực hiện thao tác...' />
        )}
        <div className="max-w-7xl mx-auto">
            <div>
            {deletedArticles?.data.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-16 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-6 rounded-full">
                    <Trash2 size={64} className="text-gray-300" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thùng rác trống</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Các tin tức đã xóa sẽ được lưu trữ tại đây. Bạn có thể khôi phục hoặc xóa vĩnh viễn.
                </p>
                </div>
            ) : (
                <>
                {/* Info Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                    <p className="text-sm text-amber-800">
                        <span className="font-semibold">Lưu ý:</span> Các tin tức trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn. 
                        Tin tức đã xóa vĩnh viễn không thể khôi phục.
                    </p>
                    </div>
                </div>

                {/* Trash Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isSuccess && deletedArticles.data.map(delArticle => (
                        <ArticleManagementCard key={delArticle.id} article={delArticle} handleAction={() => handleRestore({
                            categoryId: delArticle.category.id, id: delArticle.id
                        })} 
                        />
                    ))}
                </div>
                </>
            )}
            </div>
        </div>
    </div>
    );
};

export default ArticleTrash;