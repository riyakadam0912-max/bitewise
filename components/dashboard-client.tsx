"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Apple, BookOpen, Droplets, Gauge, Heart, LogOut, Plus, Sparkles, Trash2, TrendingUp, UserRound } from "lucide-react";

type Entry={id:number;meal:string;name:string;calories:number;protein:number;carbs:number;fat:number};
type Profile={displayName:string;goal:string;diet:string;cuisine:string;calorieTarget:number;proteinTarget:number;carbsTarget:number;fatTarget:number;waterTarget:number;onboardingComplete:boolean};
type NutritionResponse={profile:Profile|null;entries:Entry[];water:number};
type DashboardProps={user:{name:string;email:string};signOut:string;storage:"api"|"browser"};
const STORAGE_KEY="bitewise:nutrition:v1";
const suggested=[
  {name:"Vegetable poha",calories:385,protein:9,carbs:62,fat:11,meal:"Breakfast"},
  {name:"Dal, rice & cucumber",calories:612,protein:22,carbs:102,fat:12,meal:"Lunch"},
  {name:"Paneer harvest bowl",calories:540,protein:31,carbs:48,fat:24,meal:"Dinner"},
  {name:"Fruit & roasted almonds",calories:210,protein:6,carbs:28,fat:10,meal:"Snacks"},
];
const weekly=[68,82,59,91,74,86,63];

