import type { KnowledgeSourceKind } from '@/domain/agent-search/value-objects/KnowledgeSourceKind';

export interface KnowledgeIndexEntry {
  readonly id: string;
  readonly sourceKind: KnowledgeSourceKind;
  /** サイトパス（先頭・末尾スラッシュ付き、アプリのリンクと同等） */
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly text: string;
}

interface Scored extends KnowledgeIndexEntry {
  readonly score: number;
}

/** スコア + ヒット一覧（テスト用に export） */
export function rankKnowledgeIndexEntries(
  queryTokens: string[],
  normalizedFullQuery: string,
  entriesForLocale: KnowledgeIndexEntry[],
  limit: number,
): KnowledgeIndexEntry[] {
  if (queryTokens.length === 0 && !normalizedFullQuery) {
    return [];
  }

  const hayEntries: Scored[] = entriesForLocale.map((entry) => {
    const title = entry.title.toLowerCase();
    const description = entry.description.toLowerCase();
    const text = entry.text.toLowerCase();

    let score = 0;

    // 完全一致フレーズ
    if (normalizedFullQuery && normalizedFullQuery.length >= 2) {
      if (title.includes(normalizedFullQuery)) {
        score += 40;
      }
      if (description.includes(normalizedFullQuery)) {
        score += 25;
      }
      if (text.includes(normalizedFullQuery)) {
        score += 12;
      }
    }

    for (const token of queryTokens) {
      if (token.length < 2) {
        continue;
      }
      const inTitle = (title.match(new RegExp(escapeRegex(token), 'g')) ?? []).length;
      const inDesc = (description.match(new RegExp(escapeRegex(token), 'g')) ?? []).length;
      const inText = (text.match(new RegExp(escapeRegex(token), 'g')) ?? []).length;
      score += inTitle * 15;
      score += inDesc * 8;
      score += inText * 2;
    }

    return { ...entry, score };
  });

  const positive = hayEntries.filter(e => e.score > 0);
  positive.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.path.localeCompare(b.path);
  });

  return positive.slice(0, limit).map(({ score: _score, ...rest }) => rest);
}

function escapeRegex(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** ヒット本文の一部を抜粋 */
export function makeSnippet(normalizedTokens: string[], text: string, maxLen = 280): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  if (!plain.length) {
    return '';
  }

  const lower = plain.toLowerCase();
  let pos = -1;

  for (const t of normalizedTokens) {
    if (t.length < 2) {
      continue;
    }
    const i = lower.indexOf(t);

    if (i >= 0) {
      pos = i;

      break;
    }
  }

  if (pos < 0) {
    pos = 0;
  }

  const start = Math.max(0, pos - Math.floor(maxLen / 4));
  const slice = plain.slice(start, start + maxLen);

  const prefix = start > 0 ? '…' : '';

  const suffix = start + slice.length < plain.length ? '…' : '';

  return `${prefix}${slice}${suffix}`;
}
