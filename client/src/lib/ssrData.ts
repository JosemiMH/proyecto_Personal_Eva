import type { QueryClient } from "@tanstack/react-query";
import type { Article } from "@shared/schema";

export interface InitialQueryData {
  articles?: Article[];
  article?: Article;
  articleSlug?: string;
}

export function seedQueryClient(queryClient: QueryClient, initialData?: InitialQueryData) {
  if (!initialData) return;

  if (initialData.articles) {
    queryClient.setQueryData(["/api/articles"], initialData.articles);
  }

  if (initialData.article && initialData.articleSlug) {
    queryClient.setQueryData(
      [`/api/articles/${initialData.articleSlug}`],
      initialData.article,
    );
  }
}

declare global {
  interface Window {
    __INITIAL_QUERY_DATA__?: InitialQueryData;
  }
}
