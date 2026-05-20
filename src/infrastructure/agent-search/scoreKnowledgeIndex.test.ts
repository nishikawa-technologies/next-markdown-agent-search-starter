import type { KnowledgeIndexEntry } from './scoreKnowledgeIndex';
import { describe, expect, it } from 'vitest';
import {
  rankKnowledgeIndexEntries,
} from './scoreKnowledgeIndex';

describe('rankKnowledgeIndexEntries', () => {
  const entries: KnowledgeIndexEntry[] = [
    {
      id: '1',
      sourceKind: 'page',
      path: '/products/',
      title: '製品一覧',
      description: '製品説明',
      text: 'ここにはソフトウェアの話がある',
    },
    {
      id: '2',
      sourceKind: 'news',
      path: '/news/foo/',
      title: 'お知らせ',
      description: 'その他',
      text: 'ソフトウェア更新のお知らせ',
    },
  ];

  it('ranks by token matches in title higher than body', () => {
    const ranked = rankKnowledgeIndexEntries(
      ['ソフトウェア'],
      'ソフトウェア',
      entries,
      10,
    );

    expect(ranked.length).toBe(2);
    expect(ranked[0]!.id).toBe('2');
  });

  it('returns empty when no tokens and no query', () => {
    const ranked = rankKnowledgeIndexEntries([], '', entries, 10);

    expect(ranked).toEqual([]);
  });
});
