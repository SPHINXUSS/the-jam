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
/* the house style is a permanent fork; both branches have to be viable,
   which is only checkable by playing both */
const STYLE=args.includes('--maker')?'maker':args.includes('--store')?'store':null;

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

const {makePlayer}=require('./player.js');
const P=makePlayer(g,{idle:IDLE});

/* ---- run ---------------------------------------------------------- */
const marks=[];
function mark(label,t){ marks.push([label,t]); }
let t=0, lastAct=1, lastTrace=0, priceAt=0, spendAt=0;
mark('Act I opens',0);

while(t<MAX_HOURS*3600&&!s().ended){
  const reprice=(t-priceAt>=15); if(reprice)priceAt=t;
  const spend=(t-spendAt>=1); if(spend)spendAt=t;
  P.step(t,DT,{repriceNow:reprice,spendNow:spend,style:STYLE});
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

console.log('\n'+(IDLE?'IDLE RUN (stops after 6 min)':'ACTIVE RUN')+
  (STYLE?'  ·  house: '+STYLE:'  ·  house: none chosen')+'\n');
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
