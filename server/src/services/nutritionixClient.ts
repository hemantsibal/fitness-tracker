export async function estimateViaNutritionix(text: string) {
  const appId = process.env.NUTRITIONIX_APP_ID, apiKey = process.env.NUTRITIONIX_API_KEY;
  if (!appId || !apiKey) return null;
  try {
    const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients',{method:'POST',headers:{'x-app-id':appId,'x-app-key':apiKey,'content-type':'application/json'},body:JSON.stringify({query:text})});
    if (!res.ok) return null;
    const data:any = await res.json();
    return { estimatedCalories: Math.round(data.foods?.reduce((s:number,f:any)=>s+(f.nf_calories||0),0)||0), sourceName:'Nutritionix', sourceUrl:'https://developer.nutritionix.com/', rawSourcePayload:data };
  } catch { return null; }
}
