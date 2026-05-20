'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 py-6 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <Link href="/" className="group block min-w-0">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 object-contain invert transition-opacity group-hover:opacity-90"
                    priority
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
                      {AppConfig.name}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-cyan-400/80 sm:text-sm">
                      {t('description')}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="shrink-0 pt-1">{props.rightNav}</div>
            </div>
            <nav aria-label="Main">{props.leftNav}</nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {props.children}
      </main>
    </div>
  );
};
