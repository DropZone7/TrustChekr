# Test Data ETL Plan

## Schema Mapping
- Schema 1 (Scam Text): HuggingFace ealvaradob/phishing-dataset, Kaggle email datasets, CRA/CRTC examples
- Schema 2 (Domains): FIT/Brno domain dataset, Zenodo domainradar, PhishTank/OpenPhish/URLhaus
- Schema 3 (False Positives): CRA official examples, bank security pages, Interac notifications

## ETL scripts to build tomorrow
See etl/ directory for Python scripts.

## Perplexity ETL Scripts (Reference)

### Category Mapping Logic
```python
def map_category(text, label):
    if label == 0: return "legitimate"
    t = text.lower()
    if "cra" in t or "revenue agency" in t or ".gc.ca" in t: return "cra_impersonation"
    if any(b in t for b in ["rbc", "td", "scotiabank", "cibc", "bmo"]): return "bank_impersonation"
    if "interac" in t: return "interac_phishing"
    if any(k in t for k in ["bitcoin", "crypto", "usdt", "binance"]): return "crypto_investment"
    if any(k in t for k in ["wallet", "metamask", "seed phrase"]): return "crypto_investment"
    if any(k in t for k in ["support", "technical support", "microsoft", "windows license"]): return "tech_support"
    if any(k in t for k in ["rent", "kijiji", "facebook marketplace", "lease"]): return "rental_scam"
    if any(k in t for k in ["honey", "baby", "relationship"]): return "pig_butchering"
    return "generic_phishing"
```

### Channel Inference
```python
def infer_channel(text):
    t = text.lower()
    if "http://" in t or "https://" in t:
        return "sms" if len(t) < 200 else "email"
    if "dear" in t and "@" in t: return "email"
    return "other"
```

### Domain Dataset (FIT/Brno JSON → Schema 2)
- Load phishing_2307.json + benign_umbrella_2307.json
- Extract domain_name, compute domain_age from WHOIS creation date
- Label: phishing vs legitimate
- Infer category from domain keywords (bank/cra/crypto/generic)

### Multiple Source Concat
```python
pd.concat([df_ealvaradob, df_kaggle_type, df_cra_crtc]).to_csv("schema1_master.csv")
```
