import { describe, expect, it } from 'vitest';
import {
  alternateLanguageRecords,
  canonicalUrlForLocale,
  normalizeSitePath,
  sitePathFromCatchAllSlug,
} from './seoMetadata';

describe('seoMetadata', () => {
  it('normalizeSitePath', () => {
    expect(normalizeSitePath('/')).toBe('/');
    expect(normalizeSitePath('company')).toBe('/company/');
    expect(normalizeSitePath('/news')).toBe('/news/');
  });

  it('sitePathFromCatchAllSlug', () => {
    expect(sitePathFromCatchAllSlug()).toBe('/');
    expect(sitePathFromCatchAllSlug([])).toBe('/');
    expect(sitePathFromCatchAllSlug(['company'])).toBe('/company/');
  });

  it('alternateLanguageRecords uses default locale without prefix', () => {
    const urls = alternateLanguageRecords('/company/');
    expect(urls.ja).toMatch(/\/company\/$/);
    expect(urls.en).toMatch(/\/en\/company\/$/);
    expect(urls['x-default']).toBe(urls.ja);
  });

  it('canonicalUrlForLocale', () => {
    expect(canonicalUrlForLocale('ja', '/news/')).toBe(alternateLanguageRecords('/news/').ja);
    expect(canonicalUrlForLocale('en', '/news/')).toBe(alternateLanguageRecords('/news/').en);
  });
});
