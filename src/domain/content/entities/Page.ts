import type { Locale } from '../value-objects/Locale';
import type { PageSlug } from '../value-objects/PageSlug';

interface CreatePageParams {
  locale: Locale;
  slug: PageSlug;
  title: string;
  description: string;
  body: string;
};

export class Page {
  private constructor(
    readonly locale: Locale,
    readonly slug: PageSlug,
    readonly title: string,
    readonly description: string,
    readonly body: string,
  ) {}

  static create(params: CreatePageParams): Page {
    return new Page(
      params.locale,
      params.slug,
      params.title,
      params.description,
      params.body,
    );
  }
}
