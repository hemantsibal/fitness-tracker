import { db } from '../db/database.js';

export function estimateFromDefaults(food: string, quantity: number, modifiers: {name:string;quantity:number;unit:string}[]) {
  const row = db.prepare('SELECT * FROM food_aliases WHERE alias=?').get(food) as any;
  if (!row?.default_calories) return null;
  let est = row.default_calories * quantity;
  for (const m of modifiers) if (m.name === 'ghee' || m.name === 'oil' || m.name==='butter') est += m.unit === 'tbsp' ? 120*m.quantity : 45*m.quantity;
  return { estimatedCalories: Math.round(est), confidence: 'medium', sourceName: 'Local Indian food defaults', explanation: `Used local ${food} default.` };
}
