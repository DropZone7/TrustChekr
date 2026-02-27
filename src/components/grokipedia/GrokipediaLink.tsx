type Props = {
  query: string;
  label?: string;
};

export function GrokipediaLink({ query, label }: Props) {
  const href = `https://grokipedia.com/?q=${encodeURIComponent(query)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-sm"
      style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)', color: 'var(--tc-primary)' }}
    >
      🤖 {label ?? 'Check this on Grokipedia'} <span style={{ color: 'var(--tc-text-muted)' }}>→</span>
    </a>
  );
}
