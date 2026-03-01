import type { ScamCampaign } from './types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const seedCampaigns: ScamCampaign[] = [
  // ── 1. CRA Tax Scam ──────────────────────────────────────────
  {
    id: 'camp_cra_tax',
    family_name: 'CRA Tax Scam',
    category: 'CRA_IRS',
    first_seen: '2024-01-15T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 4821,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_cra_1', campaign_id: 'camp_cra_tax', variant_number: 1,
        template_text: 'This is a final notice from Canada Revenue Agency. There is a lawsuit filed against your Social Insurance Number. You owe back taxes of $3,847.26. If payment is not made within 24 hours, a warrant will be issued for your arrest. Press 1 to speak to a CRA officer immediately.',
        language_hash: '', phone_numbers: ['+16475551234', '+14165559876'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'crypto', 'wire transfer'], demand_amount_range: { min: 2000, max: 8000, currency: 'CAD' },
        first_seen: '2024-01-15T00:00:00Z', report_count: 2100,
      },
      {
        id: 'var_cra_2', campaign_id: 'camp_cra_tax', variant_number: 2,
        template_text: 'URGENT: CRA Notice — Your tax return has been flagged for fraud. Reference #CRA-2026-4891. Failure to verify your identity within 2 hours will result in account seizure. Call 1-888-555-0147 now.',
        language_hash: '', phone_numbers: ['+18885550147'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'e-Transfer'], demand_amount_range: { min: 1500, max: 5000, currency: 'CAD' },
        first_seen: '2025-03-01T00:00:00Z', report_count: 1400,
      },
      {
        id: 'var_cra_3', campaign_id: 'camp_cra_tax', variant_number: 3,
        template_text: 'CRA ALERT: You have an outstanding balance of $4,216.00. Your bank accounts will be frozen today unless resolved. Reply YES to arrange payment or face legal action.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'gift card'], demand_amount_range: { min: 3000, max: 6000, currency: 'CAD' },
        first_seen: '2025-11-10T00:00:00Z', report_count: 1321,
      },
    ],
    indicators: [
      { id: 'ind_cra_p1', campaign_id: 'camp_cra_tax', type: 'phone', value: '+16475551234', first_seen: '2024-01-15T00:00:00Z', last_seen: daysAgo(3), report_count: 890 },
      { id: 'ind_cra_p2', campaign_id: 'camp_cra_tax', type: 'phone', value: '+14165559876', first_seen: '2024-06-01T00:00:00Z', last_seen: daysAgo(7), report_count: 430 },
      { id: 'ind_cra_p3', campaign_id: 'camp_cra_tax', type: 'phone', value: '+18885550147', first_seen: '2025-03-01T00:00:00Z', last_seen: daysAgo(1), report_count: 1200 },
    ],
  },

  // ── 2. Canada Post Delivery Scam ──────────────────────────────
  {
    id: 'camp_canada_post',
    family_name: 'Canada Post Delivery Scam',
    category: 'DELIVERY',
    first_seen: '2024-09-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 3215,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS'],
    variants: [
      {
        id: 'var_cp_1', campaign_id: 'camp_canada_post', variant_number: 1,
        template_text: 'Canada Post: Your package #CP9847261 could not be delivered due to incomplete address. Please update your delivery details at: https://canadapost-tracking.delivery.com/update',
        language_hash: '', phone_numbers: [], urls: ['https://canadapost-tracking.delivery.com/update'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 1, max: 5, currency: 'CAD' },
        first_seen: '2024-09-01T00:00:00Z', report_count: 1800,
      },
      {
        id: 'var_cp_2', campaign_id: 'camp_canada_post', variant_number: 2,
        template_text: 'Your Canada Post shipment has been held at customs. A fee of $3.99 is required to release your package. Pay now: https://ca-post-customs.info/pay',
        language_hash: '', phone_numbers: [], urls: ['https://ca-post-customs.info/pay'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 2, max: 8, currency: 'CAD' },
        first_seen: '2025-01-15T00:00:00Z', report_count: 1415,
      },
      {
        id: 'var_cp_3', campaign_id: 'camp_canada_post', variant_number: 3,
        template_text: 'CP Notification: Delivery attempt failed for parcel #1Z9482716CA. Reschedule your delivery here: https://cpdelivery-reschedule.com/track',
        language_hash: '', phone_numbers: [], urls: ['https://cpdelivery-reschedule.com/track'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 1, max: 5, currency: 'CAD' },
        first_seen: '2025-06-01T00:00:00Z', report_count: 800,
      },
    ],
    indicators: [
      { id: 'ind_cp_u1', campaign_id: 'camp_canada_post', type: 'url', value: 'https://canadapost-tracking.delivery.com/update', first_seen: '2024-09-01T00:00:00Z', last_seen: daysAgo(2), report_count: 1800 },
      { id: 'ind_cp_u2', campaign_id: 'camp_canada_post', type: 'url', value: 'https://ca-post-customs.info/pay', first_seen: '2025-01-15T00:00:00Z', last_seen: daysAgo(5), report_count: 1415 },
      { id: 'ind_cp_u3', campaign_id: 'camp_canada_post', type: 'url', value: 'https://cpdelivery-reschedule.com/track', first_seen: '2025-06-01T00:00:00Z', last_seen: daysAgo(0), report_count: 800 },
      { id: 'ind_cp_d1', campaign_id: 'camp_canada_post', type: 'domain', value: 'canadapost-tracking.delivery.com', first_seen: '2024-09-01T00:00:00Z', last_seen: daysAgo(2), report_count: 1800 },
    ],
  },

  // ── 3. Rogers/Bell/Telus Billing Scam ─────────────────────────
  {
    id: 'camp_telecom_billing',
    family_name: 'Telecom Billing Scam (Rogers/Bell/Telus)',
    category: 'TELECOM',
    first_seen: '2024-05-01T00:00:00Z',
    last_seen: daysAgo(2),
    report_count: 2190,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_tel_1', campaign_id: 'camp_telecom_billing', variant_number: 1,
        template_text: 'Rogers: Your account has been overcharged $89.50. To claim your refund, visit: https://rogers-billing-refund.com/claim. This offer expires in 24 hours.',
        language_hash: '', phone_numbers: [], urls: ['https://rogers-billing-refund.com/claim'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-05-01T00:00:00Z', report_count: 900,
      },
      {
        id: 'var_tel_2', campaign_id: 'camp_telecom_billing', variant_number: 2,
        template_text: 'Bell Canada: Your payment of $127.43 was declined. Service will be suspended within 6 hours. Update payment method: https://bell-payment-update.net/secure',
        language_hash: '', phone_numbers: [], urls: ['https://bell-payment-update.net/secure'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 80, max: 200, currency: 'CAD' },
        first_seen: '2024-08-01T00:00:00Z', report_count: 750,
      },
      {
        id: 'var_tel_3', campaign_id: 'camp_telecom_billing', variant_number: 3,
        template_text: 'TELUS: Congratulations! You\'ve been selected for a loyalty discount of 50% off your next 3 months. Confirm here: https://telus-loyalty-offer.com/redeem',
        language_hash: '', phone_numbers: [], urls: ['https://telus-loyalty-offer.com/redeem'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2025-02-01T00:00:00Z', report_count: 540,
      },
    ],
    indicators: [
      { id: 'ind_tel_u1', campaign_id: 'camp_telecom_billing', type: 'domain', value: 'rogers-billing-refund.com', first_seen: '2024-05-01T00:00:00Z', last_seen: daysAgo(10), report_count: 900 },
      { id: 'ind_tel_u2', campaign_id: 'camp_telecom_billing', type: 'domain', value: 'bell-payment-update.net', first_seen: '2024-08-01T00:00:00Z', last_seen: daysAgo(5), report_count: 750 },
      { id: 'ind_tel_u3', campaign_id: 'camp_telecom_billing', type: 'domain', value: 'telus-loyalty-offer.com', first_seen: '2025-02-01T00:00:00Z', last_seen: daysAgo(2), report_count: 540 },
    ],
  },

  // ── 4. Interac e-Transfer Scam ────────────────────────────────
  {
    id: 'camp_etransfer',
    family_name: 'Interac e-Transfer Scam',
    category: 'BANK',
    first_seen: '2024-03-01T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 2870,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB'],
    variants: [
      {
        id: 'var_et_1', campaign_id: 'camp_etransfer', variant_number: 1,
        template_text: 'You have received an Interac e-Transfer of $450.00 from DAVID M. Click here to deposit: https://interac-etransfer-deposit.com/accept?ref=8847261',
        language_hash: '', phone_numbers: [], urls: ['https://interac-etransfer-deposit.com/accept'], email_addresses: ['etransfer-noreply@interac-mail.com'], crypto_wallets: [],
        payment_methods: [], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-03-01T00:00:00Z', report_count: 1600,
      },
      {
        id: 'var_et_2', campaign_id: 'camp_etransfer', variant_number: 2,
        template_text: 'INTERAC Alert: Your e-Transfer of $285.00 to JENNIFER K has been flagged. If you did not authorize this, cancel immediately: https://interac-security-alert.com/cancel',
        language_hash: '', phone_numbers: [], urls: ['https://interac-security-alert.com/cancel'], email_addresses: [], crypto_wallets: [],
        payment_methods: [], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-11-01T00:00:00Z', report_count: 1270,
      },
    ],
    indicators: [
      { id: 'ind_et_u1', campaign_id: 'camp_etransfer', type: 'domain', value: 'interac-etransfer-deposit.com', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(3), report_count: 1600 },
      { id: 'ind_et_u2', campaign_id: 'camp_etransfer', type: 'domain', value: 'interac-security-alert.com', first_seen: '2024-11-01T00:00:00Z', last_seen: daysAgo(1), report_count: 1270 },
      { id: 'ind_et_e1', campaign_id: 'camp_etransfer', type: 'email', value: 'etransfer-noreply@interac-mail.com', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(5), report_count: 800 },
    ],
  },

  // ── 5. RCMP Arrest Warrant Scam ───────────────────────────────
  {
    id: 'camp_rcmp',
    family_name: 'RCMP Arrest Warrant Scam',
    category: 'GOVERNMENT',
    first_seen: '2024-02-01T00:00:00Z',
    last_seen: daysAgo(3),
    report_count: 1890,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB'],
    variants: [
      {
        id: 'var_rcmp_1', campaign_id: 'camp_rcmp', variant_number: 1,
        template_text: 'This is Sergeant Williams from the RCMP. A warrant has been issued for your arrest due to suspicious activity linked to your SIN. Press 1 to speak with an officer or face immediate arrest.',
        language_hash: '', phone_numbers: ['+16135550199', '+18735550188'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'crypto'], demand_amount_range: { min: 3000, max: 15000, currency: 'CAD' },
        first_seen: '2024-02-01T00:00:00Z', report_count: 1100,
      },
      {
        id: 'var_rcmp_2', campaign_id: 'camp_rcmp', variant_number: 2,
        template_text: 'RCMP URGENT: Your Social Insurance Number has been used in criminal activity. Case #RCMP-2026-7741. Failure to respond within 1 hour will result in arrest. Call back at 1-873-555-0188.',
        language_hash: '', phone_numbers: ['+18735550188'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'wire transfer'], demand_amount_range: { min: 2000, max: 10000, currency: 'CAD' },
        first_seen: '2025-06-01T00:00:00Z', report_count: 790,
      },
    ],
    indicators: [
      { id: 'ind_rcmp_p1', campaign_id: 'camp_rcmp', type: 'phone', value: '+16135550199', first_seen: '2024-02-01T00:00:00Z', last_seen: daysAgo(10), report_count: 700 },
      { id: 'ind_rcmp_p2', campaign_id: 'camp_rcmp', type: 'phone', value: '+18735550188', first_seen: '2024-06-01T00:00:00Z', last_seen: daysAgo(3), report_count: 900 },
    ],
  },

  // ── 6. Romance Scam ───────────────────────────────────────────
  {
    id: 'camp_romance',
    family_name: 'Romance Scam',
    category: 'ROMANCE',
    first_seen: '2023-06-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 5400,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'],
    variants: [
      {
        id: 'var_rom_1', campaign_id: 'camp_romance', variant_number: 1,
        template_text: 'Hi dear, I saw your profile and I think you are very beautiful. I am a petroleum engineer working on an offshore rig. I would love to get to know you better. Can we chat on WhatsApp? My number is +1-437-555-0122.',
        language_hash: '', phone_numbers: ['+14375550122'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['wire transfer', 'crypto', 'gift card'], demand_amount_range: { min: 500, max: 50000, currency: 'CAD' },
        first_seen: '2023-06-01T00:00:00Z', report_count: 2200,
      },
      {
        id: 'var_rom_2', campaign_id: 'camp_romance', variant_number: 2,
        template_text: 'Baby I miss you so much. I need your help urgently. My wallet was stolen and I am stuck at the airport in Istanbul. Can you send me $2,500 through Western Union so I can buy a ticket home? I will pay you back as soon as I arrive. Please hurry.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['wire transfer', 'e-Transfer'], demand_amount_range: { min: 1000, max: 10000, currency: 'CAD' },
        first_seen: '2024-01-01T00:00:00Z', report_count: 1800,
      },
      {
        id: 'var_rom_3', campaign_id: 'camp_romance', variant_number: 3,
        template_text: 'I have a great investment opportunity. My friend is a crypto trader and he can double your money in 2 weeks. I already made $15,000. You just need to send $5,000 to get started. I will guide you through it. Trust me, this is real.',
        language_hash: '', phone_numbers: [], urls: ['https://crypto-invest-global.com'], email_addresses: [], crypto_wallets: ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
        payment_methods: ['crypto'], demand_amount_range: { min: 2000, max: 20000, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 1400,
      },
    ],
    indicators: [
      { id: 'ind_rom_p1', campaign_id: 'camp_romance', type: 'phone', value: '+14375550122', first_seen: '2023-06-01T00:00:00Z', last_seen: daysAgo(5), report_count: 450 },
      { id: 'ind_rom_w1', campaign_id: 'camp_romance', type: 'crypto_wallet', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(2), report_count: 340 },
    ],
  },

  // ── 7. Crypto Investment Scam ─────────────────────────────────
  {
    id: 'camp_crypto_invest',
    family_name: 'Crypto Investment Scam',
    category: 'INVESTMENT',
    first_seen: '2024-01-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 3100,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_ci_1', campaign_id: 'camp_crypto_invest', variant_number: 1,
        template_text: '🔥 GUARANTEED 300% returns on Bitcoin! Join our exclusive trading group. Minimum investment $500. Trusted by 10,000+ investors worldwide. DM @CryptoKingTrader on Telegram to start earning TODAY.',
        language_hash: '', phone_numbers: [], urls: ['https://t.me/CryptoKingTrader'], email_addresses: [], crypto_wallets: ['0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38'],
        payment_methods: ['crypto'], demand_amount_range: { min: 500, max: 100000, currency: 'CAD' },
        first_seen: '2024-01-01T00:00:00Z', report_count: 1500,
      },
      {
        id: 'var_ci_2', campaign_id: 'camp_crypto_invest', variant_number: 2,
        template_text: 'Hi! I found an amazing AI trading bot that makes $5,000/day. I started with only $1,000 and withdrew $47,000 last month. Check it out: https://ai-trade-profits.io/join. Use my referral code for bonus!',
        language_hash: '', phone_numbers: [], urls: ['https://ai-trade-profits.io/join'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['crypto', 'wire transfer'], demand_amount_range: { min: 1000, max: 50000, currency: 'CAD' },
        first_seen: '2025-03-01T00:00:00Z', report_count: 1600,
      },
    ],
    indicators: [
      { id: 'ind_ci_w1', campaign_id: 'camp_crypto_invest', type: 'crypto_wallet', value: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38', first_seen: '2024-01-01T00:00:00Z', last_seen: daysAgo(1), report_count: 890 },
      { id: 'ind_ci_d1', campaign_id: 'camp_crypto_invest', type: 'domain', value: 'ai-trade-profits.io', first_seen: '2025-03-01T00:00:00Z', last_seen: daysAgo(0), report_count: 1200 },
    ],
  },

  // ── 8. Job Recruitment Scam ───────────────────────────────────
  {
    id: 'camp_job_recruit',
    family_name: 'Job Recruitment Scam',
    category: 'EMPLOYMENT',
    first_seen: '2024-06-01T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 1740,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB'],
    variants: [
      {
        id: 'var_job_1', campaign_id: 'camp_job_recruit', variant_number: 1,
        template_text: 'Hi! We saw your resume on Indeed. We have a remote data entry position paying $35-45/hr. No experience needed. Add our HR manager on WhatsApp: +1-647-555-0198 to schedule your interview.',
        language_hash: '', phone_numbers: ['+16475550198'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: [], demand_amount_range: { min: 0, max: 500, currency: 'CAD' },
        first_seen: '2024-06-01T00:00:00Z', report_count: 800,
      },
      {
        id: 'var_job_2', campaign_id: 'camp_job_recruit', variant_number: 2,
        template_text: 'Congratulations! You have been selected for a remote customer service position with Amazon Canada. Starting salary: $4,200/month. To proceed, please purchase a home office setup kit ($299) which will be reimbursed on your first paycheck.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: ['hr-amazon-careers@outlook.com'], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'gift card'], demand_amount_range: { min: 100, max: 500, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 940,
      },
    ],
    indicators: [
      { id: 'ind_job_p1', campaign_id: 'camp_job_recruit', type: 'phone', value: '+16475550198', first_seen: '2024-06-01T00:00:00Z', last_seen: daysAgo(3), report_count: 500 },
      { id: 'ind_job_e1', campaign_id: 'camp_job_recruit', type: 'email', value: 'hr-amazon-careers@outlook.com', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(1), report_count: 680 },
    ],
  },

  // ── 9. Tech Support Scam ──────────────────────────────────────
  {
    id: 'camp_tech_support',
    family_name: 'Tech Support Scam (Microsoft/Apple)',
    category: 'TECH_SUPPORT',
    first_seen: '2023-01-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 6200,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
    variants: [
      {
        id: 'var_ts_1', campaign_id: 'camp_tech_support', variant_number: 1,
        template_text: 'MICROSOFT SECURITY ALERT: Your computer has been compromised. Hackers have accessed your banking information. DO NOT turn off your computer. Call Microsoft Support immediately at 1-888-555-0176 to secure your accounts.',
        language_hash: '', phone_numbers: ['+18885550176'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'wire transfer'], demand_amount_range: { min: 200, max: 2000, currency: 'CAD' },
        first_seen: '2023-01-01T00:00:00Z', report_count: 3500,
      },
      {
        id: 'var_ts_2', campaign_id: 'camp_tech_support', variant_number: 2,
        template_text: 'Your Apple ID has been locked due to suspicious activity. Your iCloud photos and data will be permanently deleted in 24 hours. Verify your identity at: https://apple-id-verify-secure.com/unlock',
        language_hash: '', phone_numbers: [], urls: ['https://apple-id-verify-secure.com/unlock'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card', 'gift card'], demand_amount_range: { min: 0, max: 500, currency: 'CAD' },
        first_seen: '2024-06-01T00:00:00Z', report_count: 2700,
      },
    ],
    indicators: [
      { id: 'ind_ts_p1', campaign_id: 'camp_tech_support', type: 'phone', value: '+18885550176', first_seen: '2023-01-01T00:00:00Z', last_seen: daysAgo(0), report_count: 3500 },
      { id: 'ind_ts_d1', campaign_id: 'camp_tech_support', type: 'domain', value: 'apple-id-verify-secure.com', first_seen: '2024-06-01T00:00:00Z', last_seen: daysAgo(2), report_count: 2700 },
    ],
  },

  // ── 10. 407 ETR Toll Scam ─────────────────────────────────────
  {
    id: 'camp_407etr',
    family_name: '407 ETR Toll Scam',
    category: 'GOVERNMENT',
    first_seen: '2025-06-01T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 980,
    status: 'active',
    regions: ['ON'],
    variants: [
      {
        id: 'var_407_1', campaign_id: 'camp_407etr', variant_number: 1,
        template_text: '407 ETR: You have an unpaid toll balance of $14.75. Pay within 48 hours to avoid a $50 late fee and licence plate denial. Pay now: https://407etr-payment.com/balance',
        language_hash: '', phone_numbers: [], urls: ['https://407etr-payment.com/balance'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 10, max: 50, currency: 'CAD' },
        first_seen: '2025-06-01T00:00:00Z', report_count: 600,
      },
      {
        id: 'var_407_2', campaign_id: 'camp_407etr', variant_number: 2,
        template_text: 'NOTICE: Your 407 ETR account has outstanding charges. Your vehicle registration may be affected. Settle your balance: https://407-toll-pay.ca/settle',
        language_hash: '', phone_numbers: [], urls: ['https://407-toll-pay.ca/settle'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 10, max: 75, currency: 'CAD' },
        first_seen: '2025-10-01T00:00:00Z', report_count: 380,
      },
    ],
    indicators: [
      { id: 'ind_407_d1', campaign_id: 'camp_407etr', type: 'domain', value: '407etr-payment.com', first_seen: '2025-06-01T00:00:00Z', last_seen: daysAgo(1), report_count: 600 },
      { id: 'ind_407_d2', campaign_id: 'camp_407etr', type: 'domain', value: '407-toll-pay.ca', first_seen: '2025-10-01T00:00:00Z', last_seen: daysAgo(3), report_count: 380 },
    ],
  },

  // ── 11. Amazon Account Scam ───────────────────────────────────
  {
    id: 'camp_amazon',
    family_name: 'Amazon Account Scam',
    category: 'MARKETPLACE',
    first_seen: '2024-04-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 2450,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_amz_1', campaign_id: 'camp_amazon', variant_number: 1,
        template_text: 'Amazon: A purchase of $849.99 (MacBook Pro) was made on your account. If you did not authorize this, call us immediately at 1-888-555-0134 to cancel and get a refund.',
        language_hash: '', phone_numbers: ['+18885550134'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'wire transfer'], demand_amount_range: { min: 200, max: 2000, currency: 'CAD' },
        first_seen: '2024-04-01T00:00:00Z', report_count: 1300,
      },
      {
        id: 'var_amz_2', campaign_id: 'camp_amazon', variant_number: 2,
        template_text: 'Your Amazon Prime membership will be renewed for $139.99 today. If you wish to cancel, call 1-800-555-0167. Press 1 for customer service.',
        language_hash: '', phone_numbers: ['+18005550167'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card'], demand_amount_range: { min: 100, max: 500, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 1150,
      },
    ],
    indicators: [
      { id: 'ind_amz_p1', campaign_id: 'camp_amazon', type: 'phone', value: '+18885550134', first_seen: '2024-04-01T00:00:00Z', last_seen: daysAgo(0), report_count: 1300 },
      { id: 'ind_amz_p2', campaign_id: 'camp_amazon', type: 'phone', value: '+18005550167', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(2), report_count: 1150 },
    ],
  },

  // ── 12. Netflix/Disney+ Subscription Scam ─────────────────────
  {
    id: 'camp_streaming',
    family_name: 'Streaming Service Scam (Netflix/Disney+)',
    category: 'MARKETPLACE',
    first_seen: '2024-07-01T00:00:00Z',
    last_seen: daysAgo(2),
    report_count: 1680,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB'],
    variants: [
      {
        id: 'var_str_1', campaign_id: 'camp_streaming', variant_number: 1,
        template_text: 'Netflix: Your payment method has expired. Update your billing info within 24 hours to avoid account suspension: https://netflix-billing-update.com/verify',
        language_hash: '', phone_numbers: [], urls: ['https://netflix-billing-update.com/verify'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-07-01T00:00:00Z', report_count: 900,
      },
      {
        id: 'var_str_2', campaign_id: 'camp_streaming', variant_number: 2,
        template_text: 'Disney+: We were unable to process your monthly payment of $13.99. Your account will be deactivated. Verify here: https://disneyplus-verify.com/account',
        language_hash: '', phone_numbers: [], urls: ['https://disneyplus-verify.com/account'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2025-02-01T00:00:00Z', report_count: 780,
      },
    ],
    indicators: [
      { id: 'ind_str_d1', campaign_id: 'camp_streaming', type: 'domain', value: 'netflix-billing-update.com', first_seen: '2024-07-01T00:00:00Z', last_seen: daysAgo(5), report_count: 900 },
      { id: 'ind_str_d2', campaign_id: 'camp_streaming', type: 'domain', value: 'disneyplus-verify.com', first_seen: '2025-02-01T00:00:00Z', last_seen: daysAgo(2), report_count: 780 },
    ],
  },

  // ── 13. Bank Fraud Department Impersonation ───────────────────
  {
    id: 'camp_bank_fraud',
    family_name: 'Bank Fraud Department Impersonation',
    category: 'BANK',
    first_seen: '2023-11-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 4100,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS'],
    variants: [
      {
        id: 'var_bank_1', campaign_id: 'camp_bank_fraud', variant_number: 1,
        template_text: 'TD Fraud Alert: A suspicious transaction of $1,247.00 was detected on your account ending in 4821. If this was not you, call our fraud team immediately at 1-833-555-0192.',
        language_hash: '', phone_numbers: ['+18335550192'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2023-11-01T00:00:00Z', report_count: 1200,
      },
      {
        id: 'var_bank_2', campaign_id: 'camp_bank_fraud', variant_number: 2,
        template_text: 'RBC Royal Bank Security: Your online banking has been temporarily locked. We detected unauthorized access from a foreign IP. Verify your identity: https://rbc-secure-verify.com/unlock',
        language_hash: '', phone_numbers: [], urls: ['https://rbc-secure-verify.com/unlock'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-03-01T00:00:00Z', report_count: 950,
      },
      {
        id: 'var_bank_3', campaign_id: 'camp_bank_fraud', variant_number: 3,
        template_text: 'Scotiabank Alert: Someone tried to send an e-Transfer of $3,500 from your account. To block this transaction, call 1-855-555-0143. Do not use your Scotia app until verified.',
        language_hash: '', phone_numbers: ['+18555550143'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2024-08-01T00:00:00Z', report_count: 870,
      },
      {
        id: 'var_bank_4', campaign_id: 'camp_bank_fraud', variant_number: 4,
        template_text: 'BMO Financial: Urgent — Your debit card has been cloned. We need to verify your identity and issue a replacement. Call our secure line: 1-844-555-0156. Have your card number ready.',
        language_hash: '', phone_numbers: ['+18445550156'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: [], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 620,
      },
      {
        id: 'var_bank_5', campaign_id: 'camp_bank_fraud', variant_number: 5,
        template_text: 'CIBC: Your account has been flagged for unusual activity. A charge of $2,891.00 is pending. If unauthorized, verify immediately at https://cibc-fraud-center.com/verify',
        language_hash: '', phone_numbers: [], urls: ['https://cibc-fraud-center.com/verify'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2025-05-01T00:00:00Z', report_count: 460,
      },
    ],
    indicators: [
      { id: 'ind_bank_p1', campaign_id: 'camp_bank_fraud', type: 'phone', value: '+18335550192', first_seen: '2023-11-01T00:00:00Z', last_seen: daysAgo(0), report_count: 1200 },
      { id: 'ind_bank_d1', campaign_id: 'camp_bank_fraud', type: 'domain', value: 'rbc-secure-verify.com', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(3), report_count: 950 },
      { id: 'ind_bank_p2', campaign_id: 'camp_bank_fraud', type: 'phone', value: '+18555550143', first_seen: '2024-08-01T00:00:00Z', last_seen: daysAgo(1), report_count: 870 },
      { id: 'ind_bank_p3', campaign_id: 'camp_bank_fraud', type: 'phone', value: '+18445550156', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(5), report_count: 620 },
      { id: 'ind_bank_d2', campaign_id: 'camp_bank_fraud', type: 'domain', value: 'cibc-fraud-center.com', first_seen: '2025-05-01T00:00:00Z', last_seen: daysAgo(2), report_count: 460 },
    ],
  },

  // ── 14. SIN Number Scam ───────────────────────────────────────
  {
    id: 'camp_sin',
    family_name: 'SIN Number Scam',
    category: 'IDENTITY',
    first_seen: '2024-01-01T00:00:00Z',
    last_seen: daysAgo(2),
    report_count: 2340,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK'],
    variants: [
      {
        id: 'var_sin_1', campaign_id: 'camp_sin', variant_number: 1,
        template_text: 'Service Canada: Your Social Insurance Number has been compromised and is being used for illegal activity. Your SIN will be suspended. Press 1 to speak with a Service Canada agent to resolve this immediately.',
        language_hash: '', phone_numbers: ['+18005550129'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'crypto'], demand_amount_range: { min: 1000, max: 5000, currency: 'CAD' },
        first_seen: '2024-01-01T00:00:00Z', report_count: 1400,
      },
      {
        id: 'var_sin_2', campaign_id: 'camp_sin', variant_number: 2,
        template_text: 'URGENT: Multiple bank accounts have been opened under your SIN ending in 847. These accounts are linked to money laundering. Contact our investigation unit at 1-866-555-0173 or you will be charged as an accessory.',
        language_hash: '', phone_numbers: ['+18665550173'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'wire transfer'], demand_amount_range: { min: 2000, max: 8000, currency: 'CAD' },
        first_seen: '2025-04-01T00:00:00Z', report_count: 940,
      },
    ],
    indicators: [
      { id: 'ind_sin_p1', campaign_id: 'camp_sin', type: 'phone', value: '+18005550129', first_seen: '2024-01-01T00:00:00Z', last_seen: daysAgo(5), report_count: 1400 },
      { id: 'ind_sin_p2', campaign_id: 'camp_sin', type: 'phone', value: '+18665550173', first_seen: '2025-04-01T00:00:00Z', last_seen: daysAgo(2), report_count: 940 },
    ],
  },

  // ── 15. Immigration/IRCC Scam ─────────────────────────────────
  {
    id: 'camp_ircc',
    family_name: 'Immigration/IRCC Scam',
    category: 'GOVERNMENT',
    first_seen: '2024-03-01T00:00:00Z',
    last_seen: daysAgo(3),
    report_count: 1560,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB'],
    variants: [
      {
        id: 'var_ircc_1', campaign_id: 'camp_ircc', variant_number: 1,
        template_text: 'IRCC Notice: Your immigration application #IMM-2026-48291 has a critical issue. You must pay a processing fee of $450 within 24 hours or your application will be cancelled. Pay at: https://ircc-application-fee.com/pay',
        language_hash: '', phone_numbers: [], urls: ['https://ircc-application-fee.com/pay'], email_addresses: ['ircc-processing@immigration-gov.com'], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'wire transfer'], demand_amount_range: { min: 200, max: 1000, currency: 'CAD' },
        first_seen: '2024-03-01T00:00:00Z', report_count: 900,
      },
      {
        id: 'var_ircc_2', campaign_id: 'camp_ircc', variant_number: 2,
        template_text: 'Your work permit is about to expire and you risk deportation. We can fast-track your renewal for a fee of $800. Contact our immigration consultant at +1-437-555-0189. Limited spots available.',
        language_hash: '', phone_numbers: ['+14375550189'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'wire transfer'], demand_amount_range: { min: 500, max: 2000, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 660,
      },
    ],
    indicators: [
      { id: 'ind_ircc_d1', campaign_id: 'camp_ircc', type: 'domain', value: 'ircc-application-fee.com', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(10), report_count: 900 },
      { id: 'ind_ircc_e1', campaign_id: 'camp_ircc', type: 'email', value: 'ircc-processing@immigration-gov.com', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(5), report_count: 700 },
      { id: 'ind_ircc_p1', campaign_id: 'camp_ircc', type: 'phone', value: '+14375550189', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(3), report_count: 400 },
    ],
  },

  // ── 16. Rental Scam ───────────────────────────────────────────
  {
    id: 'camp_rental',
    family_name: 'Rental Scam (Kijiji/Facebook)',
    category: 'RENTAL',
    first_seen: '2024-04-01T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 1920,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_rent_1', campaign_id: 'camp_rental', variant_number: 1,
        template_text: 'Beautiful 2BR apartment downtown Toronto, $1,200/month all inclusive. I am currently out of the country for work but can arrange a virtual tour. Please send first and last month rent via e-Transfer to secure the unit before someone else takes it. References available upon request.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: ['landlord.toronto.apt@gmail.com'], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'wire transfer'], demand_amount_range: { min: 1500, max: 5000, currency: 'CAD' },
        first_seen: '2024-04-01T00:00:00Z', report_count: 1100,
      },
      {
        id: 'var_rent_2', campaign_id: 'camp_rental', variant_number: 2,
        template_text: 'Spacious 1BR near UBC campus, $900/month. Pet friendly. Must move fast — 15 people already inquired. Send $500 deposit via e-Transfer to hold the unit. I will send you the keys by mail once payment clears.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: ['vancouver.rental.deals@outlook.com'], crypto_wallets: [],
        payment_methods: ['e-Transfer'], demand_amount_range: { min: 500, max: 3000, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 820,
      },
    ],
    indicators: [
      { id: 'ind_rent_e1', campaign_id: 'camp_rental', type: 'email', value: 'landlord.toronto.apt@gmail.com', first_seen: '2024-04-01T00:00:00Z', last_seen: daysAgo(5), report_count: 700 },
      { id: 'ind_rent_e2', campaign_id: 'camp_rental', type: 'email', value: 'vancouver.rental.deals@outlook.com', first_seen: '2025-01-01T00:00:00Z', last_seen: daysAgo(1), report_count: 500 },
    ],
  },

  // ── 17. Marketplace Scam ──────────────────────────────────────
  {
    id: 'camp_marketplace',
    family_name: 'Marketplace Scam (Too Good to Be True)',
    category: 'MARKETPLACE',
    first_seen: '2024-05-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 1450,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'NS'],
    variants: [
      {
        id: 'var_mkt_1', campaign_id: 'camp_marketplace', variant_number: 1,
        template_text: 'PS5 Bundle + 3 games for $150! Moving sale, need gone today. E-Transfer only. Can meet at Tim Hortons on Yonge & Dundas. First come first served. DM me on Facebook.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer'], demand_amount_range: { min: 50, max: 500, currency: 'CAD' },
        first_seen: '2024-05-01T00:00:00Z', report_count: 800,
      },
      {
        id: 'var_mkt_2', campaign_id: 'camp_marketplace', variant_number: 2,
        template_text: 'iPhone 15 Pro Max 256GB, brand new sealed. $400 firm. I accidentally ordered two and Apple won\'t refund. Can ship with Canada Post tracking. Send e-Transfer and I will ship same day.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer'], demand_amount_range: { min: 200, max: 800, currency: 'CAD' },
        first_seen: '2025-02-01T00:00:00Z', report_count: 650,
      },
    ],
    indicators: [],
  },

  // ── 18. Gift Card Payment Scam ────────────────────────────────
  {
    id: 'camp_gift_card',
    family_name: 'Gift Card Payment Scam',
    category: 'GIFT_CARD',
    first_seen: '2023-06-01T00:00:00Z',
    last_seen: daysAgo(1),
    report_count: 3800,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB'],
    variants: [
      {
        id: 'var_gc_1', campaign_id: 'camp_gift_card', variant_number: 1,
        template_text: 'This is your electricity provider. Due to a billing error, your power will be shut off in 2 hours. To keep your power on, purchase $500 in Google Play gift cards and provide the codes. Call 1-855-555-0162.',
        language_hash: '', phone_numbers: ['+18555550162'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card'], demand_amount_range: { min: 200, max: 2000, currency: 'CAD' },
        first_seen: '2023-06-01T00:00:00Z', report_count: 2100,
      },
      {
        id: 'var_gc_2', campaign_id: 'camp_gift_card', variant_number: 2,
        template_text: 'Hi, this is your boss. I am in a meeting and need you to do me a quick favor. Please buy 5 Apple gift cards ($100 each) and send me the codes. I will reimburse you. It is urgent.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card'], demand_amount_range: { min: 200, max: 1000, currency: 'CAD' },
        first_seen: '2024-06-01T00:00:00Z', report_count: 1700,
      },
    ],
    indicators: [
      { id: 'ind_gc_p1', campaign_id: 'camp_gift_card', type: 'phone', value: '+18555550162', first_seen: '2023-06-01T00:00:00Z', last_seen: daysAgo(3), report_count: 1500 },
    ],
  },

  // ── 19. Grandparent/Emergency Scam ────────────────────────────
  {
    id: 'camp_grandparent',
    family_name: 'Grandparent/Emergency Scam',
    category: 'EMERGENCY',
    first_seen: '2023-01-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 4500,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
    variants: [
      {
        id: 'var_gp_1', campaign_id: 'camp_grandparent', variant_number: 1,
        template_text: 'Grandma? It\'s me... I\'m in trouble. I got into a car accident and I was arrested. I need $5,000 for bail. Please don\'t tell mom and dad. My lawyer\'s number is 647-555-0177. Can you go to the bank today?',
        language_hash: '', phone_numbers: ['+16475550177'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['cash', 'wire transfer', 'gift card'], demand_amount_range: { min: 3000, max: 15000, currency: 'CAD' },
        first_seen: '2023-01-01T00:00:00Z', report_count: 2500,
      },
      {
        id: 'var_gp_2', campaign_id: 'camp_grandparent', variant_number: 2,
        template_text: 'This is Officer Johnson calling on behalf of your grandson. He has been involved in a serious incident and is currently in custody. Bail has been set at $8,000. A courier will be sent to your home to collect the payment. This matter is under a publication ban — do not discuss with anyone.',
        language_hash: '', phone_numbers: ['+19055550166'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['cash', 'gift card'], demand_amount_range: { min: 5000, max: 20000, currency: 'CAD' },
        first_seen: '2024-03-01T00:00:00Z', report_count: 2000,
      },
    ],
    indicators: [
      { id: 'ind_gp_p1', campaign_id: 'camp_grandparent', type: 'phone', value: '+16475550177', first_seen: '2023-01-01T00:00:00Z', last_seen: daysAgo(2), report_count: 1800 },
      { id: 'ind_gp_p2', campaign_id: 'camp_grandparent', type: 'phone', value: '+19055550166', first_seen: '2024-03-01T00:00:00Z', last_seen: daysAgo(0), report_count: 1400 },
    ],
  },

  // ── 20. AI Deepfake Voice Scam ────────────────────────────────
  {
    id: 'camp_deepfake',
    family_name: 'AI Deepfake Voice Scam',
    category: 'DEEPFAKE',
    first_seen: '2025-01-01T00:00:00Z',
    last_seen: daysAgo(0),
    report_count: 890,
    status: 'active',
    regions: ['ON', 'BC', 'AB', 'QC'],
    variants: [
      {
        id: 'var_df_1', campaign_id: 'camp_deepfake', variant_number: 1,
        template_text: 'Mom, it\'s me. I\'m in the hospital. There was an accident. I need you to send $3,000 right now for the surgery. They won\'t operate without payment. Please, I\'m scared. Send it to this e-Transfer address.',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['e-Transfer', 'wire transfer'], demand_amount_range: { min: 2000, max: 10000, currency: 'CAD' },
        first_seen: '2025-01-01T00:00:00Z', report_count: 450,
      },
      {
        id: 'var_df_2', campaign_id: 'camp_deepfake', variant_number: 2,
        template_text: 'Hey, this is your CEO. I need you to process an urgent wire transfer of $25,000 to our new vendor. This is confidential — do not discuss with anyone else. I will explain in tomorrow\'s meeting. The account details are...',
        language_hash: '', phone_numbers: [], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['wire transfer'], demand_amount_range: { min: 5000, max: 100000, currency: 'CAD' },
        first_seen: '2025-06-01T00:00:00Z', report_count: 440,
      },
    ],
    indicators: [],
  },

  // ── 21. Hydro/Utility Scam ────────────────────────────────────
  {
    id: 'camp_utility',
    family_name: 'Hydro/Utility Scam',
    category: 'GOVERNMENT',
    first_seen: '2024-10-01T00:00:00Z',
    last_seen: daysAgo(4),
    report_count: 1230,
    status: 'active',
    regions: ['ON', 'BC', 'QC'],
    variants: [
      {
        id: 'var_util_1', campaign_id: 'camp_utility', variant_number: 1,
        template_text: 'Hydro One: Your electricity bill is overdue. Service will be disconnected in 1 hour unless you pay $347.82 immediately. Call 1-877-555-0139 to make a payment by phone. Gift cards or Bitcoin accepted for faster processing.',
        language_hash: '', phone_numbers: ['+18775550139'], urls: [], email_addresses: [], crypto_wallets: [],
        payment_methods: ['gift card', 'crypto'], demand_amount_range: { min: 200, max: 1000, currency: 'CAD' },
        first_seen: '2024-10-01T00:00:00Z', report_count: 750,
      },
      {
        id: 'var_util_2', campaign_id: 'camp_utility', variant_number: 2,
        template_text: 'BC Hydro Rebate: You qualify for a $150 energy rebate. Claim it now before it expires: https://bchydro-rebate-claim.com/apply. Enter your account number and banking details.',
        language_hash: '', phone_numbers: [], urls: ['https://bchydro-rebate-claim.com/apply'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 0, max: 0, currency: 'CAD' },
        first_seen: '2025-05-01T00:00:00Z', report_count: 480,
      },
    ],
    indicators: [
      { id: 'ind_util_p1', campaign_id: 'camp_utility', type: 'phone', value: '+18775550139', first_seen: '2024-10-01T00:00:00Z', last_seen: daysAgo(4), report_count: 750 },
      { id: 'ind_util_d1', campaign_id: 'camp_utility', type: 'domain', value: 'bchydro-rebate-claim.com', first_seen: '2025-05-01T00:00:00Z', last_seen: daysAgo(10), report_count: 480 },
    ],
  },

  // ── 22. Parking Ticket / Traffic Fine Scam ────────────────────
  {
    id: 'camp_parking',
    family_name: 'Parking/Traffic Fine Scam',
    category: 'GOVERNMENT',
    first_seen: '2025-08-01T00:00:00Z',
    last_seen: daysAgo(2),
    report_count: 670,
    status: 'active',
    regions: ['ON', 'BC', 'AB'],
    variants: [
      {
        id: 'var_park_1', campaign_id: 'camp_parking', variant_number: 1,
        template_text: 'City of Toronto: Unpaid parking violation #TK-2026-88412. Fine: $85.00. Pay within 48 hours to avoid additional penalties: https://toronto-parking-fines.com/pay',
        language_hash: '', phone_numbers: [], urls: ['https://toronto-parking-fines.com/pay'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 50, max: 200, currency: 'CAD' },
        first_seen: '2025-08-01T00:00:00Z', report_count: 400,
      },
      {
        id: 'var_park_2', campaign_id: 'camp_parking', variant_number: 2,
        template_text: 'Ontario Traffic Court: You have an outstanding speeding fine of $325. If not paid, your licence will be suspended. Pay online: https://ontario-traffic-pay.com/fine',
        language_hash: '', phone_numbers: [], urls: ['https://ontario-traffic-pay.com/fine'], email_addresses: [], crypto_wallets: [],
        payment_methods: ['credit card'], demand_amount_range: { min: 100, max: 500, currency: 'CAD' },
        first_seen: '2025-11-01T00:00:00Z', report_count: 270,
      },
    ],
    indicators: [
      { id: 'ind_park_d1', campaign_id: 'camp_parking', type: 'domain', value: 'toronto-parking-fines.com', first_seen: '2025-08-01T00:00:00Z', last_seen: daysAgo(2), report_count: 400 },
      { id: 'ind_park_d2', campaign_id: 'camp_parking', type: 'domain', value: 'ontario-traffic-pay.com', first_seen: '2025-11-01T00:00:00Z', last_seen: daysAgo(5), report_count: 270 },
    ],
  },
];
