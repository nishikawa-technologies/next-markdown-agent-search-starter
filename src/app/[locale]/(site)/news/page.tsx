import type { Metadata } from 'next';
import process from 'node:process';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { unstable_noStore as noStore } from 'next/cache';
import { Locale } from '@/domain/content/value-objects/Locale';
import { listNewsUseCase } from '@/infrastructure/news/newsModule';
import { NewsListView } from '@/presentation/news/NewsListView';
import { pageSeoMetadata } from '@/utils/seoMetadata';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: NewsPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'News' });

  return pageSeoMetadata(locale, '/news/', t('list_title'), t('list_description'));
}

export default async function NewsPage(props: NewsPageProps) {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const { locale: localeCode } = await props.params;
  setRequestLocale(localeCode);

  const locale = Locale.create(localeCode);
  const articles = await listNewsUseCase.execute({ locale });

  return <NewsListView localeCode={localeCode} articles={articles} />;
}
