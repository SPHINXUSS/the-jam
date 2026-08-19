#!/usr/bin/env node
/* ============================================================
   Balance simulator.

   The PO asked for the maths to be worked rather than guessed. This
   plays the real game — engine.js and ui.js loaded unmodified through
   a stub DOM — with a policy that stands in for a reasonably attentive
   player, and reports how long each act takes and where it stalls.

     node ai/tools/sim.js            — one run, milestone table
     node ai/tools/sim.js --trace    — a line a minute
     node ai/tools/sim.js --idle     — the same run without manual play

   It is a model, not a playtest. It says whether an act is minutes or
   hours long; it does not say whether it is fun.
   ============================================================ */
'use strict';
const {loadGame}=require('./domstub.js');

const DT=0.5;                       /* simulated seconds per step */
const MAX_HOURS=6;
const args=process.argv.slice(2);
const TRACE=args.includes('--trace');
const IDLE=args.includes('--idle');

function hms(sec){
  const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,s=Math.floor(sec)%60;
  return (h?h+'h':'')+String(m).padStart(h?2:1,'0')+'m'+String(s).padStart(2,'0')+'s';
}
function num(n){
  if(!isFinite(n))return '∞';
  if(n<1000)return n.toFixed(0);
  if(n<1e6)return (n/1e3).toFixed(1)+'k';
  if(n<1e9)return (n/1e6).toFixed(1)+'M';
  if(n<1e12)return (n/1e9).toFixed(1)+'G';
  return n.toExponential(2);
}

const g=loadGame();
const s=()=>g.game.s;
const R=()=>g.game.R;

/* ---- the player -------------------------------------------------- */
/* clicks per simulated second: brisk at the start, then the player
   settles back and mostly watches, which is how these games are played */
function clickRate(t){ if(IDLE)return 0; return t<300?3:t<1200?1:0.25; }

function margin(){ return Math.max(0.01,s().price-g.sugarCostPerJar()); }

/* pick the price that earns most, given what we can actually make and move */
function bestPrice(){
  const st=s(), keep=st.price;
  let best=keep,bestRev=-1;
  for(let p=1.20;p<=12.0001;p+=0.10){
    st.price=Math.round(p*100)/100;
    st.sugar=Math.round(g.sugarPeak());
    const moving=Math.min(g.autoPerSec()+2,g.demand());
    const rev=moving*(st.price-g.sugarCostPerJar());
    if(rev>bestRev){bestRev=rev;best=st.price}
  }
  st.price=best; st.sugar=Math.round(g.sugarPeak());
  return best;
}

function buyRecipes(){
  let bought=0;
  for(const r of R()){
    const st=s();
    if(st.recipes[r.id]||r.act!==st.act)continue;
    let open=false; try{open=r.when()}catch(e){}
    if(!open||!g.canAfford(r))continue;
    g.buyRecipe(r.id); bought++;
  }
  return bought;
}

/* value per dollar of the next purchase, so the money goes somewhere sane */
/* taste is the only currency with a real fork in it: rate or ceiling.
   Spend it on the one that is actually binding. */
function spendTaste(){
  const st=s();
  while(st.taste>0){
    if(st.insp>=g.inspMax()*0.9)st.cellars++; else st.ovens++;
    st.taste--;
  }
}

function actOneSpend(){
  const st=s();
  const reserve=st.cratePrice*4;
  const cash=st.cash-reserve;
  if(cash<=0)return;
  const m=margin(), want=g.demand(), make=g.autoPerSec();
  const opts=[];
  const headroom=Math.max(0,want-make);
  opts.push({k:'spoon',c:g.spoonCost(st.spoons),v:Math.min(0.85*st.spoonPower,headroom||0.85*st.spoonPower)*m});
  if(st.recipes.geometry)
    opts.push({k:'works',c:g.worksCost(st.works),v:Math.min(120*st.worksPower,headroom||120*st.worksPower)*m});
  if(st.recipes.window){
    const before=g.demand(); st.mkt++; const after=g.demand(); st.mkt--;
    opts.push({k:'mkt',c:g.mktCost(),v:(after-before)*g.reachShare()*m});
  }
  if(st.autoSell){
    opts.push({k:'seller',c:g.sellerCost(),v:Math.min(0.055,1-g.reachShare())*want*m});
    if(st.sellers>=4)opts.push({k:'shop',c:g.shopCost(),v:Math.min(0.16,1-g.reachShare())*want*m});
  }
  opts.sort((a,b)=>(b.v/b.c)-(a.v/a.c));
  for(const o of opts){
    if(o.v<=0||o.c>cash)continue;
    if(o.k==='spoon'){st.cash-=o.c;st.spoons++}
    else if(o.k==='works'){st.cash-=o.c;st.works++}
    else if(o.k==='mkt'){st.cash-=o.c;st.mkt++}
    else if(o.k==='seller'){st.cash-=o.c;st.sellers++}
    else if(o.k==='shop'){st.cash-=o.c;st.shops++}
    return;
  }
}

