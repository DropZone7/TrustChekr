#!/usr/bin/env python3
"""
TrustChekr Detection Engine - Batch Accuracy Test
Runs downloaded datasets against all regex rules and reports accuracy metrics.
"""

import json, re, os, glob, sys, time
from pathlib import Path
from collections import defaultdict

import pandas as pd
import numpy as np

ROOT = Path(__file__).resolve().parents[2]  # trustchekr-app/
RULES_DIR = ROOT / "src" / "lib" / "ai-detection" / "rules"
DOWNLOADS = ROOT / "test-data" / "downloads"
OUTPUT = ROOT / "test-data" / "BATCH-TEST-RESULTS.md"
MAX_ROWS = 50000

# ─── Load Rules ──────────────────────────────────────────────────────────────

def load_text_patterns():
    """Load all text-matching patterns from rule JSON files."""
    patterns = []
    for jf in glob.glob(str(RULES_DIR / "**" / "*.json"), recursive=True):
        with open(jf) as f:
            data = json.load(f)
        if "patterns" in data:
            for p in data["patterns"]:
                try:
                    compiled = re.compile(p["pattern"], re.IGNORECASE)
                    patterns.append({
                        "regex": compiled,
                        "category": p.get("category", "UNKNOWN"),
                        "weight": p.get("weight", 1),
                        "id": p.get("id", ""),
                        "source": os.path.relpath(jf, ROOT),
                    })
                except re.error:
                    pass
    return patterns

def load_domain_patterns():
    """Load domain patterns from domains.json files."""
    patterns = []
    for jf in glob.glob(str(RULES_DIR / "**" / "domains.json"), recursive=True):
        with open(jf) as f:
            data = json.load(f)
        for d in data.get("domains", []):
            try:
                compiled = re.compile(d["pattern"], re.IGNORECASE)
                patterns.append({
                    "regex": compiled,
                    "category": d.get("category", "UNKNOWN"),
                    "id": d.get("id", ""),
                    "source": os.path.relpath(jf, ROOT),
                })
            except re.error:
                pass
    return patterns

# ─── Detection ───────────────────────────────────────────────────────────────

def detect_text(text, patterns):
    """Returns list of matched pattern categories, or empty if no match."""
    if not isinstance(text, str) or not text.strip():
        return []
    matches = []
    for p in patterns:
        if p["regex"].search(text):
            matches.append(p["category"])
    return matches

def detect_url(url, domain_patterns):
    """Check if a URL matches any domain pattern."""
    if not isinstance(url, str):
        return []
    matches = []
    for p in domain_patterns:
        if p["regex"].search(url):
            matches.append(p["category"])
    return matches

# ─── Metrics ─────────────────────────────────────────────────────────────────

def compute_metrics(tp, fp, fn, tn):
    total = tp + fp + fn + tn
    accuracy = (tp + tn) / total if total else 0
    precision = tp / (tp + fp) if (tp + fp) else 0
    recall = tp / (tp + fn) if (tp + fn) else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1,
            "tp": tp, "fp": fp, "fn": fn, "tn": tn, "total": total}

# ─── Dataset Loaders ─────────────────────────────────────────────────────────

def sample_df(df):
    if len(df) > MAX_ROWS:
        df = df.sample(n=MAX_ROWS, random_state=42)
    return df.reset_index(drop=True)

def load_smishing():
    """Smishing Dataset: message, spam label, smishing label"""
    p = DOWNLOADS / "Smishing_Dataset" / "Combined-Labeled-Dataset.csv"
    df = pd.read_csv(p)
    df = sample_df(df)
    # label=1 if either spam or smishing
    df["is_scam"] = ((df["spam label"] == 1) | (df["smishing label"] == 1)).astype(int)
    return [{"name": "Smishing_Dataset", "df": df, "text_col": "message", "label_col": "is_scam"}]

