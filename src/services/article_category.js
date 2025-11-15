import api from "./client"

export const articleCategoryService = {
    getAllCategories: () => api.get('/api/article-category/all-article-categories'),
    create: (category) => api.post('/api/article-category/add', category),
    update: (categoryId, category) => api.put(`/api/article-category/update/${categoryId}`, category),
    delete: (categoryId) => api.delete(`api/article-category/delete/${categoryId}`)
}