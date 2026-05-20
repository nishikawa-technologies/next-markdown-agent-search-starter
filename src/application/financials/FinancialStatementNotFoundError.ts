import type { Locale } from '@/domain/content/value-objects/Locale';
import type { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';

export class FinancialStatementNotFoundError extends Error {
  constructor(locale: Locale, period: FinancialPeriod) {
    super(`Financial statement not found: ${locale.code}/company/financials/${period.value}`);
    this.name = 'FinancialStatementNotFoundError';
  }
}