def load_kaggle_email():
    """Kaggle phishing email datasets - multiple CSVs with body+label or text_combined+label."""
    results = []
    folder = DOWNLOADS / "kaggle_phishing_email"
    for csv in sorted(folder.glob("*.csv")):
        try:
            df = pd.read_csv(csv, on_bad_lines='skip')
        except Exception:
            continue
        df = sample_df(df)
        # Determine text and label columns
        cols = [c.lower() for c in df.columns]
        text_col = label_col = None
        for c in df.columns:
            cl = c.lower()
            if cl in ("body", "text_combined", "email text", "text", "content", "message"):
                text_col = c
            if cl in ("label", "email type", "class"):
                label_col = c
        if text_col and label_col:
            # Normalize label to 1=scam, 0=legit
            labels = df[label_col]
            if labels.dtype == object:
                df["is_scam"] = labels.str.lower().map(lambda x: 1 if x in ("spam", "phishing", "1", "scam") else 0)
            else:
                df["is_scam"] = (labels >= 1).astype(int)
            results.append({"name": f"kaggle_email/{csv.name}", "df": df, "text_col": text_col, "label_col": "is_scam"})
    return results

def load_zenodo():
    """Zenodo phishing datasets - subject,body,label format."""
    results = []
    folder = DOWNLOADS / "zenodo_phishing"
    for csv in sorted(folder.glob("*.csv")):
        try:
            df = pd.read_csv(csv, on_bad_lines='skip')
        except Exception:
            continue
        df = sample_df(df)
        if "body" in df.columns and "label" in df.columns:
            df["is_scam"] = (df["label"] >= 1).astype(int)
            results.append({"name": f"zenodo/{csv.name}", "df": df, "text_col": "body", "label_col": "is_scam"})
        elif "text_combined" in df.columns and "label" in df.columns:
            df["is_scam"] = (df["label"] >= 1).astype(int)
            results.append({"name": f"zenodo/{csv.name}", "df": df, "text_col": "text_combined", "label_col": "is_scam"})
    return results

def load_url_dataset():
    """Kaggle phishing URL dataset: URL, Domain, label"""
    p = DOWNLOADS / "kaggle_phishing_url" / "phishing_simple (1).csv"
    if not p.exists():
        return []
    df = pd.read_csv(p)
    df = sample_df(df)
    return [{"name": "kaggle_phishing_url", "df": df, "url_col": "URL", "domain_col": "Domain",
             "label_col": "label", "label_map": {"phishing": 1, "benign": 0}}]

# ─── Run Tests ───────────────────────────────────────────────────────────────

def test_text_dataset(ds, patterns):
    """Test a text dataset against patterns. Returns metrics dict."""
    df = ds["df"]
    text_col = ds["text_col"]
    label_col = ds["label_col"]
    
    tp = fp = fn = tn = 0
    category_hits = defaultdict(lambda: {"tp": 0, "fp": 0})
    
    for _, row in df.iterrows():
        text = row[text_col]
        is_scam = int(row[label_col])
        matches = detect_text(text, patterns)
        detected = len(matches) > 0
        
        if is_scam and detected:
            tp += 1
        elif is_scam and not detected:
            fn += 1
        elif not is_scam and detected:
            fp += 1
        else:
            tn += 1
        
        for cat in set(matches):
            if is_scam:
                category_hits[cat]["tp"] += 1
            else:
                category_hits[cat]["fp"] += 1
    
    metrics = compute_metrics(tp, fp, fn, tn)
    metrics["category_hits"] = dict(category_hits)
    return metrics

