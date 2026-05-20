import process from 'node:process';
import { routing } from '@/libs/I18nRouting';

/** `metadataBase` / canonical 用。誤設定の `NEXT_PUBLIC_APP_URL` でビルドが落ちないように検証する */
function isHttpOrHttpsAbsoluteUrl(candidate: string): boolean {
  try {
    const u = new URL(candidate);

    return u.protocol === 'http:' || u.protocol === 'https:';
  }
  catch {
    return false;
  }
}

let didWarnInvalidPublicAppUrl = false;

export const getBaseUrl = () => {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (fromEnv) {
    if (isHttpOrHttpsAbsoluteUrl(fromEnv)) {
      return fromEnv;
    }

    if (!didWarnInvalidPublicAppUrl) {
      didWarnInvalidPublicAppUrl = true;
      console.warn(
        '[getBaseUrl] Ignoring invalid NEXT_PUBLIC_APP_URL (expected http:// or https:// absolute URL)',
      );
    }
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};
