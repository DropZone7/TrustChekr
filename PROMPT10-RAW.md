# Prompt 10 Raw — Pattern Rules from Perplexity (Part 1)

```json
{
  "patterns": [
    {
      "pattern": "(canada revenue agency|\\bCRA\\b).*warrant for your arrest",
      "type": "regex",
      "weight": 10,
      "category": "CRA_IMPERSONATION",
      "description": "CRA phone script threatening arrest with a warrant for unpaid taxes."
    },
    {
      "pattern": "we (have|issued) (an )?arrest warrant (for you|in your name)",
      "type": "regex",
      "weight": 9,
      "category": "CRA_IMPERSONATION",
      "description": "Generic arrest warrant language commonly used in CRA phone scams."
    },
    {
      "pattern": "you (owe|have an outstanding balance of) \\$?[0-9,.]+ to (the )?(canada revenue agency|\\bCRA\\b)",
      "type": "regex",
      "weight": 8,
      "category": "CRA_IMPERSONATION",
      "description": "Claiming the victim owes a specific amount to CRA."
    },
    {
      "pattern": "you (must|need to) pay (immediately|today|within 24 hours) (or|otherwise) (you will|we will) (be arrested|go to jail|be deported)",
      "type": "regex",
      "weight": 9,
      "category": "CRA_IMPERSONATION",
      "description": "Urgent threat of arrest, jail, or deportation if immediate payment is not made."
    },
    {
      "pattern": "(gift cards?|itunes|apple cards?|google play|prepaid credit cards?).*(pay|settle|clear) (your )?(tax|cra) debt",
      "type": "regex",
      "weight": 10,
      "category": "CRA_IMPERSONATION",
      "description": "Requesting CRA tax debt payment via gift cards or prepaid cards."
    },
    {
      "pattern": "cryptocurrenc(y|ies)|bitcoin\\s*ATM|crypto\\s*ATM",
      "type": "regex",
      "weight": 9,
      "category": "CRA_IMPERSONATION",
      "description": "CRA scam demanding payment through cryptocurrency or Bitcoin ATMs."
    },
    {
      "pattern": "climate action incentive|climate action refund|CAI payment",
      "type": "regex",
      "weight": 7,
      "category": "CRA_IMPERSONATION",
      "description": "Scam referencing the Climate Action Incentive refund."
    },
    {
      "pattern": "you have (a )?refund of \\$?[0-9,.]+ waiting.*(click|tap) (the )?link to claim",
      "type": "regex",
      "weight": 8,
      "category": "CRA_IMPERSONATION",
      "description": "CRA refund phishing script with a specific amount and link to claim."
    },
    {
      "pattern": "GST/HST.*refund|tax refund available",
      "type": "regex",
      "weight": 7,
      "category": "CRA_IMPERSONATION",
      "description": "Text or email offering a CRA GST/HST tax refund via link."
    },
    {
      "pattern": "emergency (benefit|relief|disaster payment) from (cra|canada revenue agency)",
      "type": "regex",
      "weight": 6,
      "category": "CRA_IMPERSONATION",
      "description": "Scams using emergency/disaster benefit pretext to harvest data."
    }
  ]
}
```

Waiting for remaining categories (B through G)...
