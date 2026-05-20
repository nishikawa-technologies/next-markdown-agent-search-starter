import { describe, expect, it } from 'vitest';
import { Locale } from '../value-objects/Locale';
import { PageSlug } from '../value-objects/PageSlug';
import { Page } from './Page';

describe('page', () => {
  it('exposes locale, slug, metadata, and markdown body', () => {
    const page = Page.create({
      locale: Locale.create('ja'),
      slug: PageSlug.create('about'),
      title: 'About',
      description: 'Company profile',
      body: '# About\n\nContent',
    });

    expect(page.locale.code).toBe('ja');
    expect(page.slug.value).toBe('about');
    expect(page.title).toBe('About');
    expect(page.description).toBe('Company profile');
    expect(page.body).toBe('# About\n\nContent');
  });
});
