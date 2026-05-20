import type { Locale } from '@/domain/content/value-objects/Locale';
import type { FinancialStatement } from '@/domain/financials/entities/FinancialStatement';
import type { FinancialStatementRepository } from '@/domain/financials/repositories/FinancialStatementRepository';

interface ListFinancialStatementsQuery {
  locale: Locale;
}

export class ListFinancialStatementsUseCase {
  constructor(
    private readonly financialStatementRepository: FinancialStatementRepository,
  ) {}

  async execute(
    query: ListFinancialStatementsQuery,
  ): Promise<FinancialStatement[]> {
    const statements = await this.financialStatementRepository.listByLocale(
      query.locale,
    );

    return [...statements].sort(
      (a, b) => b.asOf.getTime() - a.asOf.getTime(),
    );
  }
}
