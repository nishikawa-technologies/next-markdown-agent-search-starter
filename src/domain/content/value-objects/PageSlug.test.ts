import { describe, expect, it } from 'vitest';
import { InvalidPageSlugError, PageSlug } from './PageSlug';

describe('pageSlug', () => {
  it('creates the home slug from index', () => {
    const slug = PageSlug.create('index');

    expect(slug.value).toBe('index');
    expect(slug.toPathSegment()).toBe('');
  });

  it('creates a nested slug from a path segment', () => {
    const slug = PageSlug.create('about');

    expect(slug.value).toBe('about');
    expect(slug.toPathSegment()).toBe('about');
  });

  it('rejects invalid slug characters', () => {
    expect(() => PageSlug.create('../etc')).toThrow(InvalidPageSlugError);
  });

  it('resolves a slug from URL path segments', () => {
    expect(PageSlug.fromPathSegments([]).value).toBe('index');
    expect(PageSlug.fromPathSegments(['about']).value).toBe('about');
  });
});
