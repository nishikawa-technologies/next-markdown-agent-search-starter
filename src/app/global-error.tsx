'use client';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-950 px-4 py-16 font-sans text-slate-300 antialiased">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          Error
        </p>
        <p className="mt-4 text-lg text-white">Something went wrong</p>
        <p className="mt-2 text-sm text-slate-500">{props.error.message}</p>
        <button
          type="button"
          onClick={() => props.reset()}
          className="mt-6 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/20"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
