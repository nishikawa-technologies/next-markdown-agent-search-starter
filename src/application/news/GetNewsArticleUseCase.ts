import type { Locale } from '@/domain/content/value-objects/Locale';
import type { NewsArticle } from '@/domain/news/entities/NewsArticle';
import type { NewsArticleRepository } from '@/domain/news/repositories/NewsArticleRepository';
import type { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';
import { NewsArticleNotFoundError } from './NewsArticleNotFoundError';

interface GetNewsArticleQuery {
  locale: Locale;
  slug: NewsArticleSlug;
}

export class GetNewsArticleUseCase {
  constructor(private readonly newsArticleRepository: NewsArticleRepository) {}

  async execute(query: GetNewsArticleQuery): Promise<NewsArticle> {
    const article = await this.newsArticleRepository.findByLocaleAndSlug(
      query.locale,
      query.slug,
    );

    if (!article) {
      throw new NewsArticleNotFoundError(query.locale, query.slug);
    }

    return article;
  }
}
