import { Router } from 'express';
import { estimateCalories } from '../services/nutritionEstimator.js';
export const estimateRouter = Router();
estimateRouter.post('/', async (req,res)=>{ res.json(await estimateCalories(req.body.text || '')); });
