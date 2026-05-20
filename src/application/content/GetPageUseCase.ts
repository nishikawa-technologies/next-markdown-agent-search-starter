import type { Page } from '@/domain/content/entities/Page';
import type { PageRepository } from '@/domain/content/repositories/PageRepository';
import type { Locale } from '@/domain/content/value-objects/Locale';
import type { PageSlug } from '@/domain/content/value-objects/PageSlug';
import { PageNotFoundError } from './PageNotFoundError';

interface GetPageQuery {
  locale: Locale;
  slug: PageSlug;
};

export class GetPageUseCase {
  constructor(private readonly pageRepository: PageRepository) {}

  async execute(query: GetPageQuery): Promise<Page> {
    const page = await this.pageRepository.findByLocaleAndSlug(
      query.locale,
      query.slug,
    );

    if (!page) {
      throw new PageNotFoundError(query.locale, query.slug);
    }

    return page;
  }
}
