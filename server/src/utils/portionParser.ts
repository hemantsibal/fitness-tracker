export type Modifier = { name: string; quantity: number; unit: string };
export type ParsedFood = { quantity: number; unit: string; foodName: string; modifiers: Modifier[] };

const foods = ['khichdi','dal','rice','roti','sabzi','poha','dosa','idli','rajma','paneer','curd rice'];
const mods = ['ghee','oil','butter','sugar'];

export function parseFoodText(input: string): ParsedFood {
  const text = input.toLowerCase();
  const q = text.match(/(\d+(?:\/\d+)?)|half/);
  const quantity = q?.[0] === 'half' ? 0.5 : q?.[0]?.includes('/') ? Number(q[0].split('/')[0]) / Number(q[0].split('/')[1]) : Number(q?.[0] || 1);
  const unit = (text.match(/\b(bowls?|katori|plate|roti|piece|tsp|tbsp|cup)s?\b/)?.[0] || 'serving').replace(/s$/,'');
  const foodName = foods.find((f)=>text.includes(f)) || text.split(' with ')[0];
  const modifiers: Modifier[] = [];
  for (const m of mods) {
    if (text.includes(m)) {
      const mm = text.match(new RegExp(`(\\d+|half|1\\/2)?\\s*(tsp|tbsp)?\\s*${m}`));
      const mq = mm?.[1] === 'half' ? 0.5 : mm?.[1] ? Number(mm[1]) : 1;
      modifiers.push({ name: m, quantity: mq, unit: mm?.[2] || 'tsp' });
    }
  }
  return { quantity: Number.isFinite(quantity) ? quantity : 1, unit, foodName, modifiers };
}
