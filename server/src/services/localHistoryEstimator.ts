import { db } from '../db/database.js';

export function estimateFromHistory(food: string, amountText: string) {
  const rows = db.prepare(`SELECT final_calories FROM food_entries WHERE parsed_food_name=? AND amount_text=? ORDER BY created_at DESC LIMIT 3`).all(food, amountText) as {final_calories:number}[];
  if (!rows.length) return null;
  const avg = Math.round(rows.reduce((s,r)=>s+r.final_calories,0)/rows.length);
  return { estimatedCalories: avg, confidence: 'high', sourceName: 'Your previous entries', explanation: 'Average of your latest similar entries.' };
}
