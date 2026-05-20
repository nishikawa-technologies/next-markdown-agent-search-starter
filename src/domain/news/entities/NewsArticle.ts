import type { NewsArticleSlug } from '../value-objects/NewsArticleSlug';
import type { Locale } from '@/domain/content/value-objects/Locale';

interface CreateNewsArticleParams {
  locale: Locale;
  slug: NewsArticleSlug;
  title: string;
  description: string;
  publishedAt: Date;
  body: string;
}

export class NewsArticle {
  private constructor(
    readonly locale: Locale,
    readonly slug: NewsArticleSlug,
    readonly title: string,
    readonly description: string,
    readonly publishedAt: Date,
    readonly body: string,
  ) {}

  static create(params: CreateNewsArticleParams): NewsArticle {
    return new NewsArticle(
      params.locale,
      params.slug,
      params.title,
      params.description,
      params.publishedAt,
      params.body,
    );
  }
}
