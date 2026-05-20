'use client';

import Link from 'next/link';
import { usePathname } from '@/libs/I18nNavigation';

export interface SiteNavItem {
  href: string;
  label: string;
}

function normalizePath(path: string): string {
  if (path === '/') {
    return '/';
  }

  return path.endsWith('/') ? path : `${path}/`;
}

function isActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === '/') {
    return current === '/';
  }

  return current === target || current.startsWith(target);
}

export function SiteNav({ items }: { items: SiteNavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
      {items.map(item => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={[
              'rounded-lg px-3 py-2 text-sm font-medium tracking-wide transition-colors',
              isActive(pathname, item.href)
                ? 'bg-cyan-400/10 text-cyan-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
            ].join(' ')}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
