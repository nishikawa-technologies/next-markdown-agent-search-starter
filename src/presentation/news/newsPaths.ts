import type { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';

export function newsArticlePath(slug: NewsArticleSlug): string {
  return `/news/${slug.value}/`;
}

export const newsListPath = '/news/';
