import type { KnowledgeSourceKind } from '../value-objects/KnowledgeSourceKind';

interface CreateSearchHitParams {
  sourceKind: KnowledgeSourceKind;
  path: string;
  title: string;
  description: string;
  snippet: string;
}

export class SearchHit {
  private constructor(
    readonly sourceKind: KnowledgeSourceKind,
    readonly path: string,
    readonly title: string,
    readonly description: string,
    readonly snippet: string,
  ) {}

  static create(params: CreateSearchHitParams): SearchHit {
    return new SearchHit(
      params.sourceKind,
      params.path,
      params.title,
      params.description,
      params.snippet,
    );
  }
}
