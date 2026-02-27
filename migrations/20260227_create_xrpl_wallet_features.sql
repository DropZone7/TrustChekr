CREATE TABLE IF NOT EXISTS xrpl_wallet_features (
  address text PRIMARY KEY,
  label text NOT NULL CHECK (label IN ('scam', 'benign', 'exchange', 'unknown')),

  tx_count_total integer NOT NULL,
  tx_count_inbound integer NOT NULL,
  tx_count_outbound integer NOT NULL,
  unique_counterparties integer NOT NULL,

  lifetime_days integer NOT NULL,
  avg_tx_amount numeric NOT NULL,
  median_tx_amount numeric NOT NULL,
  max_tx_amount numeric NOT NULL,
  min_tx_amount numeric NOT NULL,

  avg_tx_per_day_active numeric NOT NULL,
  max_tx_in_one_day integer NOT NULL,

  days_since_first_tx integer NOT NULL,
  days_since_last_tx integer NOT NULL,

  fraction_tiny_amounts numeric NOT NULL,
  fraction_first_time_inbound numeric NOT NULL,
  fraction_to_known_exchanges numeric NOT NULL,

  source text NOT NULL,
  label_confidence numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xrpl_wallet_features_label ON xrpl_wallet_features (label);
