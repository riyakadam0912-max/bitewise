"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Apple, Bookmark, Check, ChefHat, Clock3, Flame, Heart, Search, Sparkles, Trash2, X } from "lucide-react";

export type DashboardSection = "overview" | "diary" | "plans" | "progress" | "recipes" | "profile";
export type Entry = {id:number;meal:string;name:string;calories:number;protein:number;carbs:number;fat:number;entryDate?:string};
export type Profile = {displayName:string;goal:string;diet:string;cuisine:string;calorieTarget:number;proteinTarget:number;carbsTarget:number;fatTarget:number;waterTarget:number;onboardingComplete:boolean};

type Props = {
  section: Exclude<DashboardSection,"overview">;
  profile: Profile;
  entries: Entry[];
  water: number;
  saving: boolean;
  post: (data:Record<string,unknown>)=>Promise<void>;
};

const foods=[
  {name:"Vegetable poha",meal:"Breakfast",serving:"1 bowl · 250 g",calories:385,protein:9,carbs:62,fat:11},
  {name:"Moong dal chilla",meal:"Breakfast",serving:"2 chillas · 180 g",calories:310,protein:17,carbs:42,fat:8},
  {name:"Dal, rice & cucumber",meal:"Lunch",serving:"1 plate · 420 g",calories:612,protein:22,carbs:102,fat:12},
  {name:"Paneer harvest bowl",meal:"Dinner",serving:"1 bowl · 380 g",calories:540,protein:31,carbs:48,fat:24},
  {name:"Fruit & roasted almonds",meal:"Snacks",serving:"1 serving · 180 g",calories:210,protein:6,carbs:28,fat:10},
  {name:"Curd with berries",meal:"Snacks",serving:"1 cup · 200 g",calories:165,protein:10,carbs:22,fat:4},
];

const recipes=[
  {name:"Herbed paneer grain bowl",diet:"Vegetarian",meal:"Dinner",time:"25 min",calories:540,protein:31,carbs:48,fat:24,color:"sage",allergens:"Dairy",ingredients:["120g paneer","¾ cup cooked brown rice","Seasonal greens","Mint curd"],method:"Sear the paneer until golden. Layer with warm rice and roasted greens, then finish with mint curd and lemon."},
  {name:"Golden moong chilla",diet:"Vegetarian",meal:"Breakfast",time:"20 min",calories:310,protein:17,carbs:42,fat:8,color:"gold",allergens:"None declared",ingredients:["¾ cup soaked moong dal","Ginger and cumin","Spinach","Tomato chutney"],method:"Blend soaked dal with aromatics. Fold in spinach and cook thin chillas on a lightly oiled pan."},
  {name:"Coconut lentil curry",diet:"Vegan",meal:"Lunch",time:"30 min",calories:465,protein:19,carbs:68,fat:14,color:"peach",allergens:"Coconut",ingredients:["¾ cup red lentils","Light coconut milk","Tomato","Coriander and lime"],method:"Simmer lentils with tomato and spices until tender. Stir in coconut milk and finish with coriander and lime."},
  {name:"Lemon pepper fish plate",diet:"Non-vegetarian",meal:"Dinner",time:"28 min",calories:490,protein:42,carbs:44,fat:16,color:"blue",allergens:"Fish",ingredients:["150g white fish","Baby potatoes","Green beans","Lemon and black pepper"],method:"Roast the potatoes, then bake the seasoned fish until just opaque. Serve with steamed beans and lemon."},
  {name:"Silken tofu soba",diet:"Vegan",meal:"Lunch",time:"18 min",calories:420,protein:22,carbs:58,fat:12,color:"lilac",allergens:"Soy, gluten",ingredients:["90g soba noodles","120g silken tofu","Cucumber ribbons","Sesame-lime dressing"],method:"Rinse cooked soba until cool. Arrange with tofu and cucumber, then spoon over the sesame-lime dressing."},
  {name:"Cardamom fruit oats",diet:"Vegetarian",meal:"Breakfast",time:"10 min",calories:355,protein:14,carbs:56,fat:9,color:"rose",allergens:"Dairy, nuts",ingredients:["½ cup rolled oats","¾ cup milk","Seasonal fruit","Almonds and cardamom"],method:"Simmer oats with milk and cardamom until creamy. Top with fresh fruit and chopped almonds."},
];

