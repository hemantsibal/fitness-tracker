import { Router } from 'express';
import { db } from '../db/database.js';

export const settingsRouter = Router();

settingsRouter.get('/', (_req,res)=>{
  const rows = db.prepare('SELECT key, value FROM app_settings').all() as {key:string; value:string}[];
  const settings = Object.fromEntries(rows.map((r)=>[r.key, r.value]));
  res.json({
    settings,
    dailyCalorieTarget: settings.daily_calorie_target ? Number(settings.daily_calorie_target) : null,
    nutritionixConfigured:Boolean(process.env.NUTRITIONIX_APP_ID&&process.env.NUTRITIONIX_API_KEY),
    edamamConfigured:Boolean(process.env.EDAMAM_APP_ID&&process.env.EDAMAM_APP_KEY),
    usdaConfigured:Boolean(process.env.USDA_API_KEY)
  });
});

settingsRouter.put('/daily-calorie-target', (req, res) => {
  const value = Number(req.body?.value);
  if (!Number.isFinite(value) || value <= 0) return res.status(400).json({ error: 'Invalid target' });
  db.prepare('INSERT INTO app_settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('daily_calorie_target', String(Math.round(value)));
  res.json({ success: true, dailyCalorieTarget: Math.round(value) });
});
