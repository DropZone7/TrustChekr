/**
 * TrustChekr Embeddable Widget V2
 * Drop this script on any page to add a scam checker.
 *
 * Usage:
 *   <div id="trustchekr-widget"></div>
 *   <script src="https://trustchekr.com/widget-v2.js" defer></script>
 *
 * Or with custom config:
 *   <script src="https://trustchekr.com/widget-v2.js"
 *     data-theme="dark" data-accent="#A40000" defer></script>
 */
(function () {
  'use strict';

  const API_URL = 'https://trustchekr.com/api/v1/scan';

  // Find our script tag for config
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget-v2"]');
  const theme = scriptTag?.getAttribute('data-theme') || 'light';
  const accent = scriptTag?.getAttribute('data-accent') || '#A40000';

  // Find or create container
  let container = document.getElementById('trustchekr-widget');
  if (!container) {
    container = document.createElement('div');
    container.id = 'trustchekr-widget';
    if (scriptTag?.parentNode) {
      scriptTag.parentNode.insertBefore(container, scriptTag);
    } else {
      document.body.appendChild(container);
    }
  }

  // Create shadow DOM for style isolation
  const shadow = container.attachShadow({ mode: 'open' });

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const textColor = isDark ? '#e2e8f0' : '#111827';
  const mutedColor = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? '#1e293b' : '#f9fafb';

  const styles = `
    :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    * { box-sizing: border-box; }
    .tc-widget { border-radius: 16px; border: 1px solid ${borderColor}; background: ${bgColor}; padding: 1rem; max-width: 420px; font-size: 16px; color: ${textColor}; }
    .tc-title { margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600; color: ${accent}; }
    .tc-desc { margin: 0 0 0.75rem; font-size: 0.85rem; color: ${mutedColor}; }
    .tc-input-row { display: flex; gap: 0.5rem; }
    .tc-input { flex: 1; border-radius: 999px; border: 1px solid ${borderColor}; padding: 0.5rem 0.75rem; font-size: 0.9rem; background: ${inputBg}; color: ${textColor}; outline: none; }
    .tc-input:focus { border-color: ${accent}; }
    .tc-btn { border-radius: 999px; border: none; background: ${accent}; color: #fff; padding: 0.5rem 1rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .tc-btn:disabled { opacity: 0.6; cursor: default; }
    .tc-result { margin-top: 0.75rem; border-radius: 12px; border: 1px solid ${borderColor}; padding: 0.75rem; }
    .tc-risk-badge { display: inline-block; border-radius: 999px; padding: 0.15rem 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .tc-risk-low { background: rgba(16,185,129,0.12); color: #059669; }
    .tc-risk-med { background: rgba(245,158,11,0.12); color: #d97706; }
    .tc-risk-high { background: rgba(239,68,68,0.12); color: #dc2626; }
    .tc-bullets { margin: 0.4rem 0 0; padding-left: 1rem; font-size: 0.85rem; color: ${mutedColor}; }
    .tc-bullets li { margin-bottom: 0.15rem; }
    .tc-error { margin-top: 0.5rem; font-size: 0.85rem; color: #dc2626; }
    .tc-footer { margin-top: 0.5rem; font-size: 0.7rem; color: ${mutedColor}; text-align: right; }
    .tc-footer a { color: ${accent}; text-decoration: none; }
  `;

  const html = `
    <style>${styles}</style>
    <div class="tc-widget">
      <h3 class="tc-title">🛡️ Check for Scams</h3>
      <p class="tc-desc">Paste a website, phone number, email, or message to check if it's suspicious.</p>
      <div class="tc-input-row">
        <input class="tc-input" type="text" placeholder="Paste something suspicious…" id="tc-input" />
        <button class="tc-btn" id="tc-btn">Check</button>
      </div>
      <div id="tc-result"></div>
      <div class="tc-footer">Powered by <a href="https://trustchekr.com" target="_blank" rel="noopener">TrustChekr</a></div>
    </div>
  `;

  shadow.innerHTML = html;

  const input = shadow.getElementById('tc-input');
  const btn = shadow.getElementById('tc-btn');
  const resultDiv = shadow.getElementById('tc-result');

  function riskClass(level) {
    if (level === 'safe') return 'tc-risk-low';
    if (level === 'suspicious') return 'tc-risk-med';
    return 'tc-risk-high';
  }

  function riskLabel(level) {
    if (level === 'safe') return 'Low Risk';
    if (level === 'suspicious') return 'Suspicious';
    if (level === 'high-risk') return 'High Risk';
    return 'Very Likely Scam';
  }

  async function doScan() {
    const value = input.value.trim();
    if (!value) return;

    btn.disabled = true;
    btn.textContent = 'Checking…';
    resultDiv.innerHTML = '';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value, input: value, type: 'website' }),
      });

      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();

      const level = data.riskLevel || 'safe';
      const bullets = (data.whyBullets || []).slice(0, 3);

      let html = `<div class="tc-result">`;
      html += `<span class="tc-risk-badge ${riskClass(level)}">${riskLabel(level)}</span>`;
      if (bullets.length) {
        html += `<ul class="tc-bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
      }
      html += `</div>`;
      resultDiv.innerHTML = html;
    } catch (err) {
      resultDiv.innerHTML = `<p class="tc-error">Could not check this right now. Try again in a moment.</p>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Check';
    }
  }

  btn.addEventListener('click', doScan);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doScan();
  });
})();
