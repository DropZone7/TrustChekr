'use client';

import React from 'react';

type RiskLevel = 'safe' | 'suspicious' | 'high-risk' | 'very-likely-scam';

type DailyScam = {
  title: string;
  emoji: string;
  description: string;
  riskLevel: RiskLevel;
  tip: string;
};

export type ScamOfTheDayProps = {
  date?: Date;
};

const DAILY_SCAMS: DailyScam[] = [
  { title: 'CRA Arrest Threat', emoji: '🏛', description: 'Scammers call claiming to be from the CRA, saying there is a warrant for your arrest unless you pay immediately, often by gift cards or cryptocurrency.', riskLevel: 'very-likely-scam', tip: 'The CRA will never threaten arrest or demand payment by gift cards or cryptocurrency.' },
  { title: 'CRA Refund Text / Email', emoji: '💰', description: 'You get a text or email saying the CRA owes you a refund and asking you to click a link and provide banking or SIN details.', riskLevel: 'high-risk', tip: 'The CRA does not issue refunds by text and will not ask you to click unknown links or send banking info.' },
  { title: 'Canada Post Package Scam', emoji: '📦', description: "A text message says \"Your package couldn't be delivered\" and asks you to pay a small fee on a fake Canada Post page to release it.", riskLevel: 'high-risk', tip: 'Go directly to the official Canada Post website or your tracking number; do not click links in unexpected texts.' },
  { title: 'RCMP Delivery Notice Phishing', emoji: '🚔', description: 'You receive a text claiming the RCMP tried to deliver court documents and asking you to reschedule via a link to a fake RCMP site.', riskLevel: 'high-risk', tip: 'The RCMP does not send "delivery notices" by text or ask you to reschedule court documents via a link.' },
  { title: 'Grandparent Emergency Scam', emoji: '👵', description: 'Someone calls pretending to be your grandchild or a lawyer/police officer, saying a loved one is in jail or in trouble and needs bail money right now.', riskLevel: 'very-likely-scam', tip: 'Hang up and call your family member or a trusted relative directly on a known number to verify the story.' },
  { title: 'AI Voice Clone Family Scam', emoji: '🗣', description: 'You get a call where the voice sounds exactly like your child or grandchild, begging for money to get out of trouble or pay a fine.', riskLevel: 'very-likely-scam', tip: 'Even if the voice sounds real, verify by calling them back on a known number or using a family safe word.' },
  { title: 'Tech Support Popup', emoji: '💻', description: 'A full-screen popup says your computer is infected and tells you to call a support number or grant remote access immediately.', riskLevel: 'very-likely-scam', tip: 'Close the browser, never call the number, and never give remote access to someone who contacted you first.' },
  { title: 'Bank Text Phishing (Smishing)', emoji: '🏦', description: 'You get a text that looks like it is from your bank about a locked account or suspicious transaction with a link to "secure" your account.', riskLevel: 'high-risk', tip: 'Ignore the link and contact your bank using the official phone number or app.' },
  { title: 'Fake E-Transfer Notification', emoji: '💸', description: 'You receive an email or text claiming someone sent you an Interac e‑Transfer, but you must "claim" it through a link to a fake banking page.', riskLevel: 'high-risk', tip: 'Only accept e‑Transfers through your bank\'s official app or website and never via links in unexpected messages.' },
  { title: 'Amazon Order Confirmation Scam', emoji: '📨', description: 'An email or call says you ordered an expensive item on Amazon and urges you to call or click a link to dispute the charge.', riskLevel: 'high-risk', tip: 'Check your real Amazon account or credit card statement; do not use phone numbers or links in the message.' },
  { title: 'Netflix Account Suspended Scam', emoji: '🎬', description: 'A message claims your Netflix or streaming account is suspended and asks you to update payment details on a fake login page.', riskLevel: 'high-risk', tip: 'Go directly to the streaming service website or app instead of clicking links in emails or texts.' },
  { title: 'Utility Shutoff Threat', emoji: '⚡️', description: 'Someone calls saying they are from your hydro or gas company and will cut off your power today unless you pay immediately.', riskLevel: 'high-risk', tip: "Hang up and call your utility provider using the number on your bill; utilities don't demand instant payment by phone." },
  { title: 'Auto Warranty Robocall', emoji: '🚗', description: 'You get repeated robocalls about your car warranty expiring, pushing you to provide personal or payment information.', riskLevel: 'suspicious', tip: 'Treat unsolicited warranty offers as suspicious and verify coverage only with your dealer or insurer.' },
  { title: 'Prize or Lottery Win', emoji: '🎉', description: 'You are told you have won a lottery, grant, or prize that you never entered, but must pay fees or taxes upfront to receive it.', riskLevel: 'very-likely-scam', tip: 'Legitimate lotteries do not charge you fees to claim your winnings.' },
  { title: 'Fake Charity Appeal', emoji: '❤️', description: 'Scammers pose as a charity or disaster relief fund, often after a crisis, and pressure you to donate quickly by e‑transfer or gift card.', riskLevel: 'high-risk', tip: 'Look up the charity on an official registry and donate through their verified website.' },
  { title: 'Job Offer / Work-From-Home Scam', emoji: '💼', description: 'You receive a "too good to be true" job offer with high pay for little work, then are asked to pay for training, equipment, or to process payments.', riskLevel: 'very-likely-scam', tip: 'Legitimate employers do not charge you to get hired or ask you to move money for them.' },
  { title: 'Student Loan Forgiveness Scam', emoji: '🎓', description: 'A caller or email promises government-backed student loan forgiveness or reduced payments if you pay a processing fee.', riskLevel: 'high-risk', tip: 'Check official government or loan servicer websites for real relief programs; never pay a third party to apply.' },
  { title: 'Fake Rental Listing', emoji: '🏠', description: "A cheap rental is posted online and the \"landlord\" asks for a deposit or first month's rent before you can see the unit.", riskLevel: 'very-likely-scam', tip: 'Never send rent or deposits before viewing the property and signing a legitimate lease.' },
  { title: 'Social Insurance Number (SIN) Threat', emoji: '🆔', description: 'Someone claims your SIN is compromised or suspended and says your bank accounts will be frozen unless you act immediately.', riskLevel: 'very-likely-scam', tip: 'Government agencies will not suspend your SIN or threaten arrest over the phone.' },
  { title: 'Government Rebate / Benefit Scam', emoji: '📑', description: 'You are offered a special government rebate, tax credit, or benefit refund if you click a link or pay a small "processing" fee.', riskLevel: 'high-risk', tip: 'Confirm any benefit or rebate on official government websites, not through links in emails or texts.' },
  { title: 'CERB / Benefit Overpayment Scam', emoji: '💼', description: 'An email or call claims you were overpaid pandemic or income benefits and must repay immediately via e‑transfer or gift cards.', riskLevel: 'high-risk', tip: 'Sign in to your official government benefits account or call the real agency to check your balance.' },
  { title: 'Romance Investment Scam', emoji: '💔', description: 'Someone you met on a dating app builds trust, then convinces you to move money into a "sure thing" crypto or trading platform.', riskLevel: 'very-likely-scam', tip: 'Never send money or invest based on advice from someone you have only met online.' },
  { title: 'Pig Butchering Investment Scam', emoji: '🐷', description: 'A scammer slowly builds the relationship with daily chats and small fake profits before pushing you to deposit large sums into a fake platform.', riskLevel: 'very-likely-scam', tip: 'Be wary of anyone who mixes romance and investing, especially with offshore or unknown platforms.' },
  { title: 'Crypto Recovery or "Refund" Service', emoji: '🪙', description: 'After a previous scam, someone offers to help recover your lost crypto or funds for a fee or more personal information.', riskLevel: 'very-likely-scam', tip: 'Recovery offers that contact you out of the blue are almost always scams on top of the original scam.' },
  { title: 'Fake Bank Security Department', emoji: '🔐', description: "A caller claims to be from your bank's fraud team and asks you to move money to a \"safe account\" to protect it.", riskLevel: 'very-likely-scam', tip: 'Banks will never ask you to transfer funds to a new account to keep them safe.' },
  { title: 'Online Marketplace Overpayment', emoji: '🛒', description: 'A buyer overpays for an item on an online marketplace and asks you to refund the difference, then the original payment bounces.', riskLevel: 'high-risk', tip: 'Avoid overpayment deals and keep all communication and payment inside the platform where possible.' },
  { title: 'Too-Good-To-Be-True Marketplace Deal', emoji: '💻', description: 'Expensive items like phones, consoles, or tickets are listed far below market price and the seller pushes for quick e‑transfer.', riskLevel: 'high-risk', tip: 'If the price is unrealistically low and the seller refuses secure payment or pickup, walk away.' },
  { title: 'Subscription Trap / Free Trial', emoji: '🧾', description: 'A "free trial" for a product or service hides recurring charges in the fine print and is hard to cancel.', riskLevel: 'suspicious', tip: 'Read the terms before entering card details and set reminders to cancel if you do sign up.' },
  { title: 'Fake Parking Ticket or QR Code', emoji: '🅿️', description: 'You find a ticket on your windshield or a QR code on a meter directing you to pay a fine on a fake site.', riskLevel: 'high-risk', tip: "Verify tickets and payment options on your city's official website and avoid scanning random QR codes." },
  { title: 'Social Media Impersonation', emoji: '👤', description: "A friend's account appears to message you about urgent money needs, investment tips, or giveaway links.", riskLevel: 'high-risk', tip: 'Verify by calling or messaging them through another channel before sending money or clicking links.' },
];

