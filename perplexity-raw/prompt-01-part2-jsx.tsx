// PERPLEXITY RAW — Prompt 1 Part 2: JSX return
// ISSUES FOUND:
// 1. Uses "Likely safe" — must change to "Low Risk" (Moffatt compliance)
// 2. Uses <style jsx global> — not supported in Next.js App Router server components
// 3. Dark mode vars conflict with existing DarkModeToggle

  return (
    <>
      <style jsx global>{`
        :root {
          --tc-primary: #1a5276;
          --tc-surface: #ffffff;
          --tc-border: #e5e7eb;
          --tc-text-main: #1a1a1a;
          --tc-text-muted: #6b7280;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --tc-surface: #0f0f23;
            --tc-border: #27293d;
            --tc-text-main: #f8fafc;
            --tc-text-muted: #94a3b8;
          }
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          padding: '2rem 1rem',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '18px',
          lineHeight: 1.6,
          color: 'var(--tc-text-main)',
          background: 'var(--tc-surface)',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: '0 0 1rem',
              color: 'var(--tc-primary)',
            }}
          >
            {domain} Trust Score
          </h1>

          <div
            style={{
              width: '240px',
              height: '240px',
              margin: '0 auto 2rem',
              borderRadius: '50%',
              background: `conic-gradient(${scoreColor} 0deg ${trustScore * 3.6}deg, #e5e7eb ${trustScore * 3.6}deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'var(--tc-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: '3rem',
                fontWeight: 800,
                color: scoreColor,
              }}
            >
              {trustScore}
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--tc-text-muted)',
                  marginTop: '0.25rem',
                }}
              >
                / 100
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: '1.125rem',
              margin: 0,
              opacity: 0.9,
            }}
          >
            {trustScore > 60
              ? 'Likely safe' // BUG: Must change to "Low Risk"
              : trustScore > 30
              ? 'Caution advised'
              : 'High risk detected'}
          </p>
        </header>
        {/* CUT OFF — need rest of JSX (domain info, risk factors, OSINT panels, report button) */}
      </main>
    </>
  );
