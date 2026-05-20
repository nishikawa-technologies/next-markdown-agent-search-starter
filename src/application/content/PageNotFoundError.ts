import type { Locale } from '@/domain/content/value-objects/Locale';
import type { PageSlug } from '@/domain/content/value-objects/PageSlug';

export class PageNotFoundError extends Error {
  constructor(locale: Locale, slug: PageSlug) {
    super(`Page not found: ${locale.code}/${slug.value}`);
    this.name = 'PageNotFoundError';
  }
}
