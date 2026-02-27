const API = 'https://trustchekr.com/api/scan';

const riskConfig = {
  'safe': { emoji: '🟢', label: 'Low Risk', cls: 'safe' },
  'suspicious': { emoji: '🟡', label: 'Suspicious', cls: 'suspicious' },
  'high-risk': { emoji: '🟠', label: 'High Risk', cls: 'high-risk' },
  'very-likely-scam': { emoji: '🔴', label: 'Very Likely Scam', cls: 'very-likely-scam' },
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

async function scanUrl(url) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'website', input: url }),
    });
    return await res.json();
  } catch (e) {
    return { error: 'Network error' };
  }
}

async function scanInput(text) {
  try {
    const type = detectType(text);
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input: text }),
    });
    return await res.json();
  } catch (e) {
    return { error: 'Network error' };
  }
}

function renderResult(data, statusEl, bulletsEl, aiEl) {
  if (data.error) {
    statusEl.className = 'status error';
    statusEl.innerHTML = `<div class="emoji">❌</div><div class="label">Error</div><div class="sublabel">${data.error}</div>`;
    return;
  }

  const risk = riskConfig[data.riskLevel] || { emoji: '❓', label: 'Unknown', cls: 'loading' };
  statusEl.className = `status ${risk.cls}`;
  statusEl.innerHTML = `<div class="emoji">${risk.emoji}</div><div class="label">${risk.label}</div>`;

  if (data.whyBullets && data.whyBullets.length) {
    bulletsEl.innerHTML = data.whyBullets.slice(0, 4).map(b => `<li>${b}</li>`).join('');
    bulletsEl.style.display = 'block';
  }

  if (data.ai_detection && data.ai_detection.label === 'AI_GENERATED') {
    aiEl.innerHTML = `<span class="ai-badge" style="background:#fee2e2;color:#991b1b;">🤖 ${Math.round(data.ai_detection.ai_probability * 100)}% AI-generated</span>`;
    aiEl.style.display = 'block';
  }
}

// Scan current page on popup open
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const url = tabs[0]?.url;
  const statusEl = document.getElementById('page-status');
  const bulletsEl = document.getElementById('bullets');
  const aiEl = document.getElementById('ai-detection');

  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
    statusEl.className = 'status loading';
    statusEl.innerHTML = '<div class="sublabel">Can\'t scan browser pages. Try a website!</div>';
    return;
  }

  // Check cache first
  const cacheKey = `tc_cache_${url}`;
  const cached = await chrome.storage.local.get(cacheKey);
  if (cached[cacheKey] && Date.now() - cached[cacheKey].ts < 3600000) { // 1 hour cache
    renderResult(cached[cacheKey].data, statusEl, bulletsEl, aiEl);
    return;
  }

  const data = await scanUrl(url);
  renderResult(data, statusEl, bulletsEl, aiEl);

  // Cache result
  if (!data.error) {
    chrome.storage.local.set({ [cacheKey]: { data, ts: Date.now() } });
  }
});

// Manual scan
document.getElementById('manual-btn').addEventListener('click', async () => {
  const input = document.getElementById('manual-input');
  const text = input.value.trim();
  if (!text) return;

  const btn = document.getElementById('manual-btn');
  const resultDiv = document.getElementById('manual-result');
  btn.disabled = true;
  btn.textContent = 'Checking...';

  const data = await scanInput(text);

  const risk = riskConfig[data.riskLevel] || { emoji: '❓', label: 'Unknown', cls: 'loading' };

  if (data.error) {
    resultDiv.innerHTML = `<div class="status error"><div class="sublabel">${data.error}</div></div>`;
  } else {
    let html = `<div class="status ${risk.cls}"><div class="emoji">${risk.emoji}</div><div class="label">${risk.label}</div></div>`;
    if (data.whyBullets && data.whyBullets.length) {
      html += '<ul class="bullets">' + data.whyBullets.slice(0, 3).map(b => `<li>${b}</li>`).join('') + '</ul>';
    }
    resultDiv.innerHTML = html;
  }

  resultDiv.style.display = 'block';
  btn.disabled = false;
  btn.textContent = '🔍 Scan';
});

// Enter key support
document.getElementById('manual-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('manual-btn').click();
});
