'use client';

import { useState } from 'react';

const cardStyle = {
  backgroundColor: 'var(--tc-surface)',
  border: '1px solid var(--tc-border)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '8px',
};

const titleStyle = {
  fontWeight: 600 as const,
  fontSize: '0.95rem',
  marginBottom: '0.25rem',
  color: 'var(--tc-text-main)',
};

const bodyStyle = { fontSize: '0.85rem', color: 'var(--tc-text-main)' };

export function OsintDetails({ result }: { result: any }) {
  const [expanded, setExpanded] = useState(false);

  const domain = result?.osint?.domain;
  const virusTotal = result?.osint?.virusTotal;
  const safeBrowsing = result?.osint?.safeBrowsing;
  const phishTank = result?.osint?.phishTank;
  const urlhaus = result?.osint?.urlhaus;
  const ai = result?.ai_detection;

  const hasAny = domain || virusTotal || safeBrowsing || phishTank || urlhaus || ai;
  if (!hasAny) return null;

  let domainIsVeryNew = false;
  let domainCreationDisplay: string | null = null;
  if (domain?.creation_date) {
    try {
      const createdAt = new Date(domain.creation_date);
      if (!Number.isNaN(createdAt.getTime())) {
        domainCreationDisplay = createdAt.toLocaleDateString();
        domainIsVeryNew = (Date.now() - createdAt.getTime()) / 86400000 < 30;
      }
    } catch {
      domainCreationDisplay = domain.creation_date;
    }
  }

  const vtPositives = typeof virusTotal?.positives === 'number' ? virusTotal.positives : null;
  const vtTotal = typeof virusTotal?.total === 'number' ? virusTotal.total : null;
  const sbThreatType = safeBrowsing?.threat_type || safeBrowsing?.threatType;
  const sbStatus = sbThreatType && sbThreatType !== 'NONE' ? sbThreatType : 'No threats found';
  const isPhishing = phishTank?.in_database === true || phishTank?.verified === true;

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--tc-border)', paddingTop: '0.75rem' }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'transparent', border: 'none', padding: '0.25rem 0', cursor: 'pointer',
          color: 'var(--tc-text-main)',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Detailed Analysis</span>
        <span style={{ display: 'inline-block', transition: 'transform 0.2s ease', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>

      {expanded && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

          {domain && (
            <div style={cardStyle}>
              <div style={titleStyle}>Website Registration</div>
              <div style={bodyStyle}>
                {domain.registrar && <div><strong>Registered with:</strong> {domain.registrar}</div>}
                {domainCreationDisplay && <div><strong>Created:</strong> {domainCreationDisplay}</div>}
                {domain.country && <div><strong>Country:</strong> {domain.country}</div>}
                {domainIsVeryNew && <div style={{ marginTop: '0.4rem', color: '#f97316', fontWeight: 500 }}>⚠ This website was created very recently — a common sign of scam sites.</div>}
              </div>
            </div>
          )}

          {virusTotal && (
            <div style={cardStyle}>
              <div style={titleStyle}>Security Scan</div>
              <div style={bodyStyle}>
                {vtPositives !== null && vtTotal !== null ? (
                  <div><span style={{ fontWeight: 500, color: vtPositives > 0 ? '#dc2626' : '#16a34a' }}>{vtPositives} out of {vtTotal} security checks</span> flagged this as dangerous.</div>
                ) : <div>Security scan results unavailable.</div>}
              </div>
            </div>
          )}

          {safeBrowsing && (
            <div style={cardStyle}>
              <div style={titleStyle}>Threat Database Check</div>
              <div style={{ fontSize: '0.85rem', color: sbStatus === 'No threats found' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>{sbStatus}</div>
            </div>
          )}

          {phishTank && (
            <div style={cardStyle}>
              <div style={titleStyle}>Phishing Check</div>
              <div style={{ fontSize: '0.85rem', color: isPhishing ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
                {isPhishing ? 'This URL has been reported as a phishing site' : 'Not found in known phishing databases'}
              </div>
            </div>
          )}

          {urlhaus && (
            <div style={cardStyle}>
              <div style={titleStyle}>Malware Check</div>
              <div style={bodyStyle}>
                {urlhaus.threat && <div style={{ color: '#dc2626', fontWeight: 500 }}>Threat detected: {urlhaus.threat}</div>}
                {urlhaus.status && !urlhaus.threat && <div>{urlhaus.status}</div>}
                {!urlhaus.status && !urlhaus.threat && <div>No malware detected.</div>}
              </div>
            </div>
          )}

          {ai && (
            <div style={cardStyle}>
              <div style={titleStyle}>AI Content Analysis</div>
              <div style={bodyStyle}>
                {typeof ai.ai_probability === 'number' && ai.label && (
                  <div>{ai.label === 'likely_ai' ? 'This text shows signs of being AI-generated.' : 'This text appears to be human-written.'}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
