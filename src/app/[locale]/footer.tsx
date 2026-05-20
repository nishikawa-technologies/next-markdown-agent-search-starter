import Link from 'next/link';

export const Footer = () => (
  <footer className="border-t border-white/10 bg-slate-950/60 py-10 text-center text-sm text-slate-500 backdrop-blur-sm">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <p className="font-mono text-xs tracking-wider text-slate-600 uppercase">
        © 2026 Example Corporation
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link
          href="/privacy-policy"
          className="text-slate-500 transition-colors hover:text-cyan-400"
        >
          プライバシー・ポリシー
        </Link>
        <span className="hidden text-slate-700 sm:inline" aria-hidden>
          |
        </span>
        <Link
          href="/tokushoho"
          className="text-slate-500 transition-colors hover:text-cyan-400"
        >
          特定商取引法に基づく表記
        </Link>
      </div>
    </div>
  </footer>
);
