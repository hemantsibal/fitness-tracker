import { useEffect, useMemo, useState } from 'react';

type Entry = any;
const API = 'http://localhost:4000';
const today = new Date().toISOString().slice(0,10);
const meals = ['Breakfast','Lunch','Dinner','Snack','Other'];
const mealOrder = Object.fromEntries(meals.map((m, i) => [m, i]));

export default function App(){
  const [text,setText]=useState(''); const [meal,setMeal]=useState('Lunch'); const [date,setDate]=useState(today); const [est,setEst]=useState<any>(null); const [finalCalories,setFinalCalories]=useState<number | ''>(''); const [entries,setEntries]=useState<Entry[]>([]); const [total,setTotal]=useState(0);
  const [target, setTarget] = useState<number | null>(null); const [targetInput, setTargetInput] = useState('2000');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc'); const [editing, setEditing] = useState<Entry | null>(null);

  const load=async()=>{ const r=await fetch(`${API}/api/entries?date=${date}`); const d=await r.json(); setEntries(d.entries); setTotal(d.totalCalories);};
  const loadSettings = async()=> { const r = await fetch(`${API}/api/settings`); const d = await r.json(); setTarget(d.dailyCalorieTarget); if (d.dailyCalorieTarget) setTargetInput(String(d.dailyCalorieTarget)); };
  useEffect(()=>{load();},[date]);
  useEffect(()=>{loadSettings();},[]);

  const sortedEntries = useMemo(() => [...entries].sort((a,b) => (sortDir === 'asc' ? 1 : -1) * ((mealOrder[a.meal_type] ?? 99) - (mealOrder[b.meal_type] ?? 99))), [entries, sortDir]);
  const remaining = target != null ? target - total : null;

  return <div className='min-h-screen bg-slate-50 text-slate-900 p-4'><div className='max-w-6xl mx-auto grid gap-4'>
    <h1 className='text-3xl font-semibold'>Nutrition Tracker</h1>
    <div className='grid md:grid-cols-3 gap-4'>
      <div className='rounded-2xl shadow-sm border bg-white p-4'><p className='text-slate-500 text-sm'>Selected date</p><input className='border rounded-lg p-2 w-full' value={date} onChange={e=>setDate(e.target.value)} type='date'/></div>
      <div className='rounded-2xl shadow-sm border bg-white p-4'><p className='text-slate-500 text-sm'>Today’s Total</p><p className='text-2xl font-bold'>{total} kcal</p>{target==null?<p className='text-sm text-slate-500'>Set a daily calorie target in settings.</p>:<><p>Target: {target} kcal</p><p className={remaining! < 0 ? 'text-red-600':'text-emerald-600'}>{remaining! < 0 ? `Over by ${Math.abs(remaining!)} kcal` : `Remaining ${remaining} kcal`}</p><div className='h-2 bg-slate-100 rounded mt-2'><div className='h-2 bg-indigo-500 rounded' style={{width:`${Math.min(100, Math.round((total/target)*100))}%`}}/></div></>}</div>
      <div className='rounded-2xl shadow-sm border bg-white p-4'><p className='text-slate-500 text-sm'>Daily calorie target</p><div className='flex gap-2'><input className='border rounded-lg p-2 w-full' type='number' value={targetInput} onChange={e=>setTargetInput(e.target.value)}/><button className='px-4 py-2 rounded-lg bg-indigo-600 text-white' onClick={async()=>{await fetch(`${API}/api/settings/daily-calorie-target`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({value:Number(targetInput)})}); loadSettings();}}>Save</button></div></div>
    </div>

    <div className='rounded-2xl shadow-sm border bg-white p-4 grid gap-2'>
      <div className='flex gap-2'><select className='border rounded-lg p-2' value={meal} onChange={e=>setMeal(e.target.value)}>{meals.map(m=><option key={m}>{m}</option>)}</select></div>
      <textarea className='border rounded-lg p-3' value={text} onChange={e=>setText(e.target.value)} placeholder='2 bowls khichdi with 1 tsp ghee | 3 rotis and 1 katori dal | 1 plate poha'/>
      <button className='px-4 py-2 rounded-lg bg-slate-900 text-white w-fit' onClick={async()=>{const r=await fetch(`${API}/api/estimate`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,mealType:meal,loggedDate:date})}); const d=await r.json(); setEst(d); setFinalCalories(d.estimatedCalories ?? '');}}>Estimate Calories</button>
      {est && <div className='rounded-xl border p-3 bg-slate-50'><h3 className='font-semibold'>Estimate {est.estimatedCalories ?? '—'} kcal {est.calorieMin ? `(${est.calorieMin}-${est.calorieMax})` : ''}</h3><p className='text-sm'>{est.sourceName} · {est.confidence}</p><p className='text-sm text-slate-500'>{est.explanation}</p><input className='border rounded p-2 mt-2' type='number' placeholder='Enter final calories' value={finalCalories} onChange={e=>setFinalCalories(e.target.value===''?'':Number(e.target.value))}/><button className='ml-2 px-3 py-2 bg-indigo-600 text-white rounded' onClick={async()=>{await fetch(`${API}/api/entries`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({loggedDate:date,mealType:meal,originalText:text,parsedFoodName:est.parsedFoodName,amountText:est.amountText,estimatedCalories:est.estimatedCalories,calorieMin:est.calorieMin,calorieMax:est.calorieMax,finalCalories:Number(finalCalories||0),confidence:est.confidence,sourceName:est.sourceName,sourceUrl:est.sourceUrl,sourcePayload:JSON.stringify(est.rawSourcePayload),notes:''})}); setText(''); setEst(null); setFinalCalories(''); load();}}>Save Entry</button></div>}
    </div>

    <div className='rounded-2xl shadow-sm border bg-white p-4'>
      <table className='w-full text-sm'><thead><tr><th className='text-left'><button onClick={()=>setSortDir(sortDir==='asc'?'desc':'asc')}>Meal {sortDir==='asc'?'↑':'↓'}</button></th><th className='text-left'>Food</th><th>Final</th><th>Source</th><th/></tr></thead><tbody>{sortedEntries.length===0?<tr><td colSpan={5} className='py-8 text-center text-slate-500'>No meals logged for this day yet. Start with something like “2 bowls khichdi with 1 tsp ghee.”</td></tr>:sortedEntries.map(e=><tr key={e.id} className='border-t'><td>{e.meal_type}</td><td>{e.original_text}</td><td className='text-center'>{e.final_calories}</td><td className='text-center'>{e.source_name}</td><td className='text-right'><button className='mr-2 text-indigo-600' onClick={()=>setEditing({...e})}>Edit</button><button className='text-red-600' onClick={async()=>{await fetch(`${API}/api/entries/${e.id}`,{method:'DELETE'}); load();}}>Delete</button></td></tr>)}</tbody></table>
    </div>

    {editing && <div className='fixed inset-0 bg-black/40 grid place-items-center'><div className='bg-white rounded-2xl p-4 w-[500px] max-w-[95vw] grid gap-2'><h3 className='font-semibold text-lg'>Edit Entry</h3><input className='border rounded p-2' value={editing.logged_date} onChange={e=>setEditing({...editing,logged_date:e.target.value})} type='date'/><select className='border rounded p-2' value={editing.meal_type} onChange={e=>setEditing({...editing,meal_type:e.target.value})}>{meals.map(m=><option key={m}>{m}</option>)}</select><input className='border rounded p-2' value={editing.original_text} onChange={e=>setEditing({...editing,original_text:e.target.value})}/><input className='border rounded p-2' type='number' value={editing.estimated_calories ?? ''} onChange={e=>setEditing({...editing,estimated_calories:Number(e.target.value)})}/><input className='border rounded p-2' type='number' value={editing.final_calories} onChange={e=>setEditing({...editing,final_calories:Number(e.target.value)})}/><input className='border rounded p-2' value={editing.source_name || ''} onChange={e=>setEditing({...editing,source_name:e.target.value})}/><textarea className='border rounded p-2' value={editing.notes || ''} onChange={e=>setEditing({...editing,notes:e.target.value})}/><div className='flex justify-end gap-2'><button onClick={()=>setEditing(null)}>Cancel</button><button className='px-4 py-2 rounded bg-indigo-600 text-white' onClick={async()=>{await fetch(`${API}/api/entries/${editing.id}`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({loggedDate:editing.logged_date,mealType:editing.meal_type,originalText:editing.original_text,estimatedCalories:editing.estimated_calories,finalCalories:editing.final_calories,notes:editing.notes,sourceName:editing.source_name})}); setEditing(null); load();}}>Save</button></div></div></div>}
  </div></div>
}
