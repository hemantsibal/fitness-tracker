import { Router } from 'express';
import { db } from '../db/database.js';
export const exportRouter = Router();
exportRouter.get('/csv',(_req,res)=>{ const rows = db.prepare('SELECT logged_date, meal_type, original_text, parsed_food_name, amount_text, estimated_calories, final_calories, confidence, source_name, source_url, notes FROM food_entries ORDER BY logged_date, created_at').all() as any[]; const header=Object.keys(rows[0]||{logged_date:''}).join(','); const lines=rows.map(r=>Object.values(r).map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')); res.header('content-type','text/csv'); res.send([header,...lines].join('\n')); });
