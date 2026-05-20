import type { Page } from '@/domain/content/entities/Page';
import { CompanyFinancialsSection } from '@/presentation/financials/CompanyFinancialsSection';
import { RecentNewsTeaser } from '@/presentation/news/RecentNewsTeaser';
import { ContactFormEmbed } from './ContactFormEmbed';
import { MarkdownContent } from './MarkdownContent';

interface PageViewProps {
  page: Page;
}

export async function PageView({ page }: PageViewProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm sm:p-8">
      <MarkdownContent body={page.body} />
      {page.slug.value === 'company'
        ? <CompanyFinancialsSection localeCode={page.locale.code} />
        : null}
      {page.slug.value === 'index'
        ? <RecentNewsTeaser localeCode={page.locale.code} />
        : null}
      {page.slug.value === 'contact' ? <ContactFormEmbed /> : null}
    </article>
  );
}
