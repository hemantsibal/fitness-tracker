import { Router } from 'express';
export const settingsRouter = Router();
settingsRouter.get('/', (_req,res)=>res.json({nutritionixConfigured:Boolean(process.env.NUTRITIONIX_APP_ID&&process.env.NUTRITIONIX_API_KEY),edamamConfigured:Boolean(process.env.EDAMAM_APP_ID&&process.env.EDAMAM_APP_KEY),usdaConfigured:Boolean(process.env.USDA_API_KEY)}));
