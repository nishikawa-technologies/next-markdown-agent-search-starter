import type { NewsArticle } from '@/domain/news/entities/NewsArticle';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { MarkdownContent } from '@/presentation/content/MarkdownContent';
import { formatNewsDate } from './formatNewsDate';
import { newsListPath } from './newsPaths';

interface NewsArticleViewProps {
  localeCode: string;
  article: NewsArticle;
}

export async function NewsArticleView({ localeCode, article }: NewsArticleViewProps) {
  const t = await getTranslations({ locale: localeCode, namespace: 'News' });

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm sm:p-8">
      <Link
        href={newsListPath}
        className="font-mono text-sm text-cyan-400 transition-colors hover:text-cyan-300"
      >
        {t('back_to_list')}
      </Link>
      <time
        dateTime={article.publishedAt.toISOString().slice(0, 10)}
        className="mt-4 block font-mono text-sm text-cyan-400/80"
      >
        {formatNewsDate(article.publishedAt, localeCode)}
      </time>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {article.title}
      </h1>
      <div className="mt-8">
        <MarkdownContent body={article.body} />
      </div>
    </article>
  );
}
