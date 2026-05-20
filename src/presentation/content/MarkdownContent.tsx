import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  body: string;
  className?: string;
  /** 貸借対照表など、ヘッダー行を表示する表向け */
  showTableHeaders?: boolean;
}

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || typeof children === 'boolean') {
    return false;
  }

  if (typeof children === 'string') {
    return children.trim().length > 0;
  }

  if (Array.isArray(children)) {
    return children.some(hasVisibleContent);
  }

  return true;
}

export function MarkdownContent({
  body,
  className,
  showTableHeaders = false,
}: MarkdownContentProps) {
  const rootClass = [
    'markdown-tech',
    '[&>table:first-child]:mt-0',
    '[&>p:first-child]:mt-0',
    '[&>h1:first-child]:mt-0',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => {
            if (!hasVisibleContent(children)) {
              return null;
            }

            return <p>{children}</p>;
          },
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          thead: ({ children }) => (
            <thead className={showTableHeaders ? undefined : 'sr-only'}>
              {children}
            </thead>
          ),
          table: ({ children }) => (
            showTableHeaders
              ? (
                  <div className="overflow-x-auto">
                    <table>{children}</table>
                  </div>
                )
              : (
                  <table>{children}</table>
                )
          ),
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,
          strong: ({ children }) => <strong>{children}</strong>,
          a: ({ children, href }) => (
            <a href={href}>{children}</a>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
