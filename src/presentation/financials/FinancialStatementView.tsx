import type { FinancialStatement } from '@/domain/financials/entities/FinancialStatement';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FinancialMarkdownContent } from './FinancialMarkdownContent';
import { companyPath } from './financialPaths';

interface FinancialStatementViewProps {
  localeCode: string;
  statement: FinancialStatement;
}

export async function FinancialStatementView({
  localeCode,
  statement,
}: FinancialStatementViewProps) {
  const t = await getTranslations({ locale: localeCode, namespace: 'Financials' });

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm sm:p-8">
      <Link
        href={companyPath}
        className="font-mono text-sm text-cyan-400 transition-colors hover:text-cyan-300"
      >
        {t('back_to_company')}
      </Link>
      <p className="mt-4 font-mono text-sm text-cyan-400/80">
        {statement.periodLabel}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {statement.title}
      </h1>
      <p className="mt-4 text-sm text-slate-500">{t('disclaimer')}</p>
      <div className="mt-8">
        <FinancialMarkdownContent body={statement.body} />
      </div>
    </article>
  );
}
