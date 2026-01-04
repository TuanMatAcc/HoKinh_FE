import { useQuery } from "@tanstack/react-query";
import { articleService } from "../services/article_api";

export const useArticle = (id) => useQuery({
    queryKey: ['article', id],
    queryFn: () =>  articleService.getArticleById(id),
    staleTime: 600000,
    enabled: !!id
});