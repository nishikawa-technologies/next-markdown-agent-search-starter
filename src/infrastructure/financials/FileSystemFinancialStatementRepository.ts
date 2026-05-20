import type { Locale } from '@/domain/content/value-objects/Locale';
import type { FinancialStatementRepository } from '@/domain/financials/repositories/FinancialStatementRepository';
import type { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';
import fs from 'node:fs/promises';
import path from 'node:path';
import { FinancialStatement } from '@/domain/financials/entities/FinancialStatement';
import { FinancialPeriod as FinancialPeriodFactory } from '@/domain/financials/value-objects/FinancialPeriod';
import { parseFinancialMarkdownFile } from './parseFinancialMarkdownFile';

export class FileSystemFinancialStatementRepository implements FinancialStatementRepository {
  constructor(private readonly contentRoot: string) {}

  async listByLocale(locale: Locale): Promise<FinancialStatement[]> {
    const financialsDir = this.financialsDirFor(locale);
    const entries = await this.readPeriodFileNames(financialsDir);
    const statements = await Promise.all(
      entries.map(fileName => this.loadStatement(locale, fileName)),
    );

    return statements.filter(
      (statement): statement is FinancialStatement => statement !== null,
    );
  }

  async findByLocaleAndPeriod(
    locale: Locale,
    period: FinancialPeriod,
  ): Promise<FinancialStatement | null> {
    return this.loadStatement(locale, period.toFileName());
  }

  private financialsDirFor(locale: Locale): string {
    return path.join(this.contentRoot, locale.code, 'company', 'financials');
  }

  private async readPeriodFileNames(financialsDir: string): Promise<string[]> {
    try {
      const entries = await fs.readdir(financialsDir);
      return entries.filter(name => name.endsWith('.md'));
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  private async loadStatement(
    locale: Locale,
    fileName: string,
  ): Promise<FinancialStatement | null> {
    const filePath = path.join(this.financialsDirFor(locale), fileName);

    try {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = parseFinancialMarkdownFile(source);
      const period = FinancialPeriodFactory.fromFileName(fileName);

      return FinancialStatement.create({
        locale,
        period,
        title: parsed.title,
        description: parsed.description,
        periodLabel: parsed.periodLabel,
        asOf: parsed.asOf,
        body: parsed.body,
      });
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }

      throw error;
    }
  }
}
