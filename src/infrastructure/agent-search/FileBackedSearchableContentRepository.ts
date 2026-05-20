import type { KnowledgeIndexEntry } from './scoreKnowledgeIndex';
import type { SearchableContentRepository } from '@/domain/agent-search/repositories/SearchableContentRepository';
import type { AgentSearchQuery } from '@/domain/agent-search/value-objects/AgentSearchQuery';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { AgentSearchResult } from '@/domain/agent-search/entities/AgentSearchResult';
import { SearchHit } from '@/domain/agent-search/entities/SearchHit';
import { makeSnippet, rankKnowledgeIndexEntries } from './scoreKnowledgeIndex';

interface AgentSearchIndexFile {
  readonly version: number;
  readonly generatedAt?: string;
  readonly locales: Record<string, KnowledgeIndexEntry[]>;
}

export class FileBackedSearchableContentRepository implements SearchableContentRepository {
  constructor(private readonly indexFilePath?: string) {}

  private resolvedPath(): string {
    return this.indexFilePath
      ?? path.join(process.cwd(), 'public', 'agent-search-index.json');
  }

  async search(query: AgentSearchQuery): Promise<AgentSearchResult> {
    let raw: string;

    try {
      raw = await fs.readFile(this.resolvedPath(), 'utf8');
    }
    catch {
      return AgentSearchResult.empty();
    }

    const parsed = JSON.parse(raw) as AgentSearchIndexFile;
    const entriesForLocale = parsed.locales?.[query.locale.code] ?? [];

    const ranked = rankKnowledgeIndexEntries(
      query.tokens,
      query.normalizedQuery,
      entriesForLocale,
      query.limit,
    );

    const hits = ranked.map(entry =>
      SearchHit.create({
        sourceKind: entry.sourceKind,
        path: entry.path,
        title: entry.title,
        description: entry.description,
        snippet: makeSnippet(query.tokens, `${entry.title} ${entry.description} ${entry.text}`),
      }),
    );

    return AgentSearchResult.create(hits);
  }
}
