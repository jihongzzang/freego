/*
  # 냉장고 재고관리 스키마

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key) - 식재료 고유 ID
      - `name` (text) - 식재료 이름
      - `category` (text) - 카테고리 (채소, 과일, 육류, 유제품, 기타)
      - `quantity` (integer) - 수량
      - `unit` (text) - 단위 (개, g, ml, etc)
      - `purchase_date` (date) - 구매일
      - `expiry_date` (date) - 유통기한
      - `storage_location` (text) - 보관 위치 (냉장실, 냉동실, 실온)
      - `memo` (text) - 메모
      - `image_url` (text) - 이미지 URL
      - `status` (text) - 상태 (신선, 주의, 소모됨)
      - `created_at` (timestamptz) - 생성일
      - `updated_at` (timestamptz) - 수정일

    - `consumption_history`
      - `id` (uuid, primary key) - 소모 기록 ID
      - `ingredient_id` (uuid, foreign key) - 식재료 ID
      - `ingredient_name` (text) - 식재료 이름
      - `quantity` (integer) - 소모량
      - `consumed_date` (date) - 소모일
      - `created_at` (timestamptz) - 생성일

    - `settings`
      - `id` (uuid, primary key) - 설정 ID
      - `notification_days` (integer) - 유통기한 알림 일수
      - `theme` (text) - 테마 (light, dark)
      - `created_at` (timestamptz) - 생성일
      - `updated_at` (timestamptz) - 수정일

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no authentication required)
*/

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '기타',
  quantity integer NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT '개',
  purchase_date date DEFAULT CURRENT_DATE,
  expiry_date date,
  storage_location text NOT NULL DEFAULT '냉장실',
  memo text DEFAULT '',
  image_url text,
  status text NOT NULL DEFAULT '신선',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consumption history table
CREATE TABLE IF NOT EXISTS consumption_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE SET NULL,
  ingredient_name text NOT NULL,
  quantity integer NOT NULL,
  consumed_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_days integer DEFAULT 3,
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumption_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can view ingredients"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "Public can insert ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update ingredients"
  ON ingredients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete ingredients"
  ON ingredients FOR DELETE
  USING (true);

CREATE POLICY "Public can view consumption history"
  ON consumption_history FOR SELECT
  USING (true);

CREATE POLICY "Public can insert consumption history"
  ON consumption_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Public can insert settings"
  ON settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update settings"
  ON settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (notification_days, theme)
VALUES (3, 'light')
ON CONFLICT DO NOTHING;