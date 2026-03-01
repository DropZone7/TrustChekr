#!/usr/bin/env python3
"""Download PhishTank verified phishing URLs and map to Schema 2."""
import csv, os, re
from urllib.parse import urlparse
import requests
import pandas as pd

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'schema2_domains.csv')
PHISHTANK_CSV = 'http://data.phishtank.com/data/online-valid.csv'
PHISHTANK_JSON = 'http://data.phishtank.com/data/online-valid.json'
MAX_ENTRIES = 10000

def infer_category(url: str) -> str:
    u = url.lower()
    if any(k in u for k in ['paypal', 'bank', 'chase', 'wells', 'citi', 'hsbc']):
        return 'banking'
    if any(k in u for k in ['apple', 'icloud', 'microsoft', 'outlook', 'office365']):
        return 'tech'
    if any(k in u for k in ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok']):
        return 'social_media'
    if any(k in u for k in ['amazon', 'ebay', 'shopify', 'walmart']):
        return 'ecommerce'
    if any(k in u for k in ['crypto', 'bitcoin', 'binance', 'coinbase', 'metamask']):
        return 'crypto'
    if any(k in u for k in ['google', 'gmail', 'drive']):
        return 'google'
    if any(k in u for k in ['netflix', 'disney', 'spotify']):
        return 'streaming'
    return 'generic'

def main():
    print("Downloading PhishTank data...")
    headers = {'User-Agent': 'phishtank/trustchekr-research'}
    
    try:
        resp = requests.get(PHISHTANK_CSV, headers=headers, timeout=60, stream=True)
        resp.raise_for_status()
        lines = resp.text.splitlines()
        reader = csv.DictReader(lines)
    except Exception as e:
        print(f"CSV download failed: {e}")
        print("Trying JSON...")
        try:
            resp = requests.get(PHISHTANK_JSON, headers=headers, timeout=60)
            resp.raise_for_status()
            data = resp.json()
            rows = []
            for i, entry in enumerate(data[:MAX_ENTRIES]):
                url = entry.get('url', '')
                domain = urlparse(url).netloc
                rows.append({
                    'id': f'pt_{i}',
                    'domain': domain,
                    'full_url': url,
                    'label': 'phishing',
                    'domain_age_days': None,
                    'category': infer_category(url),
                    'source': 'phishtank',
                })
            df = pd.DataFrame(rows)
            df.to_csv(OUTPUT, index=False)
            print(f"Saved {len(df)} domains to {OUTPUT}")
            return
        except Exception as e2:
            print(f"JSON also failed: {e2}")
            print("Generating placeholder domain dataset instead...")
            # Generate some known phishing domain patterns
            placeholder_domains = [
                ('rbc-secure-login.xyz', 'https://rbc-secure-login.xyz/verify', 'banking'),
                ('td-alert-verify.com', 'https://td-alert-verify.com/auth', 'banking'),
                ('interac-etransfer-deposit.ca', 'https://interac-etransfer-deposit.ca/claim', 'banking'),
                ('cra-refund-claim.net', 'https://cra-refund-claim.net/refund', 'government'),
                ('apple-id-verify.xyz', 'https://apple-id-verify.xyz/login', 'tech'),
                ('microsoft-alert.support', 'https://microsoft-alert.support/fix', 'tech'),
            ]
            rows = []
            for i, (domain, url, cat) in enumerate(placeholder_domains):
                rows.append({'id': f'pt_{i}', 'domain': domain, 'full_url': url, 'label': 'phishing', 'domain_age_days': None, 'category': cat, 'source': 'placeholder'})
            df = pd.DataFrame(rows)
            df.to_csv(OUTPUT, index=False)
            print(f"Saved {len(df)} placeholder domains to {OUTPUT}")
            return

    rows = []
    for i, row in enumerate(reader):
        if i >= MAX_ENTRIES:
            break
        url = row.get('url', '')
        domain = urlparse(url).netloc
        rows.append({
            'id': f'pt_{i}',
            'domain': domain,
            'full_url': url,
            'label': 'phishing',
            'domain_age_days': None,
            'category': infer_category(url),
            'source': 'phishtank',
        })

    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT, index=False)
    print(f"Saved {len(df)} domains to {OUTPUT}")
    print(df['category'].value_counts())

if __name__ == '__main__':
    main()
