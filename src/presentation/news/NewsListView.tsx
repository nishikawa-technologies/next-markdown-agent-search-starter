import type { NewsArticle } from '@/domain/news/entities/NewsArticle';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { formatNewsDate } from './formatNewsDate';
import { newsArticlePath } from './newsPaths';

interface NewsListViewProps {
  localeCode: string;
  articles: NewsArticle[];
}

export async function NewsListView({ localeCode, articles }: NewsListViewProps) {
  const t = await getTranslations({ locale: localeCode, namespace: 'News' });

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {t('list_title')}
      </h1>
      <p className="mt-3 text-slate-400">{t('list_description')}</p>

      {articles.length === 0
        ? (
            <p className="mt-10 text-slate-500">{t('empty')}</p>
          )
        : (
            <ul className="mt-10 space-y-4">
              {articles.map(article => (
                <li key={article.slug.value}>
                  <Link
                    href={newsArticlePath(article.slug)}
                    className="group block rounded-lg border border-white/10 bg-slate-950/40 px-4 py-4 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/5"
                  >
                    <time
                      dateTime={article.publishedAt.toISOString().slice(0, 10)}
                      className="font-mono text-xs text-cyan-400/80"
                    >
                      {formatNewsDate(article.publishedAt, localeCode)}
                    </time>
                    <p className="mt-2 text-lg font-medium text-slate-100 group-hover:text-white">
                      {article.title}
                    </p>
                    {article.description
                      ? (
                          <p className="mt-2 text-sm leading-relaxed text-slate-400">
                            {article.description}
                          </p>
                        )
                      : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
    </article>
  );
}
