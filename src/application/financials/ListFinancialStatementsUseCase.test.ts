import type { FinancialStatementRepository } from '@/domain/financials/repositories/FinancialStatementRepository';
import { describe, expect, it, vi } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import { FinancialStatement } from '@/domain/financials/entities/FinancialStatement';
import { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';
import { ListFinancialStatementsUseCase } from './ListFinancialStatementsUseCase';

describe('listFinancialStatementsUseCase', () => {
  it('returns statements sorted by asOf descending', async () => {
    const older = FinancialStatement.create({
      locale: Locale.create('ja'),
      period: FinancialPeriod.create('2024-03'),
      title: 'FY2024',
      description: 'Older',
      periodLabel: '第2期',
      asOf: new Date('2024-03-31'),
      body: 'Older body',
    });
    const newer = FinancialStatement.create({
      locale: Locale.create('ja'),
      period: FinancialPeriod.create('2025-03'),
      title: 'FY2025',
      description: 'Newer',
      periodLabel: '第3期',
      asOf: new Date('2025-03-31'),
      body: 'Newer body',
    });
    const repository: FinancialStatementRepository = {
      listByLocale: vi.fn().mockResolvedValue([older, newer]),
      findByLocaleAndPeriod: vi.fn(),
    };
    const useCase = new ListFinancialStatementsUseCase(repository);

    const result = await useCase.execute({ locale: Locale.create('ja') });

    expect(result.map(statement => statement.period.value)).toEqual(['2025-03', '2024-03']);
  });
});
