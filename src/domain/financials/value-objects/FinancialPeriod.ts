const PERIOD_PATTERN = /^\d{4}-\d{2}$/;

export class InvalidFinancialPeriodError extends Error {
  constructor(period: string) {
    super(`Invalid financial period: ${period}`);
    this.name = 'InvalidFinancialPeriodError';
  }
}

export class FinancialPeriod {
  private constructor(readonly value: string) {}

  static create(raw: string): FinancialPeriod {
    if (!PERIOD_PATTERN.test(raw)) {
      throw new InvalidFinancialPeriodError(raw);
    }

    return new FinancialPeriod(raw);
  }

  static fromFileName(fileName: string): FinancialPeriod {
    if (!fileName.endsWith('.md')) {
      throw new InvalidFinancialPeriodError(fileName);
    }

    return FinancialPeriod.create(fileName.slice(0, -3));
  }

  toFileName(): string {
    return `${this.value}.md`;
  }
}
