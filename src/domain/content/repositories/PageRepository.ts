import type { Page } from '../entities/Page';
import type { Locale } from '../value-objects/Locale';
import type { PageSlug } from '../value-objects/PageSlug';

export interface PageRepository {
  findByLocaleAndSlug: (locale: Locale, slug: PageSlug) => Promise<Page | null>;
}
