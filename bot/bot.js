#!/usr/bin/env node
// TrustChekr Telegram Bot — @TrustChekrBot
// Forward suspicious messages, get instant scam analysis

const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TC_BOT_TOKEN;
const API_URL = process.env.TC_API_URL || 'https://trustchekr.com';

if (!TOKEN) {
  console.error('Set TC_BOT_TOKEN environment variable');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Risk level display
const riskDisplay = {
  'safe': { emoji: '🟢', label: 'Low Risk' },
  'suspicious': { emoji: '🟡', label: 'Suspicious' },
  'high-risk': { emoji: '🟠', label: 'High Risk' },
  'very-likely-scam': { emoji: '🔴', label: 'Very Likely Scam' },
};

// /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '🛡️ *TrustChekr Bot*',
    '',
    'Forward or paste anything suspicious and I\'ll check it for scams.',
    '',
    '✅ *What I can check:*',
    '• Suspicious text messages or emails',
    '• Websites and URLs',
    '• Phone numbers',
    '• Email addresses',
    '• Crypto wallet addresses',
    '',
    '🔒 Private — I don\'t store your messages.',
    '🇨🇦 Built in Canada for Canadians.',
    '',
    'Just send me something suspicious to get started!',
  ].join('\n'), { parse_mode: 'Markdown' });
});

// /help command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '*How to use TrustChekr Bot:*',
    '',
    '1. Forward a suspicious message here',
    '2. Or paste a URL, phone number, or email',
    '3. I\'ll analyze it and tell you the risk level',
    '',
    '*Commands:*',
    '/start — Welcome message',
    '/help — This help text',
    '/romance — Start romance scam assessment',
    '',
    '🌐 Full scanner: trustchekr.com',
    '🎓 Safety academy: trustchekr.com/academy',
  ].join('\n'), { parse_mode: 'Markdown' });
});

// /romance command — link to web form
bot.onText(/\/romance/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '💔 *Romance Scam Assessment*',
    '',
    'Our romance scam checker asks guided questions about the situation to give you a thorough analysis.',
    '',
    'It works best on the full website:',
    '👉 trustchekr.com/romance',
    '',
    'Or you can describe the situation here and I\'ll do a basic text analysis.',
  ].join('\n'), { parse_mode: 'Markdown' });
});

// Detect input type
function detectType(text) {
  const trimmed = text.trim();
  // URL
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return 'website';
  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';
  // Phone (10+ digits, optional + prefix)
  if (/^\+?\d[\d\s\-().]{8,}$/.test(trimmed)) return 'phone';
  // Crypto: BTC
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(trimmed)) return 'crypto';
  // Crypto: ETH
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return 'crypto';
  // Crypto: XRP
  if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(trimmed)) return 'crypto';
  // Default to message
  return 'message';
}

// Main message handler
bot.on('message', async (msg) => {
  // Skip commands
  if (msg.text && msg.text.startsWith('/')) return;

  const text = msg.text || msg.caption || '';
  if (!text || text.trim().length < 3) {
    bot.sendMessage(msg.chat.id, 'Send me a message, URL, phone number, or email to check. Type /help for more info.');
    return;
  }

  const chatId = msg.chat.id;

  // Send "analyzing" indicator
  bot.sendChatAction(chatId, 'typing');

  const inputType = detectType(text.trim());

  try {
    const res = await fetch(`${API_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: inputType, input: text.trim() }),
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();

    if (data.error) {
      bot.sendMessage(chatId, `❌ ${data.error}`);
      return;
    }

    const risk = riskDisplay[data.riskLevel] || { emoji: '❓', label: 'Unknown' };

    const lines = [
      `${risk.emoji} *${risk.label}*`,
      '',
    ];

    // Why bullets
    if (data.whyBullets && data.whyBullets.length > 0) {
      lines.push('*What we found:*');
      for (const bullet of data.whyBullets.slice(0, 5)) {
        lines.push(`• ${bullet}`);
      }
      lines.push('');
    }

    // AI detection
    if (data.ai_detection && data.ai_detection.label === 'AI_GENERATED') {
      lines.push(`🤖 *${Math.round(data.ai_detection.ai_probability * 100)}% likely AI-generated text*`);
      lines.push('');
    }

    // Next steps
    if (data.nextSteps && data.nextSteps.length > 0) {
      lines.push('*What to do:*');
      for (const step of data.nextSteps.slice(0, 3)) {
        lines.push(`→ ${step}`);
      }
      lines.push('');
    }

    // Graph intelligence
    if (data.graph && data.graph.network_risk_label !== 'LOW') {
      lines.push(`🕸️ Network risk: *${data.graph.network_risk_label}* (linked to ${data.graph.entities_created} known entities)`);
      lines.push('');
    }

    // Footer
    lines.push('—');
    lines.push('⚠️ _Automated analysis — not professional advice._');
    lines.push('🌐 Full scanner: trustchekr.com');

    bot.sendMessage(chatId, lines.join('\n'), { parse_mode: 'Markdown', disable_web_page_preview: true });

  } catch (err) {
    console.error('Scan error:', err);
    bot.sendMessage(chatId, [
      '❌ Sorry, I couldn\'t complete the scan right now.',
      '',
      'Try again in a moment, or use the full scanner:',
      '🌐 trustchekr.com',
    ].join('\n'));
  }
});

console.log('🛡️ TrustChekr Bot running...');
