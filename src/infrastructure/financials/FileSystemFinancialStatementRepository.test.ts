import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import { FinancialPeriod } from '@/domain/financials/value-objects/FinancialPeriod';
import { FileSystemFinancialStatementRepository } from './FileSystemFinancialStatementRepository';

describe('fileSystemFinancialStatementRepository', () => {
  let contentRoot: string;

  beforeEach(async () => {
    contentRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'financials-content-'));
    const dir = path.join(contentRoot, 'ja', 'company', 'financials');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, '2025-03.md'),
      `---
title: FY2025 BS
description: Latest
asOf: 2025-03-31
periodLabel: 第3期（2025年3月31日時点）
---
Assets
`,
      'utf8',
    );
  });

  afterEach(async () => {
    await fs.rm(contentRoot, { recursive: true, force: true });
  });

  it('lists statements for a locale', async () => {
    const repository = new FileSystemFinancialStatementRepository(contentRoot);
    const statements = await repository.listByLocale(Locale.create('ja'));

    expect(statements).toHaveLength(1);
    expect(statements[0]?.period.value).toBe('2025-03');
  });

  it('loads a statement by period', async () => {
    const repository = new FileSystemFinancialStatementRepository(contentRoot);
    const statement = await repository.findByLocaleAndPeriod(
      Locale.create('ja'),
      FinancialPeriod.create('2025-03'),
    );

    expect(statement?.title).toBe('FY2025 BS');
  });
});
