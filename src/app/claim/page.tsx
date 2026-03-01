'use client';

import { BackButton } from '@/components/BackButton';

import React, { useState, useEffect, useRef, useId, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const DOMAIN_RE = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_PLACEHOLDERS: Record<string, string> = {
  owner: 'Describe your business and link to your company registration...',
  developer: 'Explain which company you work for and link to the official website...',
  marketing: "Link to the brand's official channels, press coverage...",
  other: 'Explain your relationship to this domain...',
};

const SUBMIT_STEPS = ['Validating...', 'Sending claim...', 'Saving...'];

const DRAFT_KEY = 'claim_draft';

interface FormState {
  domain: string;
  name: string;
  email: string;
  role: string;
  evidence: string;
  verificationMethod: string;
  subscribeAlerts: boolean;
  _trap: string;
}

const INITIAL_FORM: FormState = {
  domain: '',
  name: '',
  email: '',
  role: 'owner',
  evidence: '',
  verificationMethod: 'meta_tag',
  subscribeAlerts: false,
  _trap: '',
};

export default function ClaimPageWrapper() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.25rem' }}><p>Loading...</p></div>}>
      <ClaimPage />
    </Suspense>
  );
}

function ClaimPage() {
  const searchParams = useSearchParams();
  const formId = useId();
  const id = (f: string) => `${formId}-${f}`;

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitStep, setSubmitStep] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [domainValid, setDomainValid] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stepTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Restore draft on mount
  useEffect(() => {
    const paramDomain = searchParams.get('domain') ?? '';
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
      if (draft) {
        setForm({ ...draft, domain: paramDomain || draft.domain });
      } else if (paramDomain) {
        setForm((prev) => ({ ...prev, domain: paramDomain }));
      }
    } catch {
      if (paramDomain) setForm((prev) => ({ ...prev, domain: paramDomain }));
    }
  }, [searchParams]);

  useEffect(() => {
    setDomainValid(DOMAIN_RE.test(form.domain.trim()));
  }, [form.domain]);

  const saveDraft = useCallback((data: FormState) => {
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 800);
  }, []);

  const setField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      const next = { ...form, [field]: value };
      setForm(next as FormState);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      saveDraft(next as FormState);
    };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.domain.trim() || !DOMAIN_RE.test(form.domain.trim()))
      next.domain = 'Enter a valid domain (e.g. example.com). Do not include https:// or www.';
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim()))
      next.email = 'Enter a valid email address.';
    if (!form.evidence.trim()) next.evidence = 'Evidence is required.';
    if (form.evidence.length > 2000)
      next.evidence = 'Evidence must be 2000 characters or fewer.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setSubmitStep(0);
    stepTimer.current = setTimeout(() => setSubmitStep(1), 300);
    setTimeout(() => setSubmitStep(2), 900);

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: form.domain.trim().toLowerCase(),
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          evidence: form.evidence.trim(),
          verificationMethod: form.verificationMethod,
          subscribeAlerts: form.subscribeAlerts,
          _trap: form._trap,
        }),
      });

      const data = await res.json();
      clearTimeout(stepTimer.current);

      if (!res.ok) {
        setErrMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      localStorage.removeItem(DRAFT_KEY);
      setSubmittedEmail(form.email.trim().toLowerCase());
      setStatus('success');
    } catch {
      clearTimeout(stepTimer.current);
      setErrMsg('Unable to reach the server. Please try again.');
      setStatus('error');
    }
  };

  const charPct = form.evidence.length / 2000;
  const charColor =
    charPct >= 0.95
      ? 'var(--tc-danger, #dc2626)'
      : charPct >= 0.85
        ? 'var(--tc-warning, #f59e0b)'
        : 'var(--tc-text-muted)';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    fontSize: '1rem',
    backgroundColor: 'var(--tc-surface)',
    border: '1px solid var(--tc-border)',
    borderRadius: '12px',
    color: 'var(--tc-text-main)',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const focusStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle,
    borderColor: hasError ? 'var(--tc-danger, #dc2626)' : undefined,
  });

  // Success state
  if (status === 'success') {
    return (
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '4rem 1.25rem', textAlign: 'center' }}>
      <BackButton />
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--tc-success, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tc-text-main)', margin: '0 0 0.75rem' }}>
          Claim Submitted
        </h1>
        <p style={{ color: 'var(--tc-text-muted)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
          Your claim has been submitted. We will review it within 5 business days and email you at{' '}
          <strong>{submittedEmail}</strong>.
        </p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setErrors({});
            setStatus('idle');
            setSubmittedEmail('');
          }}
          style={{
            padding: '0.5625rem 1.125rem',
            backgroundColor: 'var(--tc-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
          }}
        >
          Submit another claim
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--tc-text-main)', margin: '0 0 0.375rem' }}>
        Claim Your Website
      </h1>
      <p style={{ color: 'var(--tc-text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
        If you own or represent a website, you can dispute your trust score for free. A human reviewer will examine
        your evidence and update the score if warranted.
      </p>

      {/* Free badge */}
      <span
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--tc-success, #16a34a)',
          backgroundColor: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid var(--tc-success, #16a34a)',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
        }}
      >
        100% free — no payment required
      </span>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={form._trap}
          onChange={setField('_trap')}
        />
      </div>

      {status === 'error' && (
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
          {errMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          backgroundColor: 'var(--tc-surface)',
          border: '1px solid var(--tc-border)',
          borderRadius: '12px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Domain */}
        <div>
          <label htmlFor={id('domain')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Website domain <span aria-hidden="true" style={{ color: 'var(--tc-danger, #dc2626)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id={id('domain')}
              type="text"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="example.com"
              value={form.domain}
              onChange={setField('domain')}
              aria-invalid={!!errors.domain}
              style={focusStyle(!!errors.domain)}
            />
            {form.domain.length > 3 && (
              <span
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: domainValid ? 'var(--tc-success, #16a34a)' : 'var(--tc-danger, #dc2626)',
                }}
              >
                {domainValid ? 'Valid domain' : 'Invalid domain'}
              </span>
            )}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-text-muted)' }}>
            Do not include https:// or www.
          </p>
          {errors.domain && (
            <p role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-danger, #dc2626)' }}>
              {errors.domain}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor={id('name')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Your name <span aria-hidden="true" style={{ color: 'var(--tc-danger, #dc2626)' }}>*</span>
          </label>
          <input
            id={id('name')}
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={setField('name')}
            aria-invalid={!!errors.name}
            style={focusStyle(!!errors.name)}
          />
          {errors.name && (
            <p role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-danger, #dc2626)' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={id('email')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Email address <span aria-hidden="true" style={{ color: 'var(--tc-danger, #dc2626)' }}>*</span>
          </label>
          <input
            id={id('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@yourcompany.com"
            value={form.email}
            onChange={setField('email')}
            aria-invalid={!!errors.email}
            style={focusStyle(!!errors.email)}
          />
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-text-muted)' }}>
            We will contact you about the review at this address.
          </p>
          {errors.email && (
            <p role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-danger, #dc2626)' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor={id('role')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Your role <span aria-hidden="true" style={{ color: 'var(--tc-danger, #dc2626)' }}>*</span>
          </label>
          <select
            id={id('role')}
            value={form.role}
            onChange={setField('role')}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="owner">Owner</option>
            <option value="developer">Developer</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Evidence */}
        <div>
          <label htmlFor={id('evidence')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Evidence <span aria-hidden="true" style={{ color: 'var(--tc-danger, #dc2626)' }}>*</span>
          </label>
          <textarea
            id={id('evidence')}
            rows={5}
            placeholder={ROLE_PLACEHOLDERS[form.role] ?? ROLE_PLACEHOLDERS.other}
            value={form.evidence}
            onChange={setField('evidence')}
            aria-invalid={!!errors.evidence}
            style={{ ...focusStyle(!!errors.evidence), resize: 'vertical', minHeight: '120px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--tc-text-muted)' }}>
              Links to official registrations, press coverage, or company directories strengthen your claim.
            </p>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: charColor, flexShrink: 0, marginLeft: '1rem' }}>
              {form.evidence.length}/2000
            </span>
          </div>
          {errors.evidence && (
            <p role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-danger, #dc2626)' }}>
              {errors.evidence}
            </p>
          )}
        </div>

        {/* Verification Method */}
        <div>
          <label htmlFor={id('method')} style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--tc-text-main)', marginBottom: '0.375rem' }}>
            Verification method
          </label>
          <select
            id={id('method')}
            value={form.verificationMethod}
            onChange={setField('verificationMethod')}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="meta_tag">HTML meta tag</option>
            <option value="dns_txt">DNS TXT record</option>
            <option value="other_proof">Other proof (manual review)</option>
          </select>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--tc-text-muted)' }}>
            {form.verificationMethod === 'meta_tag'
              ? 'After submitting, add the verification code as a <meta> tag on your homepage.'
              : form.verificationMethod === 'dns_txt'
                ? 'After submitting, add the verification code as a TXT record on your domain.'
                : 'A reviewer will evaluate your evidence manually.'}
          </p>
        </div>

        {/* Subscribe */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.subscribeAlerts}
            onChange={setField('subscribeAlerts')}
            style={{ marginTop: '0.25rem', accentColor: 'var(--tc-primary)' }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--tc-text-muted)', lineHeight: 1.5 }}>
            Notify me if the trust score for this domain changes in the future.
          </span>
        </label>

        {/* Draft indicator */}
        {draftSaved && (
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--tc-text-muted)', textAlign: 'right' }}>
            Draft saved
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '0.875rem',
            backgroundColor: 'var(--tc-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            opacity: status === 'submitting' ? 0.7 : 1,
          }}
        >
          {status === 'submitting' ? SUBMIT_STEPS[submitStep] : 'Submit Claim for Review'}
        </button>
      </form>

      {/* Disclaimer */}
      <div style={{ borderLeft: '3px solid var(--tc-border)', paddingLeft: '1rem', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--tc-text-muted)', lineHeight: 1.6 }}>
          Submitting a claim does not guarantee a score change. All claims are reviewed manually by our team.
          We do not share your contact information with third parties.
        </p>
      </div>
    </main>
  );
}
