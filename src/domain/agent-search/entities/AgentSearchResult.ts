import type { SearchHit } from './SearchHit';

export class AgentSearchResult {
  private constructor(readonly hits: SearchHit[]) {}

  static create(hits: SearchHit[]): AgentSearchResult {
    return new AgentSearchResult([...hits]);
  }

  static empty(): AgentSearchResult {
    return new AgentSearchResult([]);
  }
}
