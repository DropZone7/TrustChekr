#!/usr/bin/env python3
"""Generate ~200 Canadian-specific synthetic test messages from detection rules."""
import json, csv, os, random

RULES_DIR = '/home/coalpurrt/.openclaw/workspace/projects/trustchekr-app/src/lib/ai-detection/rules'
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'schema1_canadian_synthetic.csv')

# For each rule, handcraft 2-3 messages that should trigger it
SYNTHETIC = {
    # CRA
    'cra_arrest_warrant': [
        "This is the Canada Revenue Agency. A warrant for your arrest has been issued due to unpaid taxes. Call us immediately at 1-800-555-1234.",
        "CRA URGENT: We have issued a warrant for your arrest. You must call back within 2 hours or the RCMP will be dispatched to your residence.",
    ],
    'cra_arrest_warrant_generic': [
        "We have issued an arrest warrant for you due to tax fraud. Contact our office immediately to resolve this matter.",
        "We have an arrest warrant in your name. Failure to respond will result in immediate legal action.",
    ],
    'cra_specific_amount_owed': [
        "You owe $4,327.89 to the Canada Revenue Agency. This balance must be settled today or legal proceedings will begin.",
        "Our records show you have an outstanding balance of $2,150.00 to the CRA. Please call to arrange payment.",
    ],
    'cra_pay_or_arrest': [
        "You must pay immediately or you will be arrested. The police are standing by. Call now.",
        "You need to pay within 24 hours otherwise we will proceed with arrest and deportation.",
    ],
    'cra_gift_card_payment': [
        "Purchase iTunes gift cards to pay and settle your CRA tax debt. This is the fastest way to resolve your case.",
        "Buy Apple cards and read us the codes to clear your tax debt with the CRA immediately.",
    ],
    'cra_crypto_payment': [
        "Please pay via Bitcoin to settle your CRA tax balance. Go to the nearest Bitcoin ATM and deposit $3,000.",
        "Send crypto to the following wallet to pay your tax debt to the CRA: bc1q...",
    ],
    'cra_bitcoin_atm': [
        "Go to a Bitcoin ATM near you and deposit the amount owed. This is the only accepted payment method.",
        "Visit the nearest crypto ATM and follow the instructions we text you.",
    ],
    'cra_climate_action': [
        "You are eligible for a Climate Action Incentive payment of $467.50. Click the link to claim: bit.ly/cra-cai",
        "Your CAI payment is ready. Verify your banking info to receive your climate action refund.",
    ],
    'cra_refund_link': [
        "You have a refund of $384.50 waiting from the CRA. Click the link below to claim it now.",
        "CRA Notice: You have a refund of $612.00 waiting. Tap the link to deposit it to your bank account.",
    ],
    'cra_gst_hst_refund': [
        "Your GST/HST refund is available. Click here to verify your identity and receive your payment.",
        "Tax refund available: Your GST credit has been recalculated. Claim your refund now.",
    ],
    # Banks
    'bank_suspicious_activity': [
        "RBC Alert: Suspicious activity detected on your account ending in 4532. Click here to verify: rbc-secure.xyz",
        "TD Canada Trust: We noticed suspicious transaction on your debit card. Please log in to verify.",
        "Scotiabank Security: Suspicious activity on your account. Verify immediately at scotiabank-verify.com",
    ],
    'bank_account_locked': [
        "Your account has been locked due to unusual activity. Please verify your identity to restore access.",
        "ALERT: Account suspended due to suspicious activity. Click here to unlock.",
    ],
    'bank_verify_via_link': [
        "Please verify your account by clicking the link below. Failure to verify within 24 hours will result in account closure.",
        "Verify your identity by tapping the link to keep your account active.",
    ],
    'bank_share_otp': [
        "For security purposes, please share the verification code we just sent you via text.",
        "Please share the one-time code we just sent you to complete the verification process.",
    ],
    'bank_secure_transaction': [
        "To secure your account, please complete this transaction by transferring $500 to the safety account.",
        "To protect your account, please complete this transaction within the next hour.",
    ],
    'bank_rbc_phishing': [
        "RBC Online Banking: Please verify and update your login credentials at rbc-login-secure.com",
        "RBC security update: You must secure your login information. Click here to update.",
    ],
    'bank_td_phishing': [
        "TD Security Alert: Unusual login detected. Verify your TD account immediately.",
        "TD: Security alert for your account. Verify your TD account to prevent suspension.",
    ],
    # Interac
    'interac_fake_deposit_link': [
        "You have received an Interac e-Transfer of $250.00 from John Smith. Click here to deposit: etransfer-deposit.xyz",
        "Notification: You have received an Interac e-Transfer. Click below to deposit the funds to your account.",
    ],
    'interac_cra_etransfer': [
        "You have received an Interac e-Transfer of $467.00 from the Canada Revenue Agency. Accept your refund here.",
        "Interac e-Transfer notification: CRA has sent you $312.50. Click to deposit.",
    ],
    'interac_bank_deposit_lure': [
        "You have received $1,200.00 from RBC via Interac. Click to accept the deposit.",
        "You have received $500 from TD via Interac e-Transfer. Accept now.",
    ],
    'interac_expired_reclaim': [
        "Your Interac e-Transfer has expired. Click here to re-claim your funds before they are returned.",
        "Notice: Your Interac e-Transfer has failed. Click here to re-claim the funds.",
    ],
    # Crypto / Pig Butchering
    'pig_wrong_number': [
        "Hey! Oh sorry, wrong number. I was trying to reach my friend Jessica. How are you though?",
        "Oops, sorry, I must have the wrong number. But since we're here, how's your day going?",
    ],
    'pig_be_friends': [
        "You seem really nice! Can we be friends? I don't know many people in this city.",
        "You seem so kind and interesting. Can we be friends? I'd love to chat more.",
    ],
    'pig_crypto_expert': [
        "I work in crypto trading and have been very successful lately. I can show you how!",
        "I do forex trading full time and make great returns. Want me to teach you?",
    ],
    'pig_secret_strategy': [
        "I have a special strategy for crypto that guarantees profits. Let me show you.",
        "My uncle has insider information for Bitcoin trading. I can share it with you.",
    ],
    'pig_guaranteed_returns': [
        "I can help you earn 15% per day with no risk at all. Just start with $500.",
        "I can help you make 30% per month with no risk. It's completely safe.",
    ],
    'pig_fake_app': [
        "Download this app called Binancc to start trading. It's the best platform.",
        "Download this app USDTPRO to begin — it's where I do all my trades.",
    ],
    'pig_withdrawal_fee': [
        "You need to pay a service charge of $2,000 before you can withdraw your profits.",
        "There's a tax you need to pay before you can withdraw. It's just $1,500.",
    ],
    # Tech Support
    'tech_brand_support': [
        "ALERT: This is Microsoft Support. Your computer has been compromised. Call 1-888-555-0199 immediately.",
        "Apple Support: Your iCloud account has been breached. Contact our team now.",
    ],
    'tech_virus_infected': [
        "WARNING: Your computer is infected by a virus! Do not restart. Call support immediately.",
        "CRITICAL ALERT: Your computer is at risk due to a trojan virus. Call now for help.",
    ],
    'tech_call_toll_free': [
        "Your Windows license has expired. Call the toll-free number below for immediate support: 1-888-555-0123",
        "Security breach detected. Call the toll-free number below for urgent support.",
    ],
    'tech_remote_access': [
        "Our technician will fix your computer. Please download AnyDesk so we can connect remotely.",
        "To resolve the issue, download TeamViewer and give us the access code.",
    ],
    'tech_refund_overpayment': [
        "We will refund $399.99 to your bank account, but we accidentally sent too much. Please return the difference via gift card.",
        "We will refund $250.00 to your card. Unfortunately we sent extra money — please wire back the overpayment.",
    ],
    # Rental
    'rental_too_good_price': [
        "Beautiful 2BR apartment in downtown Toronto, $850/month, all utilities included. Available immediately!",
        "Spacious condo near Yonge & Bloor, $900/month all utilities included. DM for details.",
    ],
    'rental_overseas_landlord': [
        "Thank you for your interest. I am currently overseas for work and cannot show the apartment in person.",
        "Hi, I am currently working abroad so I can't meet you to show the place, but I can send more photos.",
    ],
    'rental_deposit_before_viewing': [
        "Unfortunately I cannot show you the place before you send the deposit. Once I receive it, I'll courier the keys.",
        "You'll need to pay first and last before viewing. I cannot show you the place before you pay the deposit.",
    ],
    'rental_etransfer_deposit': [
        "Please send first and last month's rent via e-Transfer to secure the unit. I have other interested parties.",
        "Please send a deposit of $1,700 via Interac e-Transfer to hold the apartment.",
    ],
    'rental_mail_keys': [
        "Do not worry, I will mail you the keys via Canada Post once the deposit clears.",
        "The keys will be with the cleaner downstairs. Just send the deposit and I'll arrange everything.",
    ],
    'rental_platform_mention': [
        "I saw your listing on Kijiji for the 1BR on Queen St. Is it still available?",
        "Found this on Facebook Marketplace — is the room still up for rent?",
    ],
}

