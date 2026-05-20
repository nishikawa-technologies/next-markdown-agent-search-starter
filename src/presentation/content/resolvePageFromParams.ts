import { PageNotFoundError } from '@/application/content/PageNotFoundError';
import { InvalidLocaleError, Locale } from '@/domain/content/value-objects/Locale';
import { PageSlug } from '@/domain/content/value-objects/PageSlug';
import { getPageUseCase } from '@/infrastructure/content/contentModule';

export async function resolvePageFromParams(params: {
  locale: string;
  slug?: string[];
}) {
  let locale: Locale;

  try {
    locale = Locale.create(params.locale);
  }
  catch (error) {
    if (error instanceof InvalidLocaleError) {
      return null;
    }

    throw error;
  }

  const slug = PageSlug.fromPathSegments(params.slug ?? []);

  try {
    return await getPageUseCase.execute({ locale, slug });
  }
  catch (error) {
    if (error instanceof PageNotFoundError) {
      return null;
    }

    throw error;
  }
}