export default function DashboardModules({section,profile,entries,water,saving,post}:Props){
  if(section==="diary") return <FoodDiary entries={entries} post={post}/>;
  if(section==="plans") return <MealPlans profile={profile} post={post}/>;
  if(section==="progress") return <Progress profile={profile} entries={entries} water={water}/>;
  if(section==="recipes") return <Recipes post={post}/>;
  return <ProfileSettings profile={profile} saving={saving} post={post}/>;
}

function ModuleHeader({kicker,title,copy}:{kicker:string;title:string;copy:string}){
  return <header className="module-head"><div><span className="eyebrow">{kicker}</span><h1 className="display">{title}</h1></div><p>{copy}</p></header>;
}

function FoodDiary({entries,post}:{entries:Entry[];post:Props["post"]}){
  const [query,setQuery]=useState("");
  const matches=foods.filter(food=>food.name.toLowerCase().includes(query.toLowerCase()));
  const meals=["Breakfast","Lunch","Dinner","Snacks"];
  return <div className="module-page"><ModuleHeader kicker="Daily record" title="Food diary" copy="A simple, flexible record of what you eat—without judgment or perfect logging."/>
    <section className="card search-card"><Search size={18}/><input aria-label="Search curated foods" placeholder="Search foods and familiar meals" value={query} onChange={event=>setQuery(event.target.value)}/></section>
    {query&&<section className="result-grid">{matches.map(food=><article className="food-result" key={food.name}><div><span className="tag">Curated estimate</span><h3>{food.name}</h3><p>{food.serving}</p></div><div className="food-result-meta"><strong>{food.calories} kcal</strong><small>{food.protein}g protein</small><button className="small-btn" onClick={()=>void post({type:"entry",...food})}>Add</button></div></article>)}</section>}
    <div className="diary-grid">{meals.map(meal=>{const items=entries.filter(entry=>entry.meal===meal);const kcal=items.reduce((sum,item)=>sum+item.calories,0);return <section className="card diary-meal" key={meal}><header><div><span className="eyebrow">{meal}</span><h2>{Math.round(kcal)} kcal</h2></div><button className="round-action" onClick={()=>setQuery(meal==="Snacks"?"fruit":meal.toLowerCase())}>+</button></header>{items.length?items.map(item=><div className="diary-line" key={item.id}><span className="iconbox"><Apple size={16}/></span><div><strong>{item.name}</strong><small>{Math.round(item.protein)}g protein · {Math.round(item.carbs)}g carbs</small></div><b>{Math.round(item.calories)}</b><button aria-label={`Delete ${item.name}`} onClick={()=>void post({type:"delete",id:item.id})}><Trash2 size={15}/></button></div>):<p className="empty-copy">Nothing logged yet. Add something whenever you’re ready.</p>}</section>})}</div>
  </div>;
}

function MealPlans({profile,post}:{profile:Profile;post:Props["post"]}){
  const plan=foods.slice(0,4);
  const total=plan.reduce((sum,item)=>sum+item.calories,0);
  return <div className="module-page"><ModuleHeader kicker="Made for your rhythm" title="Your meal plan" copy={`A practical ${profile.diet.toLowerCase()} plan inspired by ${profile.cuisine.toLowerCase()} food and your ${profile.goal.toLowerCase()} goal.`}/>
    <section className="plan-summary"><div><Sparkles/><span>Today’s balance</span><strong>{total} kcal</strong></div><div><span>Protein</span><strong>{plan.reduce((s,x)=>s+x.protein,0)}g</strong></div><div><span>Target</span><strong>{profile.calorieTarget} kcal</strong></div><button className="pill pill-light">Refresh plan</button></section>
    <div className="meal-plan-grid">{plan.map((meal,index)=><article className="meal-plan-card" key={meal.name}><div className={`recipe-art art-${["sage","gold","peach","blue"][index]}`}><span>{meal.meal}</span></div><div className="meal-plan-body"><div className="meal-plan-title"><div><span className="eyebrow">{meal.serving}</span><h2>{meal.name}</h2></div><Bookmark size={18}/></div><p>{meal.calories} kcal · {meal.protein}g protein · {meal.carbs}g carbs</p><div className="card-actions"><button className="ghost-btn">View recipe</button><button className="small-btn" onClick={()=>void post({type:"entry",...meal})}>Add to diary</button></div></div></article>)}</div>
    <p className="module-note">Plans are general wellness estimates, not medical prescriptions. Ingredients and homemade portions can vary.</p>
  </div>;
}

