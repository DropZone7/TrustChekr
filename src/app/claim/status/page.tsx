'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type ClaimStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

interface ClaimData {
  claim_id: string;
  domain: string;
  status: ClaimStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  verification_method: string;
  verified_at: string | null;
}

const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; bg: string; description: string }> = {
  pending: {
    label: 'Pending Review',
    color: 'var(--tc-warning, #f59e0b)',
    bg: 'rgba(245, 158, 11, 0.08)',
    description: 'Your claim is in the queue and will be reviewed within 5 business days.',
  },
  under_review: {
    label: 'Under Review',
    color: 'var(--tc-primary)',
    bg: 'rgba(164, 0, 0, 0.06)',
    description: 'A reviewer is actively looking at your claim.',
  },
  approved: {
    label: 'Approved',
    color: 'var(--tc-success, #16a34a)',
    bg: 'rgba(22, 163, 74, 0.08)',
    description: 'Your claim was approved and the trust score has been updated.',
  },
  rejected: {
    label: 'Not Approved',
    color: 'var(--tc-danger, #dc2626)',
    bg: 'rgba(220, 38, 38, 0.08)',
    description: 'We reviewed your claim but were unable to approve a score change.',
  },
};

const METHOD_LABELS: Record<string, string> = {
  meta_tag: 'HTML meta tag',
  dns_txt: 'DNS TXT record',
  other_proof: 'Manual review',
};

export default function ClaimStatusPageWrapper() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.25rem' }}><p>Loading...</p></div>}>
      <ClaimStatusPage />
    </Suspense>
  );
}

function ClaimStatusPage() {
  const searchParams = useSearchParams();
  const [id, setId] = useState(searchParams.get('id') ?? '');
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchClaim = async (claimId: string) => {
    if (!claimId.trim()) return;
    setLoading(true);
    setError('');
    setClaim(null);
    try {
      const res = await fetch(`/api/claim/status?id=${encodeURIComponent(claimId.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Claim not found.');
        return;
      }
      setClaim(data.claim);
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) fetchClaim(paramId);
  }, [searchParams]);

  const cfg = claim ? STATUS_CONFIG[claim.status] : null;

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--tc-text-main)', margin: '0 0 0.5rem' }}>
        Claim Status
      </h1>
      <p style={{ color: 'var(--tc-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        Enter your claim ID to check the status of your review.
      </p>

      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchClaim(id)}
          placeholder="clm_abc123..."
          style={{
            flex: 1,
            padding: '0.625rem 0.875rem',
            fontSize: '1rem',
            backgroundColor: 'var(--tc-surface)',
            border: '1px solid var(--tc-border)',
            borderRadius: '12px',
            color: 'var(--tc-text-main)',
            outline: 'none',
          }}
        />
        <button
          onClick={() => fetchClaim(id)}
          disabled={loading}
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: 'var(--tc-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Looking up...' : 'Look up'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid var(--tc-danger, #dc2626)',
            borderRadius: '12px',
            color: 'var(--tc-danger, #dc2626)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          {error}
        </div>
      )}

      {claim && cfg && (
        <div
          style={{
            backgroundColor: 'var(--tc-surface)',
            border: '1px solid var(--tc-border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ backgroundColor: cfg.bg, borderBottom: '1px solid var(--tc-border)', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: cfg.color,
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: cfg.color }}>{cfg.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--tc-text-muted)', lineHeight: 1.5 }}>
              {cfg.description}
            </p>
          </div>

          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {(
              [
                ['Claim ID', claim.claim_id],
                ['Domain', claim.domain],
                [
                  'Submitted',
                  new Date(claim.submitted_at).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                ],
                ['Verification', METHOD_LABELS[claim.verification_method] ?? claim.verification_method],
                [
                  'Ownership verified',
                  claim.verified_at
                    ? `Yes — ${new Date(claim.verified_at).toLocaleDateString()}`
                    : 'Not yet verified',
                ],
                ...(claim.reviewed_at
                  ? [
                      [
                        'Reviewed',
                        new Date(claim.reviewed_at).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }),
                      ],
                    ]
                  : []),
              ] as [string, string][]
            ).map(([label, value]) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--tc-text-muted)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--tc-text-main)', fontWeight: 500, textAlign: 'right' }}>
                  {value}
                </span>
              </div>
            ))}

            {claim.reviewer_notes && (
              <div
                style={{
                  marginTop: '0.25rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--tc-surface)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: 'var(--tc-text-muted)',
                  lineHeight: 1.6,
                  borderLeft: `3px solid ${cfg.color}`,
                }}
              >
                <strong style={{ color: 'var(--tc-text-main)' }}>Reviewer note:</strong> {claim.reviewer_notes}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
