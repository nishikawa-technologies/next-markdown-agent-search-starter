import type { Metadata } from 'next';
import process from 'node:process';
import { setRequestLocale } from 'next-intl/server';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { NewsArticleNotFoundError } from '@/application/news/NewsArticleNotFoundError';
import { Locale } from '@/domain/content/value-objects/Locale';
import { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';
import { getNewsArticleUseCase } from '@/infrastructure/news/newsModule';
import { generateNewsArticleStaticParams } from '@/presentation/news/generateNewsStaticParams';
import { NewsArticleView } from '@/presentation/news/NewsArticleView';
import { pageSeoMetadata } from '@/utils/seoMetadata';

interface NewsArticlePageProps {
  params: Promise<{ locale: string; articleSlug: string }>;
}

export function generateStaticParams() {
  return generateNewsArticleStaticParams();
}

export async function generateMetadata(
  props: NewsArticlePageProps,
): Promise<Metadata> {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const { locale: localeCode, articleSlug } = await props.params;

  try {
    const article = await getNewsArticleUseCase.execute({
      locale: Locale.create(localeCode),
      slug: NewsArticleSlug.create(articleSlug),
    });

    const publishedTime = article.publishedAt.toISOString();

    return pageSeoMetadata(
      localeCode,
      `/news/${articleSlug}/`,
      article.title,
      article.description || undefined,
      {
        openGraphType: 'article',
        publishedTime,
        modifiedTime: publishedTime,
      },
    );
  }
  catch {
    return {};
  }
}

export default async function NewsArticlePage(props: NewsArticlePageProps) {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const { locale: localeCode, articleSlug } = await props.params;
  setRequestLocale(localeCode);

  try {
    const article = await getNewsArticleUseCase.execute({
      locale: Locale.create(localeCode),
      slug: NewsArticleSlug.create(articleSlug),
    });

    return <NewsArticleView localeCode={localeCode} article={article} />;
  }
  catch (error) {
    if (error instanceof NewsArticleNotFoundError) {
      notFound();
    }

    throw error;
  }
}
