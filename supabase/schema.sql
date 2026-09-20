-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Receipt metadata
  merchant TEXT NOT NULL,
  receipt_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2),
  payment_method TEXT,
  
  -- Business categorization
  category TEXT NOT NULL,
  notes TEXT,
  
  -- Storage
  image_path TEXT NOT NULL,
  
  -- Full extracted data as JSON
  extracted_data JSONB NOT NULL,
  
  CONSTRAINT receipts_user_id_idx CHECK (length(merchant) > 0)
);

-- RLS policies
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own receipts
CREATE POLICY "Users can view own receipts"
  ON receipts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own receipts
CREATE POLICY "Users can insert own receipts"
  ON receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own receipts
CREATE POLICY "Users can update own receipts"
  ON receipts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own receipts
CREATE POLICY "Users can delete own receipts"
  ON receipts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for user queries
CREATE INDEX receipts_user_id_date_idx ON receipts(user_id, receipt_date DESC);

-- Category overrides (remember user's category choices per merchant)
CREATE TABLE IF NOT EXISTS category_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, merchant)
);

ALTER TABLE category_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own category overrides"
  ON category_overrides FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX category_overrides_user_merchant_idx ON category_overrides(user_id, merchant);