function Progress({profile,entries,water}:{profile:Profile;entries:Entry[];water:number}){
  const days=useMemo(()=>Array.from({length:7},(_,offset)=>{const date=new Date();date.setDate(date.getDate()-(6-offset));const key=date.toISOString().slice(0,10);const dayEntries=entries.filter(entry=>(entry.entryDate??new Date().toISOString().slice(0,10))===key);return {key,label:date.toLocaleDateString("en",{weekday:"short"}).slice(0,1),calories:dayEntries.reduce((s,x)=>s+x.calories,0),protein:dayEntries.reduce((s,x)=>s+x.protein,0)}}),[entries]);
  const today=days.at(-1)?.calories??0;const consistency=days.filter(day=>day.calories>0).length;
  return <div className="module-page"><ModuleHeader kicker="Patterns, not perfection" title="Your progress" copy="See what your recent choices are adding up to, with calm context instead of pressure."/>
    <div className="metric-row"><article><span>Today</span><strong>{Math.round(today)}</strong><small>kcal logged</small></article><article><span>This week</span><strong>{consistency}/7</strong><small>days tracked</small></article><article><span>Hydration</span><strong>{water}</strong><small>of {profile.waterTarget} glasses</small></article></div>
    <section className="card progress-card"><header><div><span className="eyebrow">Seven-day view</span><h2>Calorie awareness</h2></div><span className="tag">Target {profile.calorieTarget}</span></header><div className="progress-chart">{days.map(day=>{const height=Math.max(4,Math.min(100,day.calories/profile.calorieTarget*100));return <div className="progress-column" key={day.key}><div className="progress-track"><i style={{height:`${height}%`}}/><em style={{bottom:"100%"}}/></div><b>{day.label}</b><small>{day.calories?Math.round(day.calories):"—"}</small></div>})}</div></section>
    <section className="insight-strip"><Check/><div><strong>{consistency?"You’re building a useful pattern.":"Your first entry starts the picture."}</strong><p>{consistency?"Logged days help BiteWise show trends without turning every meal into a score.":"Track when it feels useful—there is no need to recreate previous days."}</p></div></section>
  </div>;
}

function Recipes({post}:{post:Props["post"]}){
  const [query,setQuery]=useState("");const [filter,setFilter]=useState("All");
  const [favorites,setFavorites]=useState<string[]>([]);
  const [selected,setSelected]=useState<(typeof recipes)[number]|null>(null);
  // Synchronize favorites after hydration so server and first client render match.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{try{setFavorites(JSON.parse(window.localStorage.getItem("bitewise:favorites:v1")??"[]") as string[])}catch{window.localStorage.removeItem("bitewise:favorites:v1")}},[]);
  const visible=recipes.filter(recipe=>(filter==="All"||recipe.diet===filter)&&recipe.name.toLowerCase().includes(query.toLowerCase()));
  const toggle=(name:string)=>{const next=favorites.includes(name)?favorites.filter(item=>item!==name):[...favorites,name];setFavorites(next);window.localStorage.setItem("bitewise:favorites:v1",JSON.stringify(next))};
  return <div className="module-page"><ModuleHeader kicker="Curated kitchen" title="Recipes" copy="Flexible, familiar recipes with transparent estimates, simple methods, and practical preparation times."/>
    <div className="recipe-tools"><label><Search size={17}/><input placeholder="Search recipes" value={query} onChange={event=>setQuery(event.target.value)}/></label><div>{["All","Vegetarian","Vegan","Non-vegetarian"].map(item=><button className={filter===item?"selected":""} key={item} onClick={()=>setFilter(item)}>{item}</button>)}</div></div>
    <div className="recipe-grid">{visible.map(recipe=><article className="recipe-card" key={recipe.name}><div className={`recipe-art art-${recipe.color}`}><span>{recipe.meal}</span><button aria-label={`Favorite ${recipe.name}`} onClick={()=>toggle(recipe.name)}><Heart fill={favorites.includes(recipe.name)?"currentColor":"none"}/></button></div><div><div className="recipe-title"><h2>{recipe.name}</h2></div><p><Clock3 size={14}/>{recipe.time}<i/> <Flame size={14}/>{recipe.calories} kcal</p><div className="recipe-macros"><span>{recipe.protein}g <small>protein</small></span><span>{recipe.carbs}g <small>carbs</small></span><span>{recipe.fat}g <small>fat</small></span></div><div className="card-actions"><button className="text-action" onClick={()=>setSelected(recipe)}>View recipe</button><button className="round-add" aria-label={`Add ${recipe.name} to diary`} onClick={()=>void post({type:"entry",meal:recipe.meal,name:recipe.name,calories:recipe.calories,protein:recipe.protein,carbs:recipe.carbs,fat:recipe.fat})}>+</button></div></div></article>)}</div>
    {!visible.length&&<div className="empty-state"><Search/><h2>No recipes found</h2><p>Try a different search or dietary filter.</p></div>}
    {selected&&<div className="recipe-overlay" role="dialog" aria-modal="true" aria-label={selected.name} onMouseDown={event=>{if(event.target===event.currentTarget)setSelected(null)}}><article className="recipe-detail"><button className="detail-close" aria-label="Close recipe" onClick={()=>setSelected(null)}><X/></button><div className={`detail-art art-${selected.color}`}><span>{selected.meal}</span><ChefHat/></div><div className="detail-copy"><span className="eyebrow">{selected.diet} · {selected.time}</span><h2 className="display">{selected.name}</h2><p>{selected.method}</p><div className="detail-nutrition"><span><b>{selected.calories}</b> kcal</span><span><b>{selected.protein}g</b> protein</span><span><b>{selected.carbs}g</b> carbs</span><span><b>{selected.fat}g</b> fat</span></div><h3>What you’ll need</h3><ul>{selected.ingredients.map(item=><li key={item}>{item}</li>)}</ul><p className="allergen-note"><b>Allergens:</b> {selected.allergens}. Nutrition is an estimate and homemade portions vary.</p><button className="pill pill-dark" onClick={()=>{void post({type:"entry",meal:selected.meal,name:selected.name,calories:selected.calories,protein:selected.protein,carbs:selected.carbs,fat:selected.fat});setSelected(null)}}>Add to today’s diary</button></div></article></div>}
  </div>;
}

