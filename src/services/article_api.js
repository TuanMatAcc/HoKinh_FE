import api from "./client"

export const articleService = {
    getDataHomepage: (page, size, type) => api.get('/api/article/homepage', {
        params: {page, size, type}
    }),
    getAllArticlesByCategory: (categoryId) => api.get('/api/article/admin/all-articles-by-category', {
        params: {categoryId}
    }),
    getAllDeletedArticles: () => api.get('/api/article/admin/all-deleted-articles'),
    create: (article) => api.post('/api/article/admin/add', article),
    update: (articleId, article) => api.put(`/api/article/admin/update/${articleId}`, article),
    patch: (articleId, articleFields) => api.put(`/api/article/admin/patch/${articleId}`, articleFields),
    delete: (articleId) => api.delete(`/api/article/admin/delete/${articleId}`),
}