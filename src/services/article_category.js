import api from "./client"

export const articleCategoryService = {
    getAllCategories: () => api.get('/api/article-category/admin/all-article-categories'),
    create: (category) => api.post('/api/article-category/admin/add', category),
    update: (categoryId, category) => api.put(`/api/article-category/admin/update/${categoryId}`, category),
    delete: (categoryId) => api.delete(`api/article-category/admin/delete/${categoryId}`)
}