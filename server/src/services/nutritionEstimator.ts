import { parseFoodText } from '../utils/portionParser.js';
import { estimateFromHistory } from './localHistoryEstimator.js';
import { estimateFromDefaults } from './indianFoodDefaults.js';
import { estimateViaNutritionix } from './nutritionixClient.js';

export async function estimateCalories(text: string) {
  const parsed = parseFoodText(text);
  const amountText = `${parsed.quantity} ${parsed.unit}${parsed.quantity>1?'s':''}`;
  const h = estimateFromHistory(parsed.foodName, amountText);
  const base = h || estimateFromDefaults(parsed.foodName, parsed.quantity, parsed.modifiers) || await estimateViaNutritionix(text) || { estimatedCalories: 200, confidence:'low', sourceName:'Fallback estimate', explanation:'Manual correction recommended.' };
  const low = base.confidence === 'low';
  return {
    input:text, parsedFoodName: parsed.foodName, amountText,
    estimatedCalories: base.estimatedCalories,
    calorieMin: Math.round(base.estimatedCalories * (low ? 0.7 : 0.8)),
    calorieMax: Math.round(base.estimatedCalories * (low ? 1.4 : 1.25)),
    confidence: base.confidence || 'medium', sourceName: base.sourceName, sourceUrl: (base as any).sourceUrl || '', explanation: base.explanation || '', rawSourcePayload: (base as any).rawSourcePayload || {}
  };
}
