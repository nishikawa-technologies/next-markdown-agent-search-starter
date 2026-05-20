import type { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';

export function financialStatementPath(period: FinancialPeriod): string {
  return `/company/financials/${period.value}/`;
}

export const companyPath = '/company/';
