import type { NextRequest } from 'next/server';
import process from 'node:process';

import { NextResponse } from 'next/server';
import {
  AgentSearchQuery,
  InvalidAgentSearchQueryError,
} from '@/domain/agent-search/value-objects/AgentSearchQuery';
import { Locale } from '@/domain/content/value-objects/Locale';
import { searchKnowledgeForAgentUseCase } from '@/infrastructure/agent-search/agentSearchModule';

function isAuthorized(request: NextRequest): boolean {
  const key = process.env.AGENT_SEARCH_API_KEY;

  if (!key || key.length === 0) {
    return process.env.NODE_ENV !== 'production';
  }

  const auth = request.headers.get('authorization');
  const bearer
    = auth?.toLowerCase().startsWith('bearer ')
      ? auth.slice(7).trim()
      : undefined;
  const headerKey = request.headers.get('x-api-key');

  return bearer === key || headerKey === key;
}

function maxQueryLengthFromEnv(): number {
  const raw = process.env.AGENT_SEARCH_MAX_QUERY_LENGTH;

  if (!raw) {
    return AgentSearchQuery.defaultMaxQueryLength;
  }

  const parsed = Number.parseInt(raw, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    console.warn(
      '[agent-search] Ignoring invalid AGENT_SEARCH_MAX_QUERY_LENGTH; using default',
    );

    return AgentSearchQuery.defaultMaxQueryLength;
  }

  return parsed;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  }
  catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Expected JSON object' },
      { status: 400 },
    );
  }

  const q = 'q' in body && typeof body.q === 'string' ? body.q : '';
  const localeRaw = 'locale' in body && typeof body.locale === 'string' ? body.locale : 'ja';
  const limitRaw = 'limit' in body && typeof body.limit === 'number' ? body.limit : undefined;

  let locale: Locale;

  try {
    locale = Locale.create(localeRaw);
  }
  catch {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 400 },
    );
  }

  try {
    const result = await searchKnowledgeForAgentUseCase.execute({
      q,
      locale,
      limit: limitRaw,
      maxQueryLength: maxQueryLengthFromEnv(),
    });

    return NextResponse.json({
      hits: result.hits.map(hit => ({
        sourceKind: hit.sourceKind,
        path: hit.path,
        title: hit.title,
        description: hit.description,
        snippet: hit.snippet,
      })),
    });
  }
  catch (error) {
    if (error instanceof InvalidAgentSearchQueryError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    throw error;
  }
}
