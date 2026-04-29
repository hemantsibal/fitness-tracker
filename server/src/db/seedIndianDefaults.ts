import { initDb, db } from './database.js';
initDb();
const foods = [['khichdi','khichdi',280,'1 bowl'],['dal','dal',180,'1 katori'],['roti','roti',100,'1 medium roti'],['poha','poha',300,'1 plate'],['idli','idli',60,'1 piece'],['dosa','dosa',170,'1 plain dosa'],['rajma','rajma',250,'1 katori'],['paneer curry','paneer curry',350,'1 katori']];
for (const [a,c,cal,s] of foods) db.prepare('INSERT OR IGNORE INTO food_aliases(alias,canonical_food_name,default_calories,default_serving) VALUES (?,?,?,?)').run(a,c,cal,s);
const portions = [['katori',150,150],['bowl',250,250],['plate',300,null],['tsp oil',5,5],['tbsp oil',14,15]];
for (const [u,g,m] of portions) db.prepare('INSERT OR IGNORE INTO portion_defaults(unit_name,grams_estimate,ml_estimate) VALUES (?,?,?)').run(u,g,m);
console.log('Seed complete');
