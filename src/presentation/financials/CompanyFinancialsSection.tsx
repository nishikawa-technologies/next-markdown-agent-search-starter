import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Locale } from '@/domain/content/value-objects/Locale';
import { listFinancialStatementsUseCase } from '@/infrastructure/financials/financialsModule';
import { financialStatementPath } from './financialPaths';

interface CompanyFinancialsSectionProps {
  localeCode: string;
}

export async function CompanyFinancialsSection({
  localeCode,
}: CompanyFinancialsSectionProps) {
  const locale = Locale.create(localeCode);
  const t = await getTranslations({ locale: localeCode, namespace: 'Financials' });
  const statements = await listFinancialStatementsUseCase.execute({ locale });

  if (statements.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        {t('section_heading')}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {t('section_intro')}
      </p>
      <ul className="mt-6 space-y-3">
        {statements.map(statement => (
          <li key={statement.period.value}>
            <Link
              href={financialStatementPath(statement.period)}
              className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/40 px-4 py-3 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/5"
            >
              <span className="font-medium text-slate-100 group-hover:text-white">
                {statement.periodLabel}
              </span>
              <span className="font-mono text-xs text-cyan-400/80">
                {t('view_balance_sheet')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
