import { parseFoodText } from '../utils/portionParser.js';
import { estimateFromHistory } from './localHistoryEstimator.js';
import { estimateFromDefaults } from './indianFoodDefaults.js';
import { estimateViaNutritionix } from './nutritionixClient.js';
import { estimateViaEdamam } from './edamamClient.js';
import { estimateViaUsda } from './usdaClient.js';

export async function estimateCalories(text: string) {
  const parsed = parseFoodText(text);
  const amountText = `${parsed.quantity} ${parsed.unit}${parsed.quantity>1?'s':''}`;
  const base: any =
    estimateFromHistory(parsed.foodName, amountText) ||
    estimateFromDefaults(parsed.foodName, parsed.quantity, parsed.modifiers) ||
    await estimateViaNutritionix(text) ||
    await estimateViaEdamam(text) ||
    await estimateViaUsda(text) ||
    {
      estimatedCalories: null,
      confidence:'low',
      sourceName:'No reliable estimate found',
      explanation:'Could not estimate calories from local history, Indian defaults, or configured nutrition APIs. Please enter calories manually.'
    };

  if (base.estimatedCalories == null) {
    return {
      input: text,
      parsedFoodName: parsed.foodName,
      amountText,
      estimatedCalories: null,
      calorieMin: null,
      calorieMax: null,
      confidence: base.confidence,
      sourceName: base.sourceName,
      sourceUrl: (base as any).sourceUrl || '',
      explanation: base.explanation || '',
      rawSourcePayload: (base as any).rawSourcePayload || {}
    };
  }

  const low = base.confidence === 'low';
  return {
    input:text, parsedFoodName: parsed.foodName, amountText,
    estimatedCalories: base.estimatedCalories,
    calorieMin: Math.round(base.estimatedCalories * (low ? 0.7 : 0.8)),
    calorieMax: Math.round(base.estimatedCalories * (low ? 1.4 : 1.25)),
    confidence: base.confidence || 'medium', sourceName: base.sourceName, sourceUrl: (base as any).sourceUrl || '', explanation: base.explanation || '', rawSourcePayload: (base as any).rawSourcePayload || {}
  };
}
