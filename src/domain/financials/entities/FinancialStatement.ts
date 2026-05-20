import type { FinancialPeriod } from '../value-objects/FinancialPeriod';
import type { Locale } from '@/domain/content/value-objects/Locale';

interface CreateFinancialStatementParams {
  locale: Locale;
  period: FinancialPeriod;
  title: string;
  description: string;
  periodLabel: string;
  asOf: Date;
  body: string;
}

export class FinancialStatement {
  private constructor(
    readonly locale: Locale,
    readonly period: FinancialPeriod,
    readonly title: string,
    readonly description: string,
    readonly periodLabel: string,
    readonly asOf: Date,
    readonly body: string,
  ) {}

  static create(params: CreateFinancialStatementParams): FinancialStatement {
    return new FinancialStatement(
      params.locale,
      params.period,
      params.title,
      params.description,
      params.periodLabel,
      params.asOf,
      params.body,
    );
  }
}
