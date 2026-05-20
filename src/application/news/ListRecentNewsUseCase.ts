import type { Locale } from '@/domain/content/value-objects/Locale';
import type { NewsArticle } from '@/domain/news/entities/NewsArticle';
import type { NewsArticleRepository } from '@/domain/news/repositories/NewsArticleRepository';
import { ListNewsUseCase } from './ListNewsUseCase';

interface ListRecentNewsQuery {
  locale: Locale;
  limit: number;
}

export class ListRecentNewsUseCase {
  private readonly listNewsUseCase: ListNewsUseCase;

  constructor(newsArticleRepository: NewsArticleRepository) {
    this.listNewsUseCase = new ListNewsUseCase(newsArticleRepository);
  }

  async execute(query: ListRecentNewsQuery): Promise<NewsArticle[]> {
    const articles = await this.listNewsUseCase.execute({ locale: query.locale });

    return articles.slice(0, query.limit);
  }
}
