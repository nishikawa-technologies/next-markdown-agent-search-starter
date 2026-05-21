import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AgentDiscoveryHeadLinks } from '@/components/AgentDiscoveryHeadLinks';
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { routing } from '@/libs/I18nRouting';
import { notoSansJp } from '@/styles/fonts';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { Footer } from './footer';
import '@/styles/global.css';

const metadataBaseUrl = getBaseUrl().trim().replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: AppConfig.name,
  openGraph: {
    type: 'website',
    siteName: AppConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={notoSansJp.className}>
      <head>
        <AgentDiscoveryHeadLinks />
      </head>
      <body>
        <OrganizationJsonLd />
        <NextIntlClientProvider>
          {props.children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
