import type { AgentSearchResult } from '@/domain/agent-search/entities/AgentSearchResult';
import type { SearchableContentRepository } from '@/domain/agent-search/repositories/SearchableContentRepository';
import type { Locale } from '@/domain/content/value-objects/Locale';
import { AgentSearchQuery } from '@/domain/agent-search/value-objects/AgentSearchQuery';

interface SearchKnowledgeForAgentQuery {
  q: string;
  locale: Locale;
  limit?: number;
  maxQueryLength?: number;
}

export class SearchKnowledgeForAgentUseCase {
  constructor(private readonly repository: SearchableContentRepository) {}

  async execute(input: SearchKnowledgeForAgentQuery): Promise<AgentSearchResult> {
    const query = AgentSearchQuery.create({
      q: input.q,
      locale: input.locale,
      limit: input.limit,
      maxQueryLength: input.maxQueryLength,
    });

    return this.repository.search(query);
  }
}
