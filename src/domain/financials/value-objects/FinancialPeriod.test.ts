import { describe, expect, it } from 'vitest';
import { FinancialPeriod, InvalidFinancialPeriodError } from './FinancialPeriod';

describe('financialPeriod', () => {
  it('creates a period from YYYY-MM', () => {
    const period = FinancialPeriod.create('2025-03');

    expect(period.value).toBe('2025-03');
  });

  it('rejects invalid period formats', () => {
    expect(() => FinancialPeriod.create('2025/03')).toThrow(InvalidFinancialPeriodError);
  });
});
