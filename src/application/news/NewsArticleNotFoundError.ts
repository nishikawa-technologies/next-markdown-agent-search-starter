import type { Locale } from '@/domain/content/value-objects/Locale';
import type { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';

export class NewsArticleNotFoundError extends Error {
  constructor(locale: Locale, slug: NewsArticleSlug) {
    super(`News article not found: ${locale.code}/news/${slug.value}`);
    this.name = 'NewsArticleNotFoundError';
  }
}
