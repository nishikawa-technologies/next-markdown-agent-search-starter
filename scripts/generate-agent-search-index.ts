/**
 * ビルド時: content/ からエージェント検索用インデックス JSON を生成する。
 * `npm run generate:agent-search-index` または `npm run build` から実行。
 */

import type { KnowledgeIndexEntry } from '../src/infrastructure/agent-search/scoreKnowledgeIndex';
import fs from 'node:fs/promises';
import path from 'node:path';

import process from 'node:process';
import { stripMarkdownForIndex } from '../src/infrastructure/agent-search/stripMarkdownForIndex';
import { parseMarkdownFile } from '../src/infrastructure/content/parseMarkdownFile';
import { parseFinancialMarkdownFile } from '../src/infrastructure/financials/parseFinancialMarkdownFile';
import { parseNewsMarkdownFile } from '../src/infrastructure/news/parseNewsMarkdownFile';
import { SITE_PAGE_SLUGS } from '../src/presentation/content/sitePages';
import { AppConfig } from '../src/utils/AppConfig';
import { getI18nPath } from '../src/utils/Helpers';

async function collectLocale(localeCode: string, root: string): Promise<KnowledgeIndexEntry[]> {
  const list: KnowledgeIndexEntry[] = [];

  for (const slug of SITE_PAGE_SLUGS) {
    const fileName = slug === 'index' ? 'index.md' : `${slug}.md`;
    const filePath = path.join(root, 'content', localeCode, fileName);
    let source: string;

    try {
      source = await fs.readFile(filePath, 'utf8');
    }
    catch {
      console.warn(`[agent-search-index] skip missing: ${filePath}`);

      continue;
    }

    try {
      const parsed = parseMarkdownFile(source);
      const sitePath = slug === 'index' ? '/' : `/${slug}/`;
      const urlPath = getI18nPath(sitePath, localeCode);
      const text = stripMarkdownForIndex(parsed.body);

      list.push({
        id: `page:${localeCode}:${slug}`,
        sourceKind: 'page',
        path: urlPath,
        title: parsed.title,
        description: parsed.description,
        text: `${parsed.title} ${parsed.description} ${text}`,
      });
    }
    catch (error) {
      console.warn(`[agent-search-index] parse error: ${filePath}`, error);
    }
  }

  const newsDir = path.join(root, 'content', localeCode, 'news');
  let newsFiles: string[] = [];

  try {
    newsFiles = await fs.readdir(newsDir);
  }
  catch {
    // ディレクトリなしはスキップ
  }

  for (const name of newsFiles) {
    if (!name.endsWith('.md') || name === 'index.md') {
      continue;
    }

    const articleSlug = name.slice(0, -3);
    const filePath = path.join(newsDir, name);

    try {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = parseNewsMarkdownFile(source);
      const urlPath = getI18nPath(`/news/${articleSlug}/`, localeCode);
      const text = stripMarkdownForIndex(parsed.body);

      list.push({
        id: `news:${localeCode}:${articleSlug}`,
        sourceKind: 'news',
        path: urlPath,
        title: parsed.title,
        description: parsed.description,
        text: `${parsed.title} ${parsed.description} ${text}`,
      });
    }
    catch (error) {
      console.warn(`[agent-search-index] parse error: ${filePath}`, error);
    }
  }

  const financialsDir = path.join(root, 'content', localeCode, 'company', 'financials');
  let periods: string[] = [];

  try {
    periods = await fs.readdir(financialsDir);
  }
  catch {
    // なし
  }

  for (const name of periods) {
    if (!name.endsWith('.md')) {
      continue;
    }

    const period = name.slice(0, -3);
    const filePath = path.join(financialsDir, name);

    try {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = parseFinancialMarkdownFile(source);
      const urlPath = getI18nPath(`/company/financials/${period}/`, localeCode);
      const text = stripMarkdownForIndex(parsed.body);

      list.push({
        id: `financial:${localeCode}:${period}`,
        sourceKind: 'financial',
        path: urlPath,
        title: parsed.title,
        description: parsed.description,
        text: `${parsed.title} ${parsed.description} ${parsed.periodLabel} ${text}`,
      });
    }
    catch (error) {
      console.warn(`[agent-search-index] parse error: ${filePath}`, error);
    }
  }

  return list;
}

async function main(): Promise<void> {
  const root = process.cwd();
  const locales: Record<string, KnowledgeIndexEntry[]> = {};

  for (const localeCode of AppConfig.locales) {
    locales[localeCode] = await collectLocale(localeCode, root);
  }

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    locales,
  };

  const outPath = path.join(root, 'public', 'agent-search-index.json');
  await fs.writeFile(outPath, `${JSON.stringify(payload)}\n`, 'utf8');

  const count = Object.values(locales).reduce((a, b) => a + b.length, 0);
  console.warn(`[agent-search-index] wrote ${outPath} (${count} entries)`);
}

main().catch((error) => {
  console.error('[agent-search-index] failed', error);
  process.exit(1);
});