export default function DashboardClient({user,signOut,storage}:DashboardProps){
  const [profile,setProfile]=useState<Profile|null>(null); const [entries,setEntries]=useState<Entry[]>([]); const [water,setWater]=useState(0); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [step,setStep]=useState(0);
  const [setup,setSetup]=useState({displayName:user.name.split("@")[0],goal:"Maintain weight",diet:"Vegetarian",cuisine:"Indian"});
  const [form,setForm]=useState({name:"",calories:"",protein:"",meal:"Lunch"});
  const load=async()=>{
    if(storage==="browser"){
      const saved=window.localStorage.getItem(STORAGE_KEY);
      if(saved){try{const d=JSON.parse(saved) as NutritionResponse;setProfile(d.profile);setEntries(d.entries);setWater(d.water)}catch{window.localStorage.removeItem(STORAGE_KEY)}}
      setLoading(false);return;
    }
    const r=await fetch("/api/nutrition");if(r.ok){const d=await r.json() as NutritionResponse;setProfile(d.profile);setEntries(d.entries);setWater(d.water)}setLoading(false)
  };
  // Initial synchronization intentionally runs once for this dashboard session.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(()=>{void load()},[]);
  const post=async(data:Record<string,unknown>)=>{
    setSaving(true);
    if(storage==="browser"){
      let nextProfile=profile;let nextEntries=entries;let nextWater=water;
      if(data.type==="profile"){
        const goal=String(data.goal??"Maintain weight");
        nextProfile={displayName:String(data.displayName??user.name),goal,diet:String(data.diet??"Vegetarian"),cuisine:String(data.cuisine??"Indian"),calorieTarget:goal==="Build muscle"?2300:goal==="Lose weight gently"?1800:2000,proteinTarget:goal==="Build muscle"?130:105,carbsTarget:250,fatTarget:65,waterTarget:8,onboardingComplete:true};
        setProfile(nextProfile);
      }else if(data.type==="entry"){
        const calories=Number(data.calories)||0;
        const entry:Entry={id:entries.reduce((max,item)=>Math.max(max,item.id),0)+1,meal:String(data.meal??"Lunch"),name:String(data.name??"Custom food"),calories,protein:Number(data.protein)||0,carbs:Number(data.carbs)||0,fat:Number(data.fat)||0};
        nextEntries=[...entries,entry];setEntries(nextEntries);
      }else if(data.type==="water"){
        nextWater=Math.max(0,Math.min(20,Number(data.glasses)||0));setWater(nextWater);
      }else if(data.type==="delete"){
        nextEntries=entries.filter(entry=>entry.id!==Number(data.id));setEntries(nextEntries);
      }
      window.localStorage.setItem(STORAGE_KEY,JSON.stringify({profile:nextProfile,entries:nextEntries,water:nextWater} satisfies NutritionResponse));
      setSaving(false);return;
    }
    const r=await fetch("/api/nutrition",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});setSaving(false);if(r.ok)await load()
  };
  const totals=useMemo(()=>entries.reduce((a,e)=>({calories:a.calories+e.calories,protein:a.protein+e.protein,carbs:a.carbs+e.carbs,fat:a.fat+e.fat}),{calories:0,protein:0,carbs:0,fat:0}),[entries]);
  const p=profile??{displayName:user.name,goal:"Maintain weight",diet:"Vegetarian",cuisine:"Indian",calorieTarget:2000,proteinTarget:105,carbsTarget:250,fatTarget:65,waterTarget:8,onboardingComplete:false};
  const pct=(v:number,t:number)=>Math.min(100,Math.round(v/t*100));
  const addFood=(e:FormEvent)=>{e.preventDefault();if(!form.name||!form.calories)return;void post({type:"entry",name:form.name,calories:Number(form.calories),protein:Number(form.protein)||0,carbs:(Number(form.calories)*.45)/4,fat:(Number(form.calories)*.25)/9,meal:form.meal});setForm({name:"",calories:"",protein:"",meal:"Lunch"})};
  const addSuggested=(food:typeof suggested[number])=>void post({type:"entry",...food});
  return <div className="app-shell">
    <aside className="sidebar"><Link href="/" className="brand" style={{color:"white"}}><span className="mark" style={{borderColor:"white"}}/>BiteWise</Link><nav className="side-nav"><a className="active"><Gauge size={17}/> Overview</a><a><Apple size={17}/> Food diary</a><a><BookOpen size={17}/> Meal plans</a><a><TrendingUp size={17}/> Progress</a><a><Heart size={17}/> Recipes</a><a><UserRound size={17}/> Profile</a></nav><div className="side-bottom"><a href={signOut} target="_top" className="pill" style={{background:"#ffffff12",color:"white"}}><LogOut size={15}/> Sign out</a></div></aside>
    <main className="app-main"><header className="app-top"><div><span className="eyebrow">{new Date().toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric"})}</span><h1 className="display">Good morning, {p.displayName.split(" ")[0]}.</h1><p className="fine">Let’s make today a balanced one.</p></div><button className="pill pill-dark" onClick={()=>document.getElementById("food-name")?.focus()}><Plus size={16}/> Add food</button></header>
      {loading?<div className="card">Loading your nutrition space…</div>:<div className="grid-main"><div style={{display:"grid",gap:18}}>
        <section className="card"><div className="cal-grid"><div className="ring big-ring" style={{background:`conic-gradient(var(--peach) 0 ${pct(totals.calories,p.calorieTarget)}%,#eee8dc ${pct(totals.calories,p.calorieTarget)}%)`}}><span><b>{Math.round(totals.calories)}</b><small className="fine">of {p.calorieTarget} kcal</small></span></div><div><span className="eyebrow">Today’s nutrition</span><h2 style={{color:"var(--forest)",margin:"8px 0"}}>{Math.max(0,p.calorieTarget-Math.round(totals.calories))} kcal remaining</h2>{[["Protein",totals.protein,p.proteinTarget,"#668e82"],["Carbohydrates",totals.carbs,p.carbsTarget,"#d39b63"],["Fat",totals.fat,p.fatTarget,"#b88a9a"]].map(([n,v,t,c])=><div className="macro-line" key={String(n)}><header><span>{n}</span><span>{Math.round(Number(v))}g / {t}g</span></header><div className="macro"><i style={{width:`${pct(Number(v),Number(t))}%`,background:String(c)}}/></div></div>)}</div></div></section>
        <section className="card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span className="eyebrow">Food diary</span><h2 style={{margin:"6px 0",color:"var(--forest)"}}>Today’s meals</h2></div><span className="tag">Values are estimates</span></div><div className="meals">{entries.length?entries.map(e=><div className="meal-entry" key={e.id}><span className="iconbox"><Apple size={18}/></span><div><strong>{e.name}</strong><div className="fine">{e.meal} · {Math.round(e.protein)}g protein</div></div><strong>{Math.round(e.calories)} kcal</strong><button aria-label={`Delete ${e.name}`} className="ghost-btn" onClick={()=>void post({type:"delete",id:e.id})}><Trash2 size={15}/></button></div>):<div className="fine" style={{padding:"28px 0"}}>Nothing logged yet. Add a familiar meal whenever you’re ready.</div>}</div>
          <form className="add-form" onSubmit={addFood}><input id="food-name" className="field" placeholder="Food or dish" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select className="field" value={form.meal} onChange={e=>setForm({...form,meal:e.target.value})}>{["Breakfast","Lunch","Dinner","Snacks"].map(x=><option key={x}>{x}</option>)}</select><input className="field" inputMode="numeric" placeholder="kcal" value={form.calories} onChange={e=>setForm({...form,calories:e.target.value})}/><input className="field" inputMode="numeric" placeholder="protein g" value={form.protein} onChange={e=>setForm({...form,protein:e.target.value})}/><button className="small-btn" disabled={saving}>Add</button></form></section>
        <section className="card"><span className="eyebrow">Quick add</span><h2 style={{color:"var(--forest)"}}>Familiar foods</h2><div className="stats">{suggested.slice(0,3).map(f=><button key={f.name} className="stat" style={{textAlign:"left",border:"1px solid var(--line)"}} onClick={()=>addSuggested(f)}><span className="tag">{f.meal}</span><strong style={{fontSize:"1rem",marginTop:12}}>{f.name}</strong><small className="fine">{f.calories} kcal · curated estimate</small></button>)}</div></section>
      </div><aside style={{display:"grid",gap:18,alignContent:"start"}}>
        <section className="card"><Droplets color="#5b9189"/><h2 style={{color:"var(--forest)"}}>Hydration</h2><p className="fine">{water} of {p.waterTarget} glasses today</p><div className="water">{Array.from({length:p.waterTarget}).map((_,i)=><span key={i} className={`drop ${i<water?"on":""}`}/>)}</div><button className="small-btn" onClick={()=>void post({type:"water",glasses:water+1})}>Add a glass</button></section>
        <section className="card"><Sparkles color="var(--peach)"/><h2 style={{color:"var(--forest)"}}>Daily insight</h2><p className="fine">{entries.length===0?"Start with your next meal—there’s no need to reconstruct the whole day.":totals.protein<p.proteinTarget*.5?"You’re building today’s log. A protein-rich addition could bring more balance to your next meal.":"Your protein intake is progressing steadily toward today’s target."}</p></section>
        <section className="card"><span className="eyebrow">Weekly overview</span><div className="chart">{weekly.map((h,i)=><div key={i} className="bar" style={{height:`${h}%`}} title={`${["M","T","W","T","F","S","S"][i]}: illustrative trend`}/>)}</div><div style={{display:"flex",justifyContent:"space-between"}}>{["M","T","W","T","F","S","S"].map((d,i)=><small className="fine" key={i}>{d}</small>)}</div><p className="fine">Illustrative until seven days of entries are available.</p></section>
        <section className="card"><span className="eyebrow">Your meal plan</span><h2 style={{color:"var(--forest)"}}>{p.diet} · {p.cuisine}</h2><p className="fine">Paneer harvest bowl with brown rice, roasted greens and mint curd.</p><button className="ghost-btn" onClick={()=>addSuggested(suggested[2])}>Add dinner to diary</button></section>
      </aside></div>}
    </main>
    {!loading&&!p.onboardingComplete&&<div className="onboard"><div className="on-card"><div className="progress"><i style={{width:`${(step+1)*25}%`}}/></div><span className="eyebrow" style={{display:"block",marginTop:24}}>Step {step+1} of 4</span><h2 className="display" style={{fontSize:"2.8rem",color:"var(--forest)",margin:"10px 0"}}>{["What should we call you?","What would you like to work toward?","Which way of eating fits you?","What food feels most familiar?"][step]}</h2>{step===0?<input className="field" value={setup.displayName} onChange={e=>setSetup({...setup,displayName:e.target.value})}/>:<div className="choices">{(step===1?["Maintain weight","Lose weight gently","Build muscle","General healthy eating"]:step===2?["Vegetarian","Non-vegetarian","Vegan","Eggetarian"]:["Indian","Mediterranean","Asian","Mixed cuisine"]).map(x=><button className={`choice ${Object.values(setup).includes(x)?"selected":""}`} key={x} onClick={()=>setSetup({...setup,[step===1?"goal":step===2?"diet":"cuisine"]:x})}>{x}</button>)}</div>}<p className="fine">Estimates are for general wellness, not medical care. Significant allergies or medical dietary needs should be reviewed with a qualified professional.</p><div className="actions" style={{justifyContent:"space-between"}}><button className="pill pill-light" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>Back</button>{step<3?<button className="pill pill-dark" onClick={()=>setStep(step+1)}>Continue</button>:<button className="pill pill-dark" onClick={()=>void post({type:"profile",...setup})}>{saving?"Creating…":"Create my plan"}</button>}</div></div></div>}
  </div>;
}
