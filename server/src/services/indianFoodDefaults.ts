const DEFAULTS: Record<string, number> = {
  khichdi: 300, dal: 180, roti: 100, phulka: 90, paratha: 220, rice: 210,
  'curd rice': 280, poha: 300, upma: 260, idli: 65, dosa: 170, uttapam: 220,
  vada: 140, sambar: 120, rasam: 80, rajma: 240, chole: 260, 'paneer curry': 320,
  'palak paneer': 300, 'mixed veg sabzi': 170, 'aloo sabzi': 190, biryani: 360,
  pulao: 300, curd: 100, chaas: 60, 'tea with milk': 90, 'coffee with milk': 80,
  banana: 110, apple: 95, egg: 78, omelette: 150,
};

function findFoodDefault(food: string) {
  const normalized = food.toLowerCase().trim();
  const matched = Object.keys(DEFAULTS).find((k) => normalized.includes(k));
  return matched ? DEFAULTS[matched] : null;
}

export function estimateFromDefaults(food: string, quantity: number, modifiers: {name:string;quantity:number;unit:string}[]) {
  const baseDefault = findFoodDefault(food);
  if (!baseDefault) return null;

  let est = baseDefault * quantity;
  for (const m of modifiers) {
    if (['ghee', 'oil', 'butter'].includes(m.name)) est += (m.unit === 'tbsp' ? 120 : 45) * m.quantity;
    if (m.name === 'sugar') est += (m.unit === 'tbsp' ? 48 : 16) * m.quantity;
  }

  return {
    estimatedCalories: Math.round(est),
    confidence: 'medium',
    sourceName: 'Local Indian food defaults',
    explanation: `Estimated using Indian defaults${modifiers.length ? ' and detected add-ons' : ''}.`
  };
}
