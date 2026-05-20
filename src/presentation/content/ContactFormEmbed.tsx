import process from 'node:process';

const CONTACT_FORM_URL = process.env.NEXT_PUBLIC_CONTACT_FORM_EMBED_URL?.trim();

export function ContactFormEmbed() {
  if (!CONTACT_FORM_URL) {
    return (
      <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-950/40 p-6 text-sm text-amber-100/90">
        <p className="font-medium text-amber-200">Contact form not configured</p>
        <p className="mt-2 text-amber-100/80">
          Set
          {' '}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_CONTACT_FORM_EMBED_URL</code>
          {' '}
          in your environment to embed a form (for example a Google Form embed URL).
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-slate-950/50">
      <iframe
        src={CONTACT_FORM_URL}
        height={959}
        title="Contact form"
        className="w-full border-0"
        sandbox="allow-forms allow-scripts allow-same-origin" // eslint-disable-line react-dom/no-unsafe-iframe-sandbox
      >
        Loading…
      </iframe>
    </div>
  );
}