function actTwoSpend(){
  const st=s();
  /* power first: a brownout costs more than anything it would have bought */
  if(g.powDraw()>g.powSupply()*0.75&&st.jars>=g.sunCost(st.sun)){ st.jars-=g.sunCost(st.sun);st.sun++;return }
  if(st.sun>=2&&g.powStore()<g.powDraw()*70&&st.jars>=g.battCost(st.batt)){ st.jars-=g.battCost(st.batt);st.batt++;return }
  if((st.spoilRate||0)>(st.orate||0)*0.2&&st.jars>=g.vatCost(st.vats||0)){ st.jars-=g.vatCost(st.vats||0);st.vats=(st.vats||0)+1;return }
  /* then whichever stage is holding the other two up */
  const b=g.bottleneck();
  if(b==='nothing built'||b==='picking'){ if(st.jars>=g.pickerCost(st.pickers)){st.jars-=g.pickerCost(st.pickers);st.pickers++} return }
  if(b==='setting'){ if(st.jars>=g.presserCost(st.pressers)){st.jars-=g.presserCost(st.pressers);st.pressers++} return }
  if(st.jars>=g.lineCost(st.lines)){st.jars-=g.lineCost(st.lines);st.lines++}
}

function actThreeSpend(){
  const st=s();
  while(st.jars>=g.sporeCost()*2){ const c=g.sporeCost(); st.jars-=c; st.spores++; st.launched++; }
}

/* ---- run ---------------------------------------------------------- */
const marks=[];
function mark(label,t){ marks.push([label,t]); }
let t=0, lastAct=1, lastTrace=0, priceAt=0, spendAt=0;
mark('Act I opens',0);

while(t<MAX_HOURS*3600&&!s().ended){
  const st=s();
  if(st.act===1){
    const cr=clickRate(t)*DT;
    for(let i=0;i<Math.floor(cr);i++){ g.stir(); if(g.atTheDoor()>=1&&st.jars>=1)g.sellByHand(); }
    if(st.fruit<st.crate*0.35&&st.cash>=st.cratePrice)g.buyFruit();
    if(t-priceAt>=15){ priceAt=t; bestPrice(); }
  }
  g.tick(DT);
  if(t-spendAt>=1){
    spendAt=t;
    spendTaste();
    buyRecipes();
    if(st.act===1)actOneSpend(); else if(st.act===2)actTwoSpend(); else actThreeSpend();
  }
  t+=DT;

  const now=s();
  if(now.act!==lastAct){ mark('Act '+(now.act===2?'II':'III')+' opens',t); lastAct=now.act; }
  if(TRACE&&t-lastTrace>=60){
    lastTrace=t;
    if(now.act===1)console.log(hms(t),'| I  made',num(now.made),'cash',num(now.cash),'$'+now.price.toFixed(2),
      'sug',Math.round(now.sugar),'make',g.autoPerSec().toFixed(1),'want',g.demand().toFixed(1),
      'reach',(g.reachShare()*100).toFixed(0)+'%','insp',num(now.insp));
    else if(now.act===2)console.log(hms(t),'| II converted',(g.converted2()*100).toFixed(2)+'%',
      'P/S/L',now.pickers+'/'+now.pressers+'/'+now.lines,'sun',now.sun,'vat',now.vats||0,
      'jars',num(now.jars),'rate',num(now.orate||0),'spoil',num(now.spoilRate||0),'insp',num(now.insp));
    else console.log(hms(t),'| III converted',(now.converted*100).toFixed(3)+'%','spores',num(now.spores),
      'explored',(now.explored*100).toFixed(1)+'%','insp',num(now.insp));
  }
}
if(s().ended)mark('The Last Jar',t); else mark('gave up at',t);

console.log('\n'+(IDLE?'IDLE RUN (no manual play)':'ACTIVE RUN')+'\n');
let prev=0;
for(const [label,at] of marks){
  console.log('  '+hms(at).padStart(9)+'  '+label+(at>prev?'   (+'+hms(at-prev)+')':''));
  prev=at;
}
const f=s();
console.log('\n  jars made      '+num(f.made));
console.log('  recipes bought '+Object.keys(f.recipes).length+' of '+R().length);
console.log('  act I end      spoons '+f.spoons+', works '+f.works+', mkt '+f.mkt+', sellers '+f.sellers+', shops '+f.shops);
console.log('  act II end     P/S/L '+f.pickers+'/'+f.pressers+'/'+f.lines+', sun '+f.sun+', vats '+(f.vats||0)+', spoiled '+num(f.spoiled));
