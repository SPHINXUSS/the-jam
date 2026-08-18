(function(){
  'use strict';
  if(window.__JAM_SYSTEMS_V3__) return;
  window.__JAM_SYSTEMS_V3__=true;

  /* Economy / pacing pass. Claude's game.html remains untouched. */
  s.marketSize=Number.isFinite(s.marketSize)?s.marketSize:Math.min(6,1+Math.max(0,(s.mkt||1)-1)*0.32);
  if(!s.jamV3Economy){
    if(s.act===1&&s.made<1000){
      if(s.price<1)s.price=3.2;
      if(s.crate===500&&s.cratePrice<=20){s.crate=200;s.cratePrice=30}
    }
    s.jamV3Economy=true;
  }

  function priceDemand(){
    const p=Math.max(1.8,Math.min(12,Number(s.price)||3.2));
    const market=Math.max(1,Math.min(10,Number(s.marketSize)||1));
    const style=s.style||'neutral';
    const e=style==='maker'?0.66:style==='store'?0.82:0.72;
    const base=style==='maker'?0.78:style==='store'?0.92:0.84;
    let wanted=base*market*Math.pow(3.2/p,e);
    if(p>5.8){const d=p-5.8;wanted*=Math.exp(-(d*d)/4.2)}
    return clamp(wanted,0.03,24);
  }
  demand=priceDemand;sellPerSec=priceDemand;

  spoonCost=n=>18*Math.pow(1.16,n);
  worksCost=n=>900*Math.pow(1.08,n);
  autoPerSec=()=>((s.spoons||0)*(s.spoonPower||1)*0.85)+((s.works||0)*60*(s.worksPower||1));

  const rmap={};R.forEach(r=>rmap[r.id]=r);
  if(rmap.mech){rmap.mech.i=120;rmap.mech.when=()=>s.made>=80}
  if(rmap.imp1){rmap.imp1.i=1800;rmap.imp1.when=()=>s.recipes.mech&&s.spoons>=4}
  if(rmap.imp2){rmap.imp2.i=4800;rmap.imp2.when=()=>s.recipes.imp1&&s.spoons>=9}
  if(rmap.imp3){rmap.imp3.i=11000;rmap.imp3.when=()=>s.recipes.imp2&&s.spoons>=15}
  if(rmap.geometry){rmap.geometry.i=9000;rmap.geometry.when=()=>s.made>=200000;rmap.geometry.desc='A jar that stacks against itself without a gap. Unlocks jamworks — 60 jars a second apiece.'}
  if(rmap.works2){rmap.works2.i=15000;rmap.works2.when=()=>s.recipes.geometry&&s.works>=2;rmap.works2.desc='Improved setting geometry. Jamworks output increases by 50%.'}
  if(rmap.works3){rmap.works3.i=30000;rmap.works3.when=()=>s.recipes.works2&&s.works>=5;rmap.works3.desc='Continuous setting. Jamworks output doubles.'}
  if(rmap.hadwiger){rmap.hadwiger.i=30000;rmap.hadwiger.when=()=>s.recipes.imp3&&s.spoons>=25;rmap.hadwiger.desc='A packing problem solved by a man who never made jam. Autospoons quadruple.'}

  if(document.getElementById('buyMkt')){
    const old=document.getElementById('buyMkt').onclick;
    document.getElementById('buyMkt').onclick=()=>{
      const before=s.mkt||1;
      if(typeof old==='function')old();
      if((s.mkt||1)>before){s.marketSize=clamp(1+(s.mkt-1)*0.32,1,10);toast('Wanted demand: '+rate(demand())+' /sec');save()}
    };
  }

  const priceStep=()=>s.price<5?.1:.25;
  if(document.getElementById('priceUp'))document.getElementById('priceUp').onclick=()=>{s.price=Math.min(12,Math.round((s.price+priceStep())*100)/100)};
  if(document.getElementById('priceDown'))document.getElementById('priceDown').onclick=()=>{s.price=Math.max(1.8,Math.round((s.price-priceStep())*100)/100)};

  let tastingBusyUntil=0;
  function runTournamentV3(){
    const now=Date.now(),runs=s.tour?.runs||0,cost=850+runs*250;
    if(now<tastingBusyUntil){toast('The panel is still discussing the last batch.');return}
    if(s.insp<cost){toast('Needs '+fmt(cost)+' inspiration.');return}
    s.insp-=cost;tastingBusyUntil=now+12000;
    const pay=[[Math.floor(Math.random()*7),Math.floor(Math.random()*7)],[Math.floor(Math.random()*7),Math.floor(Math.random()*7)]];
    const n=Math.max(2,Math.min(s.tour.unlocked||2,STRATS.length)),score=new Array(n).fill(0);
    for(let a=0;a<n;a++)for(let b=0;b<n;b++){
      if(a===b)continue;
      const ha=[],hb=[];
      for(let r=0;r<12;r++){
        const ma=STRATS[a].f(hb,r,pay),trans=[[pay[0][0],pay[1][0]],[pay[0][1],pay[1][1]]],mb=STRATS[b].f(ha,r,trans);
        score[a]+=pay[ma][mb];score[b]+=pay[mb][ma];ha.push(ma);hb.push(mb);
      }
    }
    const noisy=score.map((v,i)=>({i,v:v+(Math.random()*36-18)})).sort((a,b)=>b.v-a.v);
    s.tour.grid=pay;s.tour.rank=noisy;s.tour.runs++;
    const place=noisy.findIndex(o=>o.i===s.tour.strat),rewards=[700,460,300,180,100],gain=rewards[Math.min(rewards.length-1,Math.max(0,place))];
    s.insp=clamp(s.insp+gain,0,inspMax());s.tour.won+=gain;
    if(place===0){s.crea+=2;note('Your palate took the panel. +'+fmt(gain)+' inspiration, +2 creativity.','hi')}
    else note('Panel '+s.tour.runs+': you placed '+(place+1)+'. +'+fmt(gain)+' inspiration.','dim');
    save();
    if(typeof drawTournament==='function')drawTournament();
  }
  if(document.getElementById('tRun'))document.getElementById('tRun').onclick=runTournamentV3;

  const originalInitChips=initChips;
  initChips=function(n){
    originalInitChips(n);
    if(Array.isArray(s.chips)&&s.chips.length)s.chips.forEach((c,i)=>{c.p=4.4+i*1.35+Math.random()*0.7;c.o=(Math.PI*2*i/s.chips.length)+(Math.random()-0.5)*0.5});
  };
  let cultureBusyUntil=0;
  function readCultureV3(){
    const now=performance.now();
    if(now<cultureBusyUntil){toast('The culture needs a moment to settle.');return}
    cultureBusyUntil=now+380;
    const vals=chipValues(now/1000),positive=vals.filter(v=>v>0),coherence=positive.length/Math.max(1,vals.length),sum=positive.reduce((a,b)=>a+b,0);
    let gain=0;
    if(coherence>=0.4)gain=Math.min(180,Math.round(sum*52*(0.65+coherence)));
    else if(coherence<=0.2)gain=-Math.min(20,Math.floor(s.insp*0.01));
    s.insp=clamp(s.insp+gain,0,inspMax());
    toast(gain>0?'+'+fmt(gain)+' inspiration':gain<0?fmt(gain)+' inspiration':'No useful reading');save();
  }
  if(document.getElementById('readCulture'))document.getElementById('readCulture').onclick=readCultureV3;

  const baseRenderV3=render;
  render=function(dt){
    baseRenderV3(dt);
    if(s.tour&&s.tour.on){
      const t=document.getElementById('tRun');
      if(t){const cost=850+(s.tour.runs||0)*250,wait=Math.max(0,tastingBusyUntil-Date.now());t.disabled=wait>0||s.insp<cost;t.textContent=wait>0?'Tasting panel · '+Math.ceil(wait/1000)+'s':'Run tasting · '+fmt(cost)+' insp'}
    }
  };
  save();
})();
