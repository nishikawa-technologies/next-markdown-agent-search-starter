import type { FinancialStatement } from '../entities/FinancialStatement';
import type { FinancialPeriod } from '../value-objects/FinancialPeriod';
import type { Locale } from '@/domain/content/value-objects/Locale';

export interface FinancialStatementRepository {
  listByLocale: (locale: Locale) => Promise<FinancialStatement[]>;
  findByLocaleAndPeriod: (
    locale: Locale,
    period: FinancialPeriod,
  ) => Promise<FinancialStatement | null>;
}