def test_url_dataset(ds, domain_patterns):
    """Test URL dataset against domain patterns."""
    df = ds["df"]
    label_map = ds.get("label_map", {})
    
    tp = fp = fn = tn = 0
    
    for _, row in df.iterrows():
        url = str(row.get(ds["url_col"], "")) + " " + str(row.get(ds["domain_col"], ""))
        label_raw = row[ds["label_col"]]
        is_phish = label_map.get(label_raw, 0) if isinstance(label_raw, str) else int(label_raw)
        
        matches = detect_url(url, domain_patterns)
        detected = len(matches) > 0
        
        if is_phish and detected:
            tp += 1
        elif is_phish and not detected:
            fn += 1
        elif not is_phish and detected:
            fp += 1
        else:
            tn += 1
    
    return compute_metrics(tp, fp, fn, tn)

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print("Loading rules...")
    text_patterns = load_text_patterns()
    domain_patterns = load_domain_patterns()
    print(f"  {len(text_patterns)} text patterns, {len(domain_patterns)} domain patterns")
    
    # Collect all datasets
    print("\nLoading datasets...")
    text_datasets = []
    text_datasets.extend(load_smishing())
    text_datasets.extend(load_kaggle_email())
    text_datasets.extend(load_zenodo())
    url_datasets = load_url_dataset()
    
    print(f"  {len(text_datasets)} text datasets, {len(url_datasets)} URL datasets")
    
    # Run text tests
    all_results = []
    global_tp = global_fp = global_fn = global_tn = 0
    all_category_hits = defaultdict(lambda: {"tp": 0, "fp": 0})
    
    for ds in text_datasets:
        name = ds["name"]
        n = len(ds["df"])
        scam_count = ds["df"][ds["label_col"]].sum()
        print(f"\n  Testing {name} ({n} rows, {scam_count} scam)...", end=" ", flush=True)
        t0 = time.time()
        metrics = test_text_dataset(ds, text_patterns)
        elapsed = time.time() - t0
        print(f"{elapsed:.1f}s — P={metrics['precision']:.3f} R={metrics['recall']:.3f} F1={metrics['f1']:.3f}")
        
        metrics["name"] = name
        metrics["rows"] = n
        metrics["scam_count"] = int(scam_count)
        all_results.append(metrics)
        
        global_tp += metrics["tp"]
        global_fp += metrics["fp"]
        global_fn += metrics["fn"]
        global_tn += metrics["tn"]
        
        for cat, hits in metrics["category_hits"].items():
            all_category_hits[cat]["tp"] += hits["tp"]
            all_category_hits[cat]["fp"] += hits["fp"]
    
    # Run URL tests
    url_results = []
    for ds in url_datasets:
        name = ds["name"]
        n = len(ds["df"])
        print(f"\n  Testing {name} ({n} rows)...", end=" ", flush=True)
        t0 = time.time()
        metrics = test_url_dataset(ds, domain_patterns)
        elapsed = time.time() - t0
        print(f"{elapsed:.1f}s — P={metrics['precision']:.3f} R={metrics['recall']:.3f} F1={metrics['f1']:.3f}")
        metrics["name"] = name
        metrics["rows"] = n
        url_results.append(metrics)
    
    # Overall
    overall = compute_metrics(global_tp, global_fp, global_fn, global_tn)
    
    # ─── Generate Report ─────────────────────────────────────────────────
    print("\nGenerating report...")
    
    lines = []
    lines.append("# TrustChekr Detection Engine — Batch Test Results")
    lines.append(f"\n**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"**Engine:** {len(text_patterns)} text patterns + {len(domain_patterns)} domain patterns")
    lines.append(f"**Max rows per dataset:** {MAX_ROWS}\n")
    
    # Summary
    lines.append("## Overall Text Detection Metrics\n")
    lines.append(f"| Metric | Value |")
    lines.append(f"|--------|-------|")
    lines.append(f"| **Accuracy** | {overall['accuracy']:.4f} ({overall['accuracy']*100:.2f}%) |")
    lines.append(f"| **Precision** | {overall['precision']:.4f} |")
    lines.append(f"| **Recall** | {overall['recall']:.4f} |")
    lines.append(f"| **F1 Score** | {overall['f1']:.4f} |")
    lines.append(f"| True Positives | {overall['tp']:,} |")
    lines.append(f"| False Positives | {overall['fp']:,} |")
    lines.append(f"| False Negatives | {overall['fn']:,} |")
    lines.append(f"| True Negatives | {overall['tn']:,} |")
    lines.append(f"| **Total Samples** | {overall['total']:,} |")
    
    # Per-dataset table
    lines.append("\n## Per-Dataset Results\n")
    lines.append("| Dataset | Rows | Scam | TP | FP | FN | TN | Precision | Recall | F1 |")
    lines.append("|---------|------|------|----|----|----|----|-----------|--------|-----|")
    for r in all_results:
        lines.append(f"| {r['name']} | {r['rows']:,} | {r['scam_count']:,} | {r['tp']:,} | {r['fp']:,} | {r['fn']:,} | {r['tn']:,} | {r['precision']:.3f} | {r['recall']:.3f} | {r['f1']:.3f} |")
    
    # URL results
    if url_results:
        lines.append("\n## URL Detection Results\n")
        lines.append("| Dataset | Rows | TP | FP | FN | TN | Precision | Recall | F1 |")
        lines.append("|---------|------|----|----|----|-----|-----------|--------|-----|")
        for r in url_results:
            lines.append(f"| {r['name']} | {r['rows']:,} | {r['tp']:,} | {r['fp']:,} | {r['fn']:,} | {r['tn']:,} | {r['precision']:.3f} | {r['recall']:.3f} | {r['f1']:.3f} |")
    
    # Category breakdown
    lines.append("\n## Per-Category Detection Rates\n")
    lines.append("| Category | True Positives | False Positives | Notes |")
    lines.append("|----------|---------------|-----------------|-------|")
    for cat in sorted(all_category_hits.keys()):
        h = all_category_hits[cat]
        total_matches = h["tp"] + h["fp"]
        fp_rate = h["fp"] / total_matches if total_matches else 0
        note = "⚠️ High FP rate" if fp_rate > 0.3 else "✅"
        lines.append(f"| {cat} | {h['tp']:,} | {h['fp']:,} | {note} |")
    
    # Recommendations
    lines.append("\n## Recommendations\n")
    
    # Low recall datasets
    low_recall = [r for r in all_results if r["recall"] < 0.1]
    if low_recall:
        lines.append("### 🔴 Very Low Recall (< 10%)\n")
        lines.append("The engine's regex patterns are **highly targeted** at specific scam types (CRA, IRS, crypto, etc.) and will not match generic spam/phishing that doesn't use those specific phrases.\n")
        for r in low_recall:
            lines.append(f"- **{r['name']}**: Recall={r['recall']:.3f} — {r['fn']:,} scam samples undetected")
    
    # High FP categories
    high_fp_cats = [(cat, h) for cat, h in all_category_hits.items() if h["fp"] > h["tp"] and h["fp"] > 10]
    if high_fp_cats:
        lines.append("\n### ⚠️ High False Positive Categories\n")
        for cat, h in high_fp_cats:
            lines.append(f"- **{cat}**: {h['fp']} FP vs {h['tp']} TP — patterns too broad")
    
    lines.append("\n### 💡 General Observations\n")
    lines.append("1. **The engine is designed for targeted detection** of specific scam templates (CRA tax scams, IRS impersonation, crypto fraud, etc.), not general spam classification.")
    lines.append("2. **Low recall is expected** — these rules catch specific known scam patterns, not all possible spam/phishing.")
    lines.append("3. **High precision is the goal** — when the engine flags something, it should be correct.")
    lines.append("4. **To improve recall**, add more pattern categories: generic urgency phrases, suspicious sender patterns, common phishing templates.")
    lines.append("5. **URL detection** relies on known fake domain patterns for specific banks/agencies — general phishing URLs won't match.")
    
    report = "\n".join(lines) + "\n"
    OUTPUT.write_text(report)
    print(f"\nReport saved to {OUTPUT}")
    print(f"\nOverall: Accuracy={overall['accuracy']:.4f} Precision={overall['precision']:.4f} Recall={overall['recall']:.4f} F1={overall['f1']:.4f}")

if __name__ == "__main__":
    main()