# Legitimate but suspicious messages (real alerts that should NOT trigger as scam)
LEGITIMATE = [
    # Real CRA
    {"text": "Your Notice of Assessment for the 2025 tax year is now available in My Account at canada.ca/my-cra-account.", "category": "legitimate", "channel": "email"},
    {"text": "CRA: Your 2025 income tax return has been received and is being processed.", "category": "legitimate", "channel": "email"},
    {"text": "Your RRSP deduction limit for 2026 is $29,210. View details in My Account.", "category": "legitimate", "channel": "email"},
    {"text": "CRA: A new T4 slip has been added to your account for the 2025 tax year.", "category": "legitimate", "channel": "email"},
    {"text": "Reminder: The deadline to file your 2025 income tax return is April 30, 2026.", "category": "legitimate", "channel": "email"},
    {"text": "Your GST/HST credit payment of $125.50 has been deposited to your bank account.", "category": "legitimate", "channel": "sms"},
    {"text": "CRA: Your direct deposit information has been updated successfully.", "category": "legitimate", "channel": "email"},
    {"text": "Your Canada Child Benefit payment of $583.00 has been issued.", "category": "legitimate", "channel": "email"},
    # Real bank alerts
    {"text": "RBC Alert: A purchase of $42.50 was made on your Visa ending in 1234 at Shoppers Drug Mart.", "category": "legitimate", "channel": "sms"},
    {"text": "TD: Your chequing account balance is below $100. Current balance: $87.32.", "category": "legitimate", "channel": "sms"},
    {"text": "Scotiabank: Your mortgage payment of $1,450.00 has been processed.", "category": "legitimate", "channel": "sms"},
    {"text": "BMO: Your credit card statement is now available. Log in to the BMO app to view.", "category": "legitimate", "channel": "email"},
    {"text": "CIBC: A new device was used to log into your online banking. If this wasn't you, call 1-800-465-2422.", "category": "legitimate", "channel": "sms"},
    {"text": "RBC: Your bill payment of $156.78 to Bell Canada has been processed.", "category": "legitimate", "channel": "sms"},
    {"text": "TD EasyWeb: You have a new secure message. Log in to TD app to read it.", "category": "legitimate", "channel": "email"},
    {"text": "Scotiabank: Your GIC of $5,000 matures on March 15, 2026. Log in to renew or redeem.", "category": "legitimate", "channel": "email"},
    # Real Interac
    {"text": "INTERAC e-Transfer: Sarah Chen sent you $50.00. The money has been automatically deposited.", "category": "legitimate", "channel": "sms"},
    {"text": "INTERAC e-Transfer: Your request for $200.00 from Mike Johnson has been fulfilled.", "category": "legitimate", "channel": "email"},
    {"text": "INTERAC e-Transfer: You sent $75.00 to David Lee. Reference: Dinner last night.", "category": "legitimate", "channel": "sms"},
    {"text": "Your Interac e-Transfer to Jane Smith for $120.00 has been deposited.", "category": "legitimate", "channel": "email"},
    {"text": "INTERAC e-Transfer: Auto-deposit is now active for your email address.", "category": "legitimate", "channel": "email"},
    # Real tech notifications
    {"text": "Microsoft: Your Microsoft 365 subscription renews on March 1, 2026 for $99.99 CAD.", "category": "legitimate", "channel": "email"},
    {"text": "Apple: Your iCloud storage is 90% full. Manage your storage at icloud.com.", "category": "legitimate", "channel": "email"},
    {"text": "Windows Update: Your device will restart tonight to install security updates.", "category": "legitimate", "channel": "other"},
    # Real rental
    {"text": "Hi! I'm interested in the 1BR apartment on Queen St listed on Kijiji. When can I schedule a viewing?", "category": "legitimate", "channel": "other"},
    {"text": "Thanks for coming to see the apartment today. Let me know if you'd like to submit an application.", "category": "legitimate", "channel": "other"},
    {"text": "Your rent payment of $1,800 for March has been received. Thank you!", "category": "legitimate", "channel": "email"},
    {"text": "Reminder: Building maintenance will be working on the HVAC system Tuesday from 9-5.", "category": "legitimate", "channel": "email"},
    # Misc legitimate
    {"text": "Amazon.ca: Your order #302-1234567-8901234 has shipped and will arrive by March 3.", "category": "legitimate", "channel": "email"},
    {"text": "Canada Post: A package is on its way! Track it at canadapost.ca/track", "category": "legitimate", "channel": "sms"},
    {"text": "Rogers: Your February bill of $89.50 is now available. Pay by March 15 to avoid late fees.", "category": "legitimate", "channel": "sms"},
    {"text": "Bell: Your data usage is at 80% of your 20GB plan. Manage your plan in the MyBell app.", "category": "legitimate", "channel": "sms"},
    {"text": "Costco: Your Costco Executive membership renewal is coming up on April 1, 2026.", "category": "legitimate", "channel": "email"},
    {"text": "Service Ontario: Your driver's licence expires on June 15, 2026. Renew online at ontario.ca.", "category": "legitimate", "channel": "email"},
    {"text": "City of Toronto: Your property tax installment of $1,234.56 is due on March 1, 2026.", "category": "legitimate", "channel": "email"},
    {"text": "Hydro One: Your electricity bill for February is $142.30. View and pay at hydroone.com.", "category": "legitimate", "channel": "email"},
    {"text": "TTC: Service alert — Line 1 Yonge-University is experiencing delays due to signal problems.", "category": "legitimate", "channel": "sms"},
    {"text": "Your Presto card balance is low ($3.20). Reload at prestocard.ca or any fare machine.", "category": "legitimate", "channel": "sms"},
    {"text": "Uber: Your ride to Pearson Airport is confirmed for 6:30 AM tomorrow. Driver: Ahmed.", "category": "legitimate", "channel": "sms"},
    {"text": "Skip The Dishes: Your order from Thai Express is on its way! Estimated delivery: 35 min.", "category": "legitimate", "channel": "sms"},
    {"text": "LinkedIn: You appeared in 47 searches this week. See who's looking at your profile.", "category": "legitimate", "channel": "email"},
    {"text": "Indeed: 3 new jobs match your alert for 'Cybersecurity Analyst' in Toronto.", "category": "legitimate", "channel": "email"},
    {"text": "Hey Alex, are we still on for coffee at 2pm? Meet at the usual spot?", "category": "legitimate", "channel": "sms"},
    {"text": "Mom: Don't forget dinner at Nonna's on Sunday at 5. Bring the wine!", "category": "legitimate", "channel": "sms"},
    {"text": "Reminder: Your dentist appointment is tomorrow at 10:30 AM at Dr. Patel's office.", "category": "legitimate", "channel": "sms"},
    {"text": "GoodLife Fitness: Your membership payment of $54.99 has been processed for March.", "category": "legitimate", "channel": "email"},
    {"text": "Netflix: New episodes of your show are now available. Start watching!", "category": "legitimate", "channel": "email"},
    {"text": "Spotify: Your Wrapped 2025 is here! See your top artists and songs.", "category": "legitimate", "channel": "email"},
]