function ProfileSettings({profile,saving,post}:{profile:Profile;saving:boolean;post:Props["post"]}){
  const [form,setForm]=useState(profile);
  const submit=(event:FormEvent)=>{event.preventDefault();void post({type:"profile",...form})};
  return <div className="module-page"><ModuleHeader kicker="Your preferences" title="Profile" copy="Keep your plan aligned with your routines, goals, and the food that feels familiar."/>
    <form className="profile-layout" onSubmit={submit}><section className="card profile-card"><span className="eyebrow">Personal details</span><label>Display name<input className="field" value={form.displayName} onChange={event=>setForm({...form,displayName:event.target.value})}/></label><label>Primary goal<select className="field" value={form.goal} onChange={event=>setForm({...form,goal:event.target.value})}>{["Maintain weight","Lose weight gently","Build muscle","General healthy eating"].map(item=><option key={item}>{item}</option>)}</select></label><label>Dietary pattern<select className="field" value={form.diet} onChange={event=>setForm({...form,diet:event.target.value})}>{["Vegetarian","Non-vegetarian","Vegan","Eggetarian","Pescatarian","Flexible"].map(item=><option key={item}>{item}</option>)}</select></label><label>Preferred cuisine<select className="field" value={form.cuisine} onChange={event=>setForm({...form,cuisine:event.target.value})}>{["Indian","Mediterranean","Asian","Western","Mixed cuisine"].map(item=><option key={item}>{item}</option>)}</select></label></section>
      <section className="card profile-card"><span className="eyebrow">Daily targets</span><div className="target-grid"><label>Calories<input className="field" type="number" min="1200" max="5000" value={form.calorieTarget} onChange={event=>setForm({...form,calorieTarget:Number(event.target.value)})}/></label><label>Protein (g)<input className="field" type="number" min="20" max="300" value={form.proteinTarget} onChange={event=>setForm({...form,proteinTarget:Number(event.target.value)})}/></label><label>Carbs (g)<input className="field" type="number" min="20" max="700" value={form.carbsTarget} onChange={event=>setForm({...form,carbsTarget:Number(event.target.value)})}/></label><label>Fat (g)<input className="field" type="number" min="20" max="250" value={form.fatTarget} onChange={event=>setForm({...form,fatTarget:Number(event.target.value)})}/></label><label>Water (glasses)<input className="field" type="number" min="1" max="20" value={form.waterTarget} onChange={event=>setForm({...form,waterTarget:Number(event.target.value)})}/></label></div><p className="module-note">Targets are estimates for general wellness. Review significant dietary or medical needs with a qualified professional.</p><button className="pill pill-dark" disabled={saving}>{saving?"Saving…":"Save changes"}</button></section>
    </form>
  </div>;
}
