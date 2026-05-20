import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { SiteNav } from '@/components/SiteNav';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function SiteLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  const navItems = [
    { href: '/', label: t('home_link') },
    { href: '/news/', label: t('news_link') },
    { href: '/company/', label: t('company_link') },
    { href: '/leadership/', label: t('leadership_link') },
    { href: '/products/', label: t('products_link') },
    { href: '/solutions/', label: t('solutions_link') },
    { href: '/contact/', label: t('contact_link') },
  ];

  return (
    <BaseTemplate
      leftNav={<SiteNav items={navItems} />}
      rightNav={<LocaleSwitcher />}
    >
      {props.children}
    </BaseTemplate>
  );
}
