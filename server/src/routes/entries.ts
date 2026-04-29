import { Router } from 'express';
import { db } from '../db/database.js';
export const entriesRouter = Router();
entriesRouter.post('/',(req,res)=>{
  const b=req.body;
  const info=db.prepare(`INSERT INTO food_entries (logged_date,meal_type,original_text,parsed_food_name,amount_text,estimated_calories,calorie_min,calorie_max,final_calories,confidence,source_name,source_url,source_payload,notes) VALUES (@loggedDate,@mealType,@originalText,@parsedFoodName,@amountText,@estimatedCalories,@calorieMin,@calorieMax,@finalCalories,@confidence,@sourceName,@sourceUrl,@sourcePayload,@notes)`).run(b);
  res.json({id:info.lastInsertRowid,success:true});
});
entriesRouter.get('/',(req,res)=>{ const date=String(req.query.date||''); const entries=db.prepare('SELECT * FROM food_entries WHERE logged_date=? ORDER BY created_at DESC').all(date); const total=(entries as any[]).reduce((s,e)=>s+(e.final_calories||0),0); res.json({date,entries,totalCalories:total});});
entriesRouter.put('/:id',(req,res)=>{const id=req.params.id; db.prepare('UPDATE food_entries SET meal_type=@mealType, original_text=@originalText, estimated_calories=@estimatedCalories, final_calories=@finalCalories, notes=@notes, logged_date=@loggedDate, source_name=@sourceName, updated_at=CURRENT_TIMESTAMP WHERE id=@id').run({id,mealType:req.body.mealType,originalText:req.body.originalText,estimatedCalories:req.body.estimatedCalories,finalCalories:req.body.finalCalories,notes:req.body.notes||'',loggedDate:req.body.loggedDate,sourceName:req.body.sourceName}); res.json({success:true});});
entriesRouter.delete('/:id',(req,res)=>{db.prepare('DELETE FROM food_entries WHERE id=?').run(req.params.id); res.json({success:true});});
