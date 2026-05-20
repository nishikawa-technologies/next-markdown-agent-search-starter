import { describe, expect, it } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import {
  AgentSearchQuery,
  InvalidAgentSearchQueryError,
} from './AgentSearchQuery';

describe('agentSearchQuery', () => {
  it('parses trimmed query and tokens', () => {
    const locale = Locale.create('ja');
    const q = AgentSearchQuery.create({ q: '  AI PoC ', locale });

    expect(q.normalizedQuery).toBe('ai poc');
    expect(q.tokens).toEqual(['ai', 'poc']);
    expect(q.limit).toBe(10);
  });

  it('rejects invalid limit', () => {
    const locale = Locale.create('ja');

    expect(() => AgentSearchQuery.create({ q: 'x', locale, limit: 0 })).toThrow(
      InvalidAgentSearchQueryError,
    );
    expect(() => AgentSearchQuery.create({ q: 'x', locale, limit: 51 })).toThrow(
      InvalidAgentSearchQueryError,
    );
  });
});
