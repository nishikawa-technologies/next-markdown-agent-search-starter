import type { Metadata } from 'next';
import process from 'node:process';
import { setRequestLocale } from 'next-intl/server';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { FinancialStatementNotFoundError } from '@/application/financials/FinancialStatementNotFoundError';
import { Locale } from '@/domain/content/value-objects/Locale';
import { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';
import { getFinancialStatementUseCase } from '@/infrastructure/financials/financialsModule';
import { FinancialStatementView } from '@/presentation/financials/FinancialStatementView';
import { generateFinancialStatementStaticParams } from '@/presentation/financials/generateFinancialStaticParams';
import { pageSeoMetadata } from '@/utils/seoMetadata';

interface FinancialStatementPageProps {
  params: Promise<{ locale: string; period: string }>;
}

export function generateStaticParams() {
  return generateFinancialStatementStaticParams();
}

export async function generateMetadata(
  props: FinancialStatementPageProps,
): Promise<Metadata> {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const { locale: localeCode, period } = await props.params;

  try {
    const statement = await getFinancialStatementUseCase.execute({
      locale: Locale.create(localeCode),
      period: FinancialPeriod.create(period),
    });

    const modifiedTime = statement.asOf.toISOString();

    return pageSeoMetadata(
      localeCode,
      `/company/financials/${period}/`,
      statement.title,
      statement.description || undefined,
      {
        openGraphType: 'website',
        modifiedTime,
      },
    );
  }
  catch {
    return {};
  }
}

export default async function FinancialStatementPage(
  props: FinancialStatementPageProps,
) {
  if (process.env.NODE_ENV === 'development') {
    noStore();
  }

  const { locale: localeCode, period } = await props.params;
  setRequestLocale(localeCode);

  try {
    const statement = await getFinancialStatementUseCase.execute({
      locale: Locale.create(localeCode),
      period: FinancialPeriod.create(period),
    });

    return (
      <FinancialStatementView
        localeCode={localeCode}
        statement={statement}
      />
    );
  }
  catch (error) {
    if (error instanceof FinancialStatementNotFoundError) {
      notFound();
    }

    throw error;
  }
}
