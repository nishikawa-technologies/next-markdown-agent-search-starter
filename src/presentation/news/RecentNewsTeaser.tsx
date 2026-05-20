import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Locale } from '@/domain/content/value-objects/Locale';
import { listRecentNewsUseCase } from '@/infrastructure/news/newsModule';
import { formatNewsDate } from './formatNewsDate';
import { newsArticlePath, newsListPath } from './newsPaths';

const RECENT_NEWS_LIMIT = 5;

interface RecentNewsTeaserProps {
  localeCode: string;
}

export async function RecentNewsTeaser({ localeCode }: RecentNewsTeaserProps) {
  const locale = Locale.create(localeCode);
  const t = await getTranslations({ locale: localeCode, namespace: 'News' });
  const articles = await listRecentNewsUseCase.execute({
    locale,
    limit: RECENT_NEWS_LIMIT,
  });

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {t('recent_heading')}
        </h2>
        <Link
          href={newsListPath}
          className="shrink-0 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
        >
          {t('view_all')}
        </Link>
      </div>
      <ul className="mt-6 space-y-4">
        {articles.map(article => (
          <li key={article.slug.value}>
            <Link
              href={newsArticlePath(article.slug)}
              className="group block rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/5"
            >
              <time
                dateTime={article.publishedAt.toISOString().slice(0, 10)}
                className="font-mono text-xs text-cyan-400/80"
              >
                {formatNewsDate(article.publishedAt, localeCode)}
              </time>
              <p className="mt-1 font-medium text-slate-100 transition-colors group-hover:text-white">
                {article.title}
              </p>
              {article.description
                ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {article.description}
                    </p>
                  )
                : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
