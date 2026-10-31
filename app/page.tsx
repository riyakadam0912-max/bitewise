import { ArrowRight, Check, Leaf, Sparkles } from "lucide-react";
import { getChatGPTUser } from "./chatgpt-auth";

const faqs = [
  ["How does BiteWise calculate my daily target?", "We use your profile, activity level, and goal to estimate daily energy needs with established formulas. Every result is an approximation that you can review."],
  ["Can I get vegetarian or non-vegetarian plans?", "Yes. Plans adapt to vegetarian, vegan, eggetarian, pescatarian, non-vegetarian, and flexible preferences."],
  ["Can I track homemade Indian food?", "Yes. BiteWise includes familiar foods such as roti, dal, poha, idli, paneer, rice, and mixed dishes. Homemade values are clearly marked as estimates."],
  ["Are calorie values exact?", "No. Values vary by ingredients, portions, brands, and preparation. BiteWise shows serving sizes and identifies estimated entries."],
  ["Does BiteWise account for allergies?", "Declared allergies are treated as strict exclusions from generated recommendations. Significant medical needs should be reviewed with a qualified professional."],
  ["Is BiteWise a replacement for a nutritionist?", "No. BiteWise supports everyday awareness and planning; it does not diagnose conditions or replace individualized medical care."],
];

