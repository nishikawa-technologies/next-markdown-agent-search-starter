import { MarkdownContent } from '@/presentation/content/MarkdownContent';

interface FinancialMarkdownContentProps {
  body: string;
}

/** 貸借対照表用。本文は GFM の4列表1つで記述する（HTML 不要）。 */
export function FinancialMarkdownContent({ body }: FinancialMarkdownContentProps) {
  return (
    <MarkdownContent
      body={body}
      className="financial-markdown"
      showTableHeaders
    />
  );
}
