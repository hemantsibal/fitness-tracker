# Local Indian Nutrition Tracker

## Install
1. `npm run install:all`

## Run locally
1. Copy `.env.example` to `.env`.
2. `npm run dev`
3. Server: `http://localhost:4000/health`, client: Vite default URL.

## Configure API keys
Set Nutritionix, Edamam, USDA keys in `.env`. App still works without keys using local history/defaults.

## How estimation works
1. Parse portion and food from natural text.
2. Try local history for same food+amount.
3. Try local Indian defaults and modifiers (ghee/oil/butter).
4. Try external API fallback (Nutritionix implemented; stubs for Edamam/USDA).

## Export CSV
Use `GET /api/export/csv`.

## Known limitations
Indian home-food calories are highly variable by oil, ghee, sugar, and prep style.
