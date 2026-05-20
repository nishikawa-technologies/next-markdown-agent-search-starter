import { Locale } from '@/domain/content/value-objects/Locale';
import { newsArticleRepository } from '@/infrastructure/news/newsModule';
import { AppConfig } from '@/utils/AppConfig';

export async function generateNewsArticleStaticParams() {
  const params: { locale: string; articleSlug: string }[] = [];

  for (const localeCode of AppConfig.locales) {
    const locale = Locale.create(localeCode);
    const articles = await newsArticleRepository.listByLocale(locale);

    for (const article of articles) {
      params.push({
        locale: localeCode,
        articleSlug: article.slug.value,
      });
    }
  }

  return params;
}
