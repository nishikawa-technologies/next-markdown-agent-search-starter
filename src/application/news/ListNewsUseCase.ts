import type { Locale } from '@/domain/content/value-objects/Locale';
import type { NewsArticle } from '@/domain/news/entities/NewsArticle';
import type { NewsArticleRepository } from '@/domain/news/repositories/NewsArticleRepository';

interface ListNewsQuery {
  locale: Locale;
}

export class ListNewsUseCase {
  constructor(private readonly newsArticleRepository: NewsArticleRepository) {}

  async execute(query: ListNewsQuery): Promise<NewsArticle[]> {
    const articles = await this.newsArticleRepository.listByLocale(query.locale);

    return [...articles].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
  }
}
