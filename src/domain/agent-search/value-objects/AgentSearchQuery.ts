import type { Locale } from '@/domain/content/value-objects/Locale';

export class InvalidAgentSearchQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAgentSearchQueryError';
  }
}

interface CreateAgentSearchQueryParams {
  q: string;
  locale: Locale;
  limit?: number;
  maxQueryLength?: number;
}

export class AgentSearchQuery {
  private static readonly maxLimit = 50;
  private static readonly defaultLimit = 10;
  static readonly defaultMaxQueryLength = 300;

  private constructor(
    /** 正規化済み（小文字・連続空白圧縮）全文検索用 */
    readonly normalizedQuery: string,
    readonly tokens: string[],
    readonly locale: Locale,
    readonly limit: number,
  ) {}

  static create(params: CreateAgentSearchQueryParams): AgentSearchQuery {
    const raw = params.q.trim().replace(/\s+/g, ' ');

    const maxQueryLength = params.maxQueryLength
      ?? AgentSearchQuery.defaultMaxQueryLength;
    if (!Number.isInteger(maxQueryLength) || maxQueryLength < 1) {
      throw new InvalidAgentSearchQueryError(
        'maxQueryLength must be a positive integer',
      );
    }

    if (raw.length > maxQueryLength) {
      throw new InvalidAgentSearchQueryError(
        `q must be ${maxQueryLength} characters or fewer`,
      );
    }

    const normalizedQuery = raw.toLowerCase();
    const tokens = normalizedQuery.length > 0
      ? normalizedQuery.split(' ').filter(Boolean)
      : [];

    const limitRaw = params.limit ?? AgentSearchQuery.defaultLimit;
    if (!Number.isInteger(limitRaw) || limitRaw < 1 || limitRaw > AgentSearchQuery.maxLimit) {
      throw new InvalidAgentSearchQueryError(
        `limit must be an integer between 1 and ${AgentSearchQuery.maxLimit}`,
      );
    }

    return new AgentSearchQuery(normalizedQuery, tokens, params.locale, limitRaw);
  }
}