const RISK_COLORS: Record<RiskLevel, { border: string; label: string }> = {
  safe: { border: '#28a745', label: 'Low Risk' },
  suspicious: { border: '#f0ad4e', label: 'Suspicious' },
  'high-risk': { border: '#d9534f', label: 'High Risk' },
  'very-likely-scam': { border: '#c0392b', label: 'Very Likely a Scam' },
};

function getDayOfYear(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / 86400000);
}

export function ScamOfTheDay({ date }: ScamOfTheDayProps) {
  const effectiveDate = date ?? new Date();
  const dayOfYear = getDayOfYear(effectiveDate);
  const scam = DAILY_SCAMS[dayOfYear % DAILY_SCAMS.length];
  const riskInfo = RISK_COLORS[scam.riskLevel];

  return (
    <section
      aria-label="Scam of the day"
      style={{
        marginTop: '24px',
        padding: '16px 18px',
        borderRadius: '12px',
        border: `2px solid ${riskInfo.border}`,
        backgroundColor: 'var(--tc-surface)',
        color: 'var(--tc-text-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{scam.emoji}</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '999px',
              backgroundColor: 'var(--tc-primary-soft)',
              color: 'var(--tc-text-main)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>⚠️</span>
            <span>Scam of the Day</span>
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--tc-text-muted)' }}>
          Risk: {riskInfo.label}
        </span>
      </div>

      <div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{scam.title}</h3>
        <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.5, color: 'var(--tc-text-main)' }}>
          {scam.description}
        </p>
      </div>

      <div
        style={{
          marginTop: '8px',
          padding: '10px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--tc-primary-soft)',
          color: 'var(--tc-text-main)',
          fontSize: '13px',
          lineHeight: 1.5,
        }}
      >
        <strong>Tip:</strong> <span>{scam.tip}</span>
      </div>

      <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="/learn"
          style={{ fontSize: '13px', color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 500 }}
        >
          Learn more →
        </a>
      </div>
    </section>
  );
}
