import type { Metadata } from 'next';
import process from 'node:process';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { PageView } from '@/presentation/content/PageView';
import { resolvePageFromParams } from '@/presentation/content/resolvePageFromParams';
import { generateSiteStaticParams } from '@/presentation/content/sitePages';
import { pageSeoMetadata, sitePathFromCatchAllSlug } from '@/utils/seoMetadata';

interface PageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export function generateStaticParams() {
  return generateSiteStaticParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const params = await props.params;

  if (!hasLocale(routing.locales, params.locale)) {
    return {};
  }

  const page = await resolvePageFromParams(params);

  if (!page) {
    return {};
  }

  const sitePath = sitePathFromCatchAllSlug(params.slug);

  return pageSeoMetadata(
    params.locale,
    sitePath,
    page.title,
    page.description || undefined,
  );
}

export default async function ContentPage(props: PageProps) {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const params = await props.params;

  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  const page = await resolvePageFromParams(params);

  if (!page) {
    notFound();
  }

  return <PageView page={page} />;
}
