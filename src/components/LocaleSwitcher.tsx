'use client';

import type { ChangeEventHandler } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh();
  };

  return (
    <select
      defaultValue={locale}
      onChange={handleChange}
      aria-label="lang-switcher"
      className={[
        'cursor-pointer rounded-lg border border-white/10 bg-slate-900/80',
        'px-3 py-2 text-sm font-medium text-slate-300',
        'outline-none transition-colors',
        'hover:border-cyan-400/30 hover:text-cyan-400',
        'focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20',
      ].join(' ')}
    >
      {routing.locales.map(elt => (
        <option key={elt} value={elt} className="bg-slate-900 text-slate-200">
          {elt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
