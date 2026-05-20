import { describe, expect, it } from 'vitest';
import { parseFinancialMarkdownFile } from './parseFinancialMarkdownFile';

describe('parseFinancialMarkdownFile', () => {
  it('parses frontmatter and body', () => {
    const parsed = parseFinancialMarkdownFile(`---
title: 第3期 貸借対照表
description: Summary
asOf: 2025-03-31
periodLabel: 第3期（2025年3月31日時点）
---
| 項目 | 金額 |
| --- | ---: |
| 資産合計 | 100 |
`);

    expect(parsed.title).toBe('第3期 貸借対照表');
    expect(parsed.periodLabel).toBe('第3期（2025年3月31日時点）');
    expect(parsed.asOf).toEqual(new Date('2025-03-31'));
    expect(parsed.body).toContain('資産合計');
  });
});
