import type { NewsArticle } from '../entities/NewsArticle';
import type { NewsArticleSlug } from '../value-objects/NewsArticleSlug';
import type { Locale } from '@/domain/content/value-objects/Locale';

export interface NewsArticleRepository {
  listByLocale: (locale: Locale) => Promise<NewsArticle[]>;
  findByLocaleAndSlug: (
    locale: Locale,
    slug: NewsArticleSlug,
  ) => Promise<NewsArticle | null>;
}
