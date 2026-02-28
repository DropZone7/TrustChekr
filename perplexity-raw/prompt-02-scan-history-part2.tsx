// PERPLEXITY RAW — Prompt 2 Part 2: Logic + JSX start
// Known issues: missing || operators (Perplexity stripped them)

function saveHistory(items: ScanHistoryItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore quota / private mode errors
  }
}

export function removeScanHistoryItem(id: string) {
  if (typeof window === 'undefined') return;
  const existing = safeLoadHistory();
  const next = existing.filter((item) => item.id !== id);
  saveHistory(next);
}

export function ScanHistory({ onRescan, hideClearAll }: ScanHistoryProps) {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ScanType | 'all'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setItems(safeLoadHistory());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveHistory(items);
    }
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch =
        !search.trim() ||
        item.input.toLowerCase().includes(search.toLowerCase()) ||
        item.riskLevel.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [items, search, typeFilter]);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setItems([]);
    setConfirmClear(false);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    removeScanHistoryItem(id);
  };

  const exportCsv = () => {
    if (!items.length) return;
    const headers = ['id', 'type', 'input', 'riskLevel', 'createdAt'];
    const lines = [headers.join(',')];
    for (const item of items) {
      const row = [
        item.id,
        item.type,
        `"${item.input.replace(/"/g, '""')}"`,
        item.riskLevel,
        item.createdAt,
      ];
      lines.push(row.join(','));
    }
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trustchekr-scan-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncate = (text: string, max = 80) => {
    if (text.length <= max) return text;
    return text.slice(0, max - 1) + '…';
  };

  return (
    <section
      aria-label="Recent scans"
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '1.25rem 1rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--tc-border, #e5e7eb)',
        background: 'var(--tc-surface, #ffffff)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '18px',
        color: '#111827',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          marginBottom: '1rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.3rem',
            fontWeight: 600,
            color: 'var(--tc-primary, #1a5276)',
          }}
        >
          Recent scans
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            color: 'var(--tc-text-muted, #6b7280)',
          }}
        >
          Stored locally in your browser, up to 50 entries. No signup required.
        </p>
      </header>

      {/* CONTINUES IN NEXT PART — need filter bar, list items, empty state */}
