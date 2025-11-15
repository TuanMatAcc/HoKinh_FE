import api from "./client"

export const articleService = {
    getDataHomepage: (page, size) => api.get('/api/article/homepage', {
        params: {page, size}
    }),
    getAllArticlesByCategory: (categoryId) => api.get('/api/article/all-articles-by-category', {
        params: {categoryId}
    }),
    getAllDeletedArticles: () => api.get('/api/article/all-deleted-articles'),
    create: (article) => api.post('/api/article/add', article),
    update: (articleId, article) => api.put(`/api/article/update/${articleId}`, article),
    patch: (articleId, articleFields) => api.put(`/api/article/patch/${articleId}`, articleFields),
    delete: (articleId) => api.delete(`/api/article/delete/${articleId}`),
}