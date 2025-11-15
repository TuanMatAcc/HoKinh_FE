import { useEffect, useState } from 'react';
import { 
  Plus, FileText, Folder
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { articleService } from '../../../services/article_api';
import { articleCategoryService } from '../../../services/article_category';
import { ArticleManagementCard } from './article_card';
import { ArticleEditView } from './article_detail_edit';
import CategoryManagement from './article_category_management';
import ArticleTrash from '../../trash/components/article_trash';

const ArticleManagement = () => {
  const [view, setView] = useState('article_list'); // 'article_list', 'create', 'edit'

  const {
    isPending: isCategoriesLoading,
    isError: isCategoriesError,
    data: categoriesData,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['article_categories_management'],
    queryFn: () => articleCategoryService.getAllCategories()
  });
  const [trashTab, setTrashTab] = useState("");

  const [currentCategory, setCurrentCategory] = useState(-1);

  const {
    isPending: isArticlesLoading,
    isError: isArticlesError,
    data: articlesData,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: ['articles_management', currentCategory],
    queryFn: () => articleService.getAllArticlesByCategory(currentCategory),
    enabled: currentCategory > 0,
    staleTime: 60000
  });

  const [editingArticle, setEditingArticle] = useState(null);

  const handleCreateNew = () => {

    setView('create');
    setEditingArticle(null);
    
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setView('edit');
  };

  const handleDelete = (id) => {
    // if (window.confirm('Are you sure you want to delete this article?')) {
    //   setArticles(articles.filter(a => a.id !== id));
    // }
  };

  const handleCancel = () => {
    setView('article_list');
    setEditingArticle(null);
  };

  const handleSwitchCategory = (categoryId) => {
    setCurrentCategory(Number(categoryId));
  }

  // Category Management View
  if (view === 'category_list') {
    return (
      <CategoryManagement 
        categories={categoriesData.data}
        onBack={() => setView('article_list')}
      />
    );
  }

  // List View
  if (view === 'article_list') {
    return (
    <>
      <div className="flex">
        <button
          onClick={() => setTrashTab('')}
          className={`flex-1 flex justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            trashTab === ''
              ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {/* <MapPin size={18} /> */}
          Tin tức
        </button>
        <button
          onClick={() => setTrashTab('articles')}
          className={`flex-1 flex justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            trashTab === 'articles'
              ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {/* <Trophy size={18} /> */}
          Thùng rác
        </button>
      </div>
      {trashTab === '' && 
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start bg-white rounded-xl shadow-sm p-5 border-gray-200 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Quản lý bài viết</h3>
                <p className="text-sm text-gray-500 mt-1">Quản lý bài viết của câu lạc bộ</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus size={20} />
                Tạo bài viết
              </button>
            </div>

            <div className='mb-5 flex flex-col sm:flex-row justify-between items-start bg-white rounded-xl shadow-sm p-5 border-gray-200'>
              <div>
                <label htmlFor='article-category' className='block mb-2 text-md font-medium text-gray-900'>
                  Danh mục
                </label>
                <div>
                  {(categoriesData?.data.length !== 0) && (
                    <select value= {currentCategory}
                            id='article-category' 
                            onChange={(e) => handleSwitchCategory(e.target.value)}
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
                              bg-size-[1.5em_1.5em] bg-position-[right_0.5rem_center] bg-no-repeat">
                      <option disabled value="-1">Chọn danh mục</option>
                      {categoriesData?.data.map(category => {
                        return <option key={category.id} value={category.id}>{category.categoryName}</option>
                      })}
                    </select>
                  )}
                  {categoriesData?.data.length === 0 && (
                    <span className='text-sm text-gray-500'>Chưa có danh mục nào hãy tạo danh mục</span>
                  )} 
                </div>
              </div>
              <button
                onClick={() => setView('category_list')}
                className="flex items-center self-end gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Folder size={20} />
                Quản lý danh mục
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {articlesData?.data?.map(article => {
              
                return <ArticleManagementCard key={article.id} article={article} handleAction={handleEdit} />
              }
                
              )}
            </div>

            {articlesData?.data?.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Hiện tại chưa có bài viết nào ở danh mục này</h3>
                <p className="text-gray-500 mb-6">Hãy bắt đầu tạo bài viết đầu tiên</p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Tạo bài viết
                </button>
              </div>
            )}
          </div>
        </div>
      }
      {trashTab === 'articles' && <ArticleTrash/>}
    </>
    );
  }

  // Create/Edit View
  return (
    <ArticleEditView 
      editingArticle={editingArticle} 
      categories={categoriesData.data}
      handleCancelUpdate={handleCancel}
    />
  );
};

export default ArticleManagement;