#!/usr/bin/env node
// TrustChekr Telegram Bot — @TrustChekrBot

const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TC_BOT_TOKEN;
const API_URL = process.env.TC_API_URL || 'https://www.trustchekr.com';

if (!TOKEN) { console.error('Set TC_BOT_TOKEN'); process.exit(1); }

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('polling_error', (err) => console.error('Polling error:', err.message));

const riskDisplay = {
  'safe':             { emoji: '🟢', label: 'Low Risk' },
  'suspicious':       { emoji: '🟡', label: 'Suspicious' },
  'high-risk':        { emoji: '🟠', label: 'High Risk' },
  'very-likely-scam': { emoji: '🔴', label: 'Very Likely a Scam' },
};

// Friendly reassurance for safe results
const safeResponses = [
  "This looks fine. Nothing suspicious jumped out.",
  "I checked this against our databases — it looks legitimate.",
  "No red flags found. This appears to be normal.",
  "Looks safe to me. I didn't find anything concerning.",
  "I ran this through 21 checks — nothing suspicious came up.",
];

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '*TrustChekr*',
    '',
    'Send me anything that seems suspicious and I\'ll check it for you.',
    '',
    'I can look at:',
    '• Text messages or emails someone sent you',
    '• Website links',
    '• Phone numbers',
    '• Email addresses',
    '• Crypto wallet addresses',
    '',
    'Just forward it or paste it here. I don\'t store anything you send.',
  ].join('\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '*How to use this:*',
    '',
    '1. Forward a message that feels off',
    '2. Or paste a link, phone number, or email',
    '3. I\'ll tell you if it looks safe or suspicious',
    '',
    'If you\'re worried someone online might be scamming you romantically, type /romance',
    '',
    'Full website: trustchekr.com',
  ].join('\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\/romance/, (msg) => {
  bot.sendMessage(msg.chat.id, [
    '*Romance Scam Check*',
    '',
    'If someone you met online is asking for money, making excuses not to video call, or moving very fast — those are warning signs.',
    '',
    'Our guided assessment asks a few questions about the situation:',
    '👉 trustchekr.com/romance',
    '',
    'Or just describe what\'s happening here and I\'ll take a look.',
  ].join('\n'), { parse_mode: 'Markdown' });
});

function detectType(text) {
  const t = text.trim();
  if (/^https?:\/\//i.test(t) || /^www\./i.test(t) || /^[a-z0-9.-]+\.(com|net|org|ca|xyz|io|co|info|biz|ru|cn)\b/i.test(t)) return 'website';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'other';
  if (/^\+?\d[\d\s\-().]{8,}$/.test(t)) return 'other';
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(t)) return 'other';
  if (/^0x[a-fA-F0-9]{40}$/.test(t)) return 'other';
  if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(t)) return 'other';
  return 'message';
}

bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return;

  const text = msg.text || msg.caption || '';
  if (!text || text.trim().length < 3) {
    bot.sendMessage(msg.chat.id, 'Send me something to check — a message, link, phone number, or email. Type /help if you\'re not sure.');
    return;
  }

  const chatId = msg.chat.id;
  bot.sendChatAction(chatId, 'typing');

  const inputType = detectType(text.trim());

  try {
    const res = await fetch(`${API_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: inputType, input: text.trim() }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();

    if (data.error) {
      bot.sendMessage(chatId, `Something went wrong on my end. Try again in a moment, or use trustchekr.com`);
      return;
    }

    const risk = riskDisplay[data.riskLevel] || { emoji: '❓', label: 'Unknown' };
    const lines = [];

    // Main verdict
    lines.push(`${risk.emoji} *${risk.label}*`);
    lines.push('');

    // For safe results, give a warm reassurance instead of clinical bullets
    if (data.riskLevel === 'safe') {
      lines.push(safeResponses[Math.floor(Math.random() * safeResponses.length)]);
      if (data.whyBullets?.length > 0) {
        lines.push('');
        for (const b of data.whyBullets.slice(0, 3)) {
          lines.push(`• ${b}`);
        }
      }
    } else {
      // For risky results, be clear and direct
      if (data.whyBullets?.length > 0) {
        for (const b of data.whyBullets.slice(0, 5)) {
          lines.push(`• ${b}`);
        }
        lines.push('');
      }

      if (data.nextSteps?.length > 0) {
        lines.push('*What you should do:*');
        for (const s of data.nextSteps.slice(0, 3)) {
          lines.push(`→ ${s}`);
        }
        lines.push('');
      }
    }

    // Disclaimer
    lines.push('_This is automated analysis, not professional advice._');

    bot.sendMessage(chatId, lines.join('\n'), {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });

  } catch (err) {
    console.error('Scan error:', err.message);
    bot.sendMessage(chatId, 'Sorry, I couldn\'t check that right now. Try again in a moment or use trustchekr.com');
  }
});

console.log('TrustChekr Bot running');
