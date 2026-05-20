import type { AgentSearchResult } from '../entities/AgentSearchResult';
import type { AgentSearchQuery } from '../value-objects/AgentSearchQuery';

export interface SearchableContentRepository {
  search: (query: AgentSearchQuery) => Promise<AgentSearchResult>;
}
