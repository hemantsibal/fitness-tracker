CREATE TABLE IF NOT EXISTS food_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logged_date TEXT NOT NULL,
  meal_type TEXT,
  original_text TEXT NOT NULL,
  parsed_food_name TEXT,
  amount_text TEXT,
  estimated_calories INTEGER,
  calorie_min INTEGER,
  calorie_max INTEGER,
  final_calories INTEGER NOT NULL,
  confidence TEXT,
  source_name TEXT,
  source_url TEXT,
  source_payload TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS food_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL UNIQUE,
  canonical_food_name TEXT NOT NULL,
  default_calories INTEGER,
  default_serving TEXT,
  notes TEXT
);
CREATE TABLE IF NOT EXISTS portion_defaults (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_name TEXT NOT NULL UNIQUE,
  grams_estimate INTEGER,
  ml_estimate INTEGER,
  notes TEXT
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