export default async function Home() {
  const user = await getChatGPTUser();
  const appHref = "/dashboard";
  return <>
    <nav className="nav"><div className="shell nav-in">
      <a className="brand" href="#top"><span className="mark"/>BiteWise</a>
      <div className="links"><a href="#how">How it works</a><a href="#experience">Features</a><a href="#plans">Meal plans</a><a href="#about">About</a></div>
      <a className="pill pill-dark" href={appHref} target="_top">{user ? "Open dashboard" : "Get my plan"}<ArrowRight size={15}/></a>
    </div></nav>
    <main id="top">
      <section className="hero"><div className="shell hero-grid">
        <div><div className="eyebrow">Personal nutrition, thoughtfully simplified</div>
          <h1 className="display">Your nutrition.<br/>Your goals.<br/><em>Your way.</em></h1>
          <p className="lead">Track your calories, understand your nutritional needs, and get practical meal plans designed around your goals, lifestyle, and food preferences.</p>
          <div className="actions"><a href={appHref} target="_top" className="pill pill-dark">Create my BiteWise plan <ArrowRight size={16}/></a><a href="#how" className="pill pill-light">Explore how it works</a></div>
          <div className="trust"><div className="avatars"><span/><span/><span/></div>Personalized nutrition made simpler, one meal at a time.</div>
        </div>
        <div className="visual" aria-label="Illustrative BiteWise dashboard preview"><div className="food-orb"/>
          <div className="dash-card calorie-card"><div style={{display:"flex",gap:16,alignItems:"center"}}><div className="ring"><b>62%</b></div><div><span className="eyebrow">Today</span><strong style={{display:"block",fontSize:22,color:"var(--forest)"}}>1,248 kcal</strong><small className="fine">of 2,000 kcal · illustrative</small></div></div></div>
          <div className="dash-card meal-card"><span className="tag">Personalized plan</span><h3 style={{marginBottom:6}}>Paneer harvest bowl</h3><p className="fine">Brown rice · roasted greens · mint curd</p><div className="macro"><i style={{width:"74%",background:"var(--sage)"}}/></div></div>
        </div>
      </div></section>
      <section id="how" className="section white"><div className="shell">
        <div className="section-head"><div><span className="eyebrow">Designed around real life</span><h2 className="display">A calmer way to eat with intention.</h2></div><p>No punishment, no impossible rules. BiteWise turns your routines and preferences into practical guidance you can actually use.</p></div>
        <div className="steps">{[
          ["01","Share your rhythm","Tell us about your lifestyle, familiar foods, dietary preferences, allergies, and goals."],
          ["02","See your personal range","Receive transparent calorie and macro estimates with clear assumptions and sensible safeguards."],
          ["03","Adapt one meal at a time","Log what you eat, swap suggestions, and watch your plan evolve with your day."],
        ].map(([n,h,p])=><article className="step" key={n}><div className="step-no">{n}</div><h3>{h}</h3><p>{p}</p></article>)}</div>
      </div></section>
      <section id="experience" className="section"><div className="shell product">
        <div className="quote-panel"><Leaf/><h3 className="display">Progress should feel like awareness, not judgment.</h3><p style={{color:"#c9d7ce",lineHeight:1.7}}>Supportive insights respond to what you log. They never label food as “good” or “bad,” and they never celebrate undereating.</p></div>
        <div className="app-preview"><aside className="mini-side"><div className="brand" style={{color:"white"}}><span className="mark" style={{borderColor:"white"}}/>BiteWise</div><div style={{marginTop:45}}>● Overview</div><div>○ Food diary</div><div>○ Meal plans</div><div>○ Progress</div><div>○ Profile</div></aside>
          <div className="mini-main"><div><span className="eyebrow">Good morning</span><h2 style={{margin:"5px 0",color:"var(--forest)"}}>Let’s make today balanced.</h2></div><div className="stats"><div className="stat"><small className="fine">Remaining</small><b>752</b><small>kcal</small></div><div className="stat"><small className="fine">Protein</small><b>68g</b><small>of 105g</small></div><div className="stat"><small className="fine">Water</small><b>5</b><small>of 8 glasses</small></div></div>{["Breakfast · Vegetable poha","Lunch · Dal, rice & cucumber","Dinner · Not logged yet"].map((m,i)=><div className="meal-row" key={m}><div style={{display:"flex",gap:12,alignItems:"center"}}><span className="dot"/><div><strong>{m}</strong><div className="fine">{i===0?"385 kcal":i===1?"612 kcal":"Add when you’re ready"}</div></div></div><span>{i<2?<Check size={18}/>:"+"}</span></div>)}</div>
        </div>
      </div></section>
      <section id="plans" className="section white"><div className="shell"><div className="section-head"><div><span className="eyebrow">Food that feels familiar</span><h2 className="display">Personal, practical, and made to flex.</h2></div><p>Suggestions respect your cuisine, dietary pattern, exclusions, available time, and preferred number of meals.</p></div>
        <div className="plans">{[
          ["Indian vegetarian","Poha, dal, roti, paneer, seasonal vegetables and fruit."],
          ["Plant-forward vegan","Whole grains, lentils, tofu, legumes, nuts and abundant produce."],
          ["Everyday high-protein","Eggs, chicken or fish with rice, vegetables, curd and balanced snacks."],
        ].map(([h,p],i)=><article className="plan" key={h}><div className="plan-img" style={{filter:`hue-rotate(${i*22}deg)`}}/><h3>{h}</h3><p className="fine">{p}</p><span className="tag">Illustrative meal pattern</span></article>)}</div>
      </div></section>
      <section id="about" className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Our point of view</span><h2 className="display">Nutrition that fits your life.</h2></div><p>Everyone has different routines, food preferences, and goals. BiteWise brings thoughtful tracking and meal planning into one simple experience—without unnecessary complexity.</p></div><div className="steps">{["Personalized to you","Simple to follow","Built around sustainable habits"].map((x)=><div className="step" key={x}><Sparkles size={22}/><h3>{x}</h3><p>Useful guidance that adapts to your context while keeping estimates, assumptions, and safety boundaries clear.</p></div>)}</div></div></section>
      <section className="section white"><div className="shell faq"><div className="section-head"><div><span className="eyebrow">A little clarity</span><h2 className="display">Questions, answered.</h2></div></div>{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
      <section className="section"><div className="shell cta"><span className="eyebrow" style={{color:"#b7c8bc"}}>Start where you are</span><h2 className="display">Make your next meal a little more informed.</h2><a href={appHref} target="_top" className="pill" style={{background:"var(--peach)",color:"var(--forest)"}}>Create my personalized plan <ArrowRight size={16}/></a></div></section>
    </main>
    <footer className="shell footer"><div><span className="brand"><span className="mark"/>BiteWise</span><p>Eat Smart. Live Better.</p></div><p>Nutrition values and energy needs are estimates, not medical advice.<br/>© 2026 BiteWise · Privacy · Terms · Data controls</p></footer>
  </>;
}
