# TrustChekr Detection Engine — Test Results

**Date:** 2026-03-01
**Total test cases:** 50127
**Patterns loaded:** 43

## Overall Metrics

| Metric | Value |
|---|---|
| Overall Accuracy | 57.8% |
| Precision | 61.1% |
| Recall (Sensitivity) | 0.5% |
| False Positive Rate | 0.2% |
| False Negative Rate | 99.5% |
| True Positives | 99 |
| True Negatives | 28885 |
| False Positives | 63 |
| False Negatives | 21080 |

## Per-Category Accuracy

| Category | Total | TP | FP | FN | Accuracy |
|---|---|---|---|---|---|
| cra_impersonation | 681 | 37 | 69 | 644 | 5.4% |
| bank_impersonation | 1135 | 22 | 4 | 1113 | 1.9% |
| interac_phishing | 177 | 7 | 0 | 170 | 4.0% |
| pig_butchering | 14 | 9 | 2 | 5 | 64.3% |
| crypto_investment | 266 | 0 | 0 | 266 | 0.0% |
| tech_support | 946 | 11 | 3 | 935 | 1.2% |
| rental_scam | 864 | 13 | 9 | 851 | 1.5% |
| generic_phishing | 17096 | 0 | 0 | 17096 | 0.0% |
| legitimate | 28948 | 28885 | 0 | 63 | 99.8% |

## Risk Tier Distribution

| Risk Tier | Count |
|---|---|
| HIGH_RISK | 1 |
| LIKELY_SAFE | 50021 |
| SUSPICIOUS | 105 |

## Sample Misclassifications (up to 20)

| ID | Expected | Detected | Penalty | Risk Tier |
|---|---|---|---|---|
| ca_2 | cra_impersonation | none | 0 | LIKELY_SAFE |
| ca_7 | cra_impersonation | none | 0 | LIKELY_SAFE |
| ca_8 | cra_impersonation | none | 0 | LIKELY_SAFE |
| ca_23 | bank_impersonation | none | 0 | LIKELY_SAFE |
| ca_38 | interac_phishing | none | 0 | LIKELY_SAFE |
| ca_45 | pig_butchering | none | 0 | LIKELY_SAFE |
| ca_46 | pig_butchering | none | 0 | LIKELY_SAFE |
| ca_50 | pig_butchering | none | 0 | LIKELY_SAFE |
| ca_55 | pig_butchering | none | 0 | LIKELY_SAFE |
| ca_56 | pig_butchering | none | 0 | LIKELY_SAFE |
| ca_60 | tech_support | none | 0 | LIKELY_SAFE |
| ca_65 | tech_support | none | 0 | LIKELY_SAFE |
| ca_73 | rental_scam | none | 0 | LIKELY_SAFE |
| hf_1 | generic_phishing | none | 0 | LIKELY_SAFE |
| hf_3 | generic_phishing | none | 0 | LIKELY_SAFE |
| hf_5 | generic_phishing | none | 0 | LIKELY_SAFE |
| hf_9 | bank_impersonation | none | 0 | LIKELY_SAFE |
| hf_10 | generic_phishing | none | 0 | LIKELY_SAFE |
| hf_13 | generic_phishing | none | 0 | LIKELY_SAFE |
| hf_14 | generic_phishing | none | 0 | LIKELY_SAFE |
