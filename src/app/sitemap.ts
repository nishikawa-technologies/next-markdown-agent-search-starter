import type { MetadataRoute } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Locale } from '@/domain/content/value-objects/Locale';
import { financialStatementRepository } from '@/infrastructure/financials/financialsModule';
import { newsArticleRepository } from '@/infrastructure/news/newsModule';
import { SITE_PAGE_SLUGS } from '@/presentation/content/sitePages';
import { newsListPath } from '@/presentation/news/newsPaths';
import { agentDiscoveryPaths } from '@/utils/agentDiscovery';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

async function contentPageLastModified(
  localeCode: string,
  slug: (typeof SITE_PAGE_SLUGS)[number],
): Promise<Date> {
  const fileName = slug === 'index' ? 'index.md' : `${slug}.md`;
  const filePath = path.join(process.cwd(), 'content', localeCode, fileName);

  try {
    const st = await fs.stat(filePath);

    return st.mtime;
  }
  catch {
    return new Date();
  }
}

async function newsIndexLastModified(localeCode: string): Promise<Date> {
  const newsDir = path.join(process.cwd(), 'content', localeCode, 'news');

  try {
    const names = await fs.readdir(newsDir);
    const mtimes = await Promise.all(
      names
        .filter(n => n.endsWith('.md') && n !== 'index.md')
        .map(async (name) => {
          const st = await fs.stat(path.join(newsDir, name));

          return st.mtime.getTime();
        }),
    );

    if (mtimes.length === 0) {
      return new Date();
    }

    return new Date(Math.max(...mtimes));
  }
  catch {
    return new Date();
  }
}

async function agentIndexLastModified(): Promise<Date> {
  const indexPath = path.join(process.cwd(), 'public', 'agent-search-index.json');

  try {
    const raw = await fs.readFile(indexPath, 'utf8');
    const parsed = JSON.parse(raw) as { generatedAt?: string };

    if (parsed.generatedAt) {
      return new Date(parsed.generatedAt);
    }
  }
  catch {
    // index may be missing until prebuild
  }

  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];
  const indexLastMod = await agentIndexLastModified();

  entries.push(
    {
      url: `${baseUrl}${agentDiscoveryPaths.llmsTxt}`,
      lastModified: indexLastMod,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}${agentDiscoveryPaths.knowledgeSpec}`,
      lastModified: indexLastMod,
      changeFrequency: 'monthly',
      priority: 0.35,
    },
    {
      url: `${baseUrl}${agentDiscoveryPaths.knowledgeIndex}`,
      lastModified: indexLastMod,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
  );

  for (const localeCode of AppConfig.locales) {
    const localePrefix = localeCode === AppConfig.defaultLocale ? '' : `/${localeCode}`;

    for (const slug of SITE_PAGE_SLUGS) {
      const path
        = slug === 'index'
          ? localePrefix || '/'
          : `${localePrefix}/${slug}/`;

      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: await contentPageLastModified(localeCode, slug),
        changeFrequency: 'monthly',
        priority: slug === 'index' ? 1 : 0.7,
      });
    }

    entries.push({
      url: `${baseUrl}${localePrefix}${newsListPath}`,
      lastModified: await newsIndexLastModified(localeCode),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    const locale = Locale.create(localeCode);
    const articles = await newsArticleRepository.listByLocale(locale);

    for (const article of articles) {
      entries.push({
        url: `${baseUrl}${localePrefix}/news/${article.slug.value}/`,
        lastModified: article.publishedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    const statements = await financialStatementRepository.listByLocale(locale);

    for (const statement of statements) {
      entries.push({
        url: `${baseUrl}${localePrefix}/company/financials/${statement.period.value}/`,
        lastModified: statement.asOf,
        changeFrequency: 'yearly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
