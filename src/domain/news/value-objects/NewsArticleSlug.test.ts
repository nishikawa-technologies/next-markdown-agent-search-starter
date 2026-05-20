import { describe, expect, it } from 'vitest';
import { InvalidNewsArticleSlugError, NewsArticleSlug } from './NewsArticleSlug';

describe('newsArticleSlug', () => {
  it('creates a slug from a valid filename stem', () => {
    const slug = NewsArticleSlug.create('2025-05-20-site-launch');

    expect(slug.value).toBe('2025-05-20-site-launch');
  });

  it('rejects invalid slug characters', () => {
    expect(() => NewsArticleSlug.create('../secret')).toThrow(InvalidNewsArticleSlugError);
  });
});
