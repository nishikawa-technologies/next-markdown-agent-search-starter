import type { Metadata } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

/** サイト内パス（先頭スラッシュ、末尾スラッシュ。トップは `/`） */
export function normalizeSitePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  const lead = path.startsWith('/') ? path : `/${path}`;

  return lead.endsWith('/') ? lead : `${lead}/`;
}

function baseUrlNoTrailingSlash(): string {
  return getBaseUrl().trim().replace(/\/$/, '');
}

/**
 * 同一ページの ja / en URL（defaultLocale はプレフィックスなし）。
 */
export function alternateLanguageRecords(sitePath: string): Record<string, string> {
  const base = baseUrlNoTrailingSlash();
  const norm = normalizeSitePath(sitePath);
  const defaultLocale = AppConfig.defaultLocale;

  const defaultPath = norm;
  const defaultUrl
    = defaultPath === '/'
      ? `${base}/`
      : `${base}${defaultPath}`;

  const otherLocales = AppConfig.locales.filter(l => l !== defaultLocale);
  const out: Record<string, string> = {};

  out[defaultLocale] = defaultUrl;

  for (const loc of otherLocales) {
    const prefixed
      = norm === '/'
        ? `/${loc}/`
        : `/${loc}${norm}`;
    out[loc] = `${base}${prefixed}`;
  }

  out['x-default'] = defaultUrl;

  return out;
}

export function canonicalUrlForLocale(locale: string, sitePath: string): string {
  const map = alternateLanguageRecords(sitePath);

  return map[locale] ?? map[AppConfig.defaultLocale] ?? `${baseUrlNoTrailingSlash()}/`;
}

export interface PageSeoOptions {
  openGraphType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * canonical・hreflang・OG・Twitter をまとめて返す。
 */
export function pageSeoMetadata(
  locale: string,
  sitePath: string,
  title: string,
  description: string | undefined,
  options?: PageSeoOptions,
): Metadata {
  const canonical = canonicalUrlForLocale(locale, sitePath);
  const languages = alternateLanguageRecords(sitePath);
  const ogLocale = locale === 'ja' ? 'ja_JP' : 'en_US';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: AppConfig.name,
      locale: ogLocale,
      type: options?.openGraphType ?? 'website',
      ...(options?.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(options?.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/** `[[...slug]]` の params.slug からサイトパスへ */
export function sitePathFromCatchAllSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) {
    return '/';
  }

  if (slug.length === 1 && slug[0]) {
    return `/${slug[0]}/`;
  }

  return `/${slug.join('/')}/`;
}
