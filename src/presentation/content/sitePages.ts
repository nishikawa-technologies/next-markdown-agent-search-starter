import { AppConfig } from '@/utils/AppConfig';

export const SITE_PAGE_SLUGS = [
  'index',
  'company',
  'leadership',
  'products',
  'solutions',
  'contact',
  'privacy-policy',
  'tokushoho',
] as const;

export function generateSiteStaticParams() {
  return AppConfig.locales.flatMap(locale =>
    SITE_PAGE_SLUGS.map((slug) => {
      if (slug === 'index') {
        return { locale };
      }

      return { locale, slug: [slug] };
    }),
  );
}
