// TrustChekr Embeddable Widget
// Add to any site: <script src="https://trustchekr.com/widget.js"></script>
// Optional: <div id="trustchekr-widget"></div> (auto-creates if missing)

(function() {
  'use strict';

  const API = 'https://trustchekr.com/api/scan';
  const BRAND = { primary: '#1a6b64', safe: '#16a34a', warning: '#ca8a04', danger: '#dc2626', bg: '#f0fdf4', border: '#d1d5db', text: '#1f2937', muted: '#6b7280' };

  const riskMap = {
    'safe': { emoji: '🟢', label: 'Low Risk', color: BRAND.safe },
    'suspicious': { emoji: '🟡', label: 'Suspicious', color: BRAND.warning },
    'high-risk': { emoji: '🟠', label: 'High Risk', color: '#ea580c' },
    'very-likely-scam': { emoji: '🔴', label: 'Very Likely Scam', color: BRAND.danger },
  };

  function detectType(text) {
    const t = text.trim();
    if (/^https?:\/\//i.test(t) || /^www\./i.test(t)) return 'website';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'email';
    if (/^\+?\d[\d\s\-().]{8,}$/.test(t)) return 'phone';
    if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(t)) return 'crypto';
    if (/^0x[a-fA-F0-9]{40}$/.test(t)) return 'crypto';
    if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(t)) return 'crypto';
    return 'message';
  }

  function create() {
    let container = document.getElementById('trustchekr-widget');
    if (!container) {
      container = document.createElement('div');
      container.id = 'trustchekr-widget';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;border:2px solid ${BRAND.border};border-radius:16px;overflow:hidden;background:white;">
        <div style="background:${BRAND.primary};padding:12px 16px;color:white;text-align:center;">
          <strong style="font-size:16px;">🛡️ TrustChekr — Free Scam Scanner</strong>
        </div>
        <div style="padding:16px;">
          <textarea id="tc-w-input" rows="3" placeholder="Paste a suspicious message, URL, phone number, or email..." style="width:100%;box-sizing:border-box;padding:10px;border:1px solid ${BRAND.border};border-radius:8px;font-size:14px;resize:vertical;font-family:inherit;"></textarea>
          <button id="tc-w-btn" style="width:100%;margin-top:8px;padding:10px;background:${BRAND.primary};color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">Check for Scams</button>
          <div id="tc-w-result" style="margin-top:12px;display:none;"></div>
          <p style="margin-top:10px;font-size:11px;color:${BRAND.muted};text-align:center;">
            Powered by <a href="https://trustchekr.com" target="_blank" rel="noopener" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">TrustChekr</a> 🇨🇦 — Free, private, no sign-up
          </p>
        </div>
      </div>
    `;

    const input = document.getElementById('tc-w-input');
    const btn = document.getElementById('tc-w-btn');
    const resultDiv = document.getElementById('tc-w-result');

    btn.addEventListener('click', async function() {
      const text = input.value.trim();
      if (!text) return;

      btn.disabled = true;
      btn.textContent = 'Checking...';
      resultDiv.style.display = 'none';

      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: detectType(text), input: text }),
        });
        const data = await res.json();

        if (data.error) {
          resultDiv.innerHTML = `<p style="color:${BRAND.danger};font-size:14px;">❌ ${data.error}</p>`;
        } else {
          const risk = riskMap[data.riskLevel] || { emoji: '❓', label: 'Unknown', color: BRAND.muted };
          let html = `<div style="padding:12px;border-radius:10px;border:2px solid ${risk.color};background:${risk.color}10;">`;
          html += `<p style="font-size:18px;font-weight:700;color:${risk.color};margin:0;">${risk.emoji} ${risk.label}</p>`;
          if (data.whyBullets && data.whyBullets.length) {
            html += '<ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:' + BRAND.text + ';">';
            data.whyBullets.slice(0, 4).forEach(function(b) { html += '<li style="margin-top:4px;">' + b + '</li>'; });
            html += '</ul>';
          }
          html += '</div>';
          html += `<p style="font-size:10px;color:${BRAND.muted};margin-top:8px;">⚠️ Automated analysis — not professional advice. <a href="https://trustchekr.com" target="_blank" style="color:${BRAND.primary};">Full scan →</a></p>`;
          resultDiv.innerHTML = html;
        }
      } catch(e) {
        resultDiv.innerHTML = `<p style="color:${BRAND.danger};font-size:14px;">❌ Couldn't connect. Try <a href="https://trustchekr.com" target="_blank">trustchekr.com</a></p>`;
      }

      resultDiv.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Check for Scams';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', create);
  } else {
    create();
  }
})();
