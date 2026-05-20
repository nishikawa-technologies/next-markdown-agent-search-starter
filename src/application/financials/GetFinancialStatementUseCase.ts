import type { Locale } from '@/domain/content/value-objects/Locale';
import type { FinancialStatement } from '@/domain/financials/entities/FinancialStatement';
import type { FinancialStatementRepository } from '@/domain/financials/repositories/FinancialStatementRepository';
import type { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';
import { FinancialStatementNotFoundError } from './FinancialStatementNotFoundError';

interface GetFinancialStatementQuery {
  locale: Locale;
  period: FinancialPeriod;
}

export class GetFinancialStatementUseCase {
  constructor(
    private readonly financialStatementRepository: FinancialStatementRepository,
  ) {}

  async execute(query: GetFinancialStatementQuery): Promise<FinancialStatement> {
    const statement = await this.financialStatementRepository.findByLocaleAndPeriod(
      query.locale,
      query.period,
    );

    if (!statement) {
      throw new FinancialStatementNotFoundError(query.locale, query.period);
    }

    return statement;
  }
}
