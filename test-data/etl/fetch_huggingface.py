#!/usr/bin/env python3
"""Fetch HuggingFace phishing dataset and map to Schema 1."""
import re, csv, os
from datasets import load_dataset
import pandas as pd

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'schema1_scam_texts.csv')

def classify_category(text: str, label: int) -> str:
    if label == 0:
        return 'legitimate'
    t = text.lower()
    if any(k in t for k in ['cra', 'canada revenue']):
        return 'cra_impersonation'
    if any(k in t for k in ['bank', 'rbc', ' td ', 'scotiabank', 'bmo', 'cibc', 'account locked']):
        return 'bank_impersonation'
    if any(k in t for k in ['interac', 'e-transfer']):
        return 'interac_phishing'
    if any(k in t for k in ['investment', 'trading', 'crypto', 'bitcoin', 'guaranteed returns']):
        return 'crypto_investment'
    if any(k in t for k in ['microsoft', 'apple', 'virus', 'infected', 'remote access']):
        return 'tech_support'
    if any(k in t for k in ['rent', 'apartment', 'landlord']):
        return 'rental_scam'
    return 'generic_phishing'

def infer_channel(text: str) -> str:
    t = text.lower()
    if len(text) < 200 and ('http' in t or 'click' in t):
        return 'sms'
    if 'dear' in t or '@' in t:
        return 'email'
    return 'other'

RISK_MAP = {
    'cra_impersonation': 'critical',
    'bank_impersonation': 'high',
    'interac_phishing': 'high',
    'crypto_investment': 'high',
    'tech_support': 'medium',
    'rental_scam': 'medium',
    'generic_phishing': 'medium',
    'legitimate': 'safe',
}

def main():
    print("Loading ealvaradob/phishing-dataset via direct JSON download...")
    import requests, json as _json
    url = "https://huggingface.co/datasets/ealvaradob/phishing-dataset/resolve/main/combined_reduced.json"
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    ds = _json.loads(resp.text)
    
    rows = []
    for i, item in enumerate(ds):
        text = item.get('text', '') or ''
        label = item.get('label', 0)
        cat = classify_category(text, label)
        rows.append({
            'id': f'hf_{i}',
            'text': text,
            'category': cat,
            'channel': infer_channel(text),
            'risk_level': RISK_MAP.get(cat, 'medium'),
            'source': 'huggingface_phishing',
        })
    
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT, index=False)
    print(f"Saved {len(df)} rows to {OUTPUT}")
    print(df['category'].value_counts())

if __name__ == '__main__':
    main()