CATEGORY_MAP = {
    'CRA_IMPERSONATION': 'cra_impersonation',
    'BANK_IMPERSONATION': 'bank_impersonation',
    'INTERAC_PHISHING': 'interac_phishing',
    'PIG_BUTCHERING': 'pig_butchering',
    'CRYPTO_INVESTMENT': 'crypto_investment',
    'TECH_SUPPORT': 'tech_support',
    'RENTAL_SCAM': 'rental_scam',
}

RISK_MAP = {
    'cra_impersonation': 'critical',
    'bank_impersonation': 'high',
    'interac_phishing': 'high',
    'pig_butchering': 'high',
    'crypto_investment': 'high',
    'tech_support': 'medium',
    'rental_scam': 'medium',
    'legitimate': 'safe',
}

def main():
    rows = []
    idx = 0

    # Load rules to get category mapping for each rule ID
    rule_categories = {}
    for fname in ['cra.json', 'banks.json', 'interac.json', 'crypto.json', 'tech_support.json', 'rental.json']:
        with open(os.path.join(RULES_DIR, fname)) as f:
            data = json.load(f)
            for p in data.get('patterns', []):
                rule_categories[p['id']] = CATEGORY_MAP.get(p['category'], p['category'].lower())

    # Generate from synthetic messages
    for rule_id, messages in SYNTHETIC.items():
        cat = rule_categories.get(rule_id, 'generic_phishing')
        for msg in messages:
            channel = 'sms' if len(msg) < 200 else 'email'
            if 'call' in msg.lower() or 'phone' in msg.lower():
                channel = 'phone'
            rows.append({
                'id': f'ca_{idx}',
                'text': msg,
                'category': cat,
                'channel': channel,
                'risk_level': RISK_MAP.get(cat, 'medium'),
                'source': 'synthetic_canadian',
                'triggering_rule': rule_id,
            })
            idx += 1

    # Add legitimate messages
    for item in LEGITIMATE:
        rows.append({
            'id': f'ca_{idx}',
            'text': item['text'],
            'category': 'legitimate',
            'channel': item['channel'],
            'risk_level': 'safe',
            'source': 'synthetic_canadian',
            'triggering_rule': '',
        })
        idx += 1

    import pandas as pd
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT, index=False)
    print(f"Generated {len(df)} synthetic messages to {OUTPUT}")
    print(df['category'].value_counts())
    print(f"\nScam: {len(df[df.category != 'legitimate'])}, Legitimate: {len(df[df.category == 'legitimate'])}")

if __name__ == '__main__':
    main()
