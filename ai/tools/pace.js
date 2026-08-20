#!/usr/bin/env node
/* ============================================================
   The pace map — where a run goes quiet.

   `sim.js` answers "how long is an act". This answers the other
   question, the one behind *"it's still kinda boring at some point"*:
   **how often does anything happen, and how much is there to decide?**

   Direction line 2 says there must always be something to do, decide
   or understand. So the run is scored a minute at a time on two counts:

     beats   — things that happened *at* the player: a logbook line, a
               panel revealed, a recipe unlocked, a purchase, the
               objective changing, an act turning over.
     choices — how many different things the player could afford to buy
               at that moment. One affordable thing is not a decision,
               it is a queue.

   A minute with no beats is a minute of watching a number. A stretch
   of them is the thing the PO felt.

     node ai/tools/pace.js           — the map
     node ai/tools/pace.js --quiet   — only the dead stretches
     node ai/tools/pace.js --idle    — the same run, put down after 6 min
   ============================================================ */
'use strict';
const {loadGame}=require('./domstub.js');
const {makePlayer}=require('./player.js');

const DT=0.5, MAX_HOURS=6, DEAD=90;   /* seconds with no beat before it counts as dead */
const args=process.argv.slice(2);
const QUIET=args.includes('--quiet');
const IDLE=args.includes('--idle');
const STYLE=args.includes('--maker')?'maker':args.includes('--store')?'store':null;

function hms(sec){
  const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,x=Math.floor(sec)%60;
  return (h?h+'h':'')+String(m).padStart(h?2:1,'0')+'m'+String(x).padStart(2,'0')+'s';
}

const g=loadGame();
const s=()=>g.game.s;
const P=makePlayer(g,{idle:IDLE});

/* ---- beats -------------------------------------------------------- */
/* note() and show() are global function declarations inside the game's
   context, so wrapping them here catches every call the game makes. */
let beats=[];                            /* {t,kind} */
function beat(t,kind){ beats.push({t,kind}); }

let now=0;
const rawNote=g.note, rawShow=g.show;
g.note=function(text,kind){ beat(now,'log'); return rawNote.apply(null,arguments) };
g.show=function(id,msg){ beat(now,'reveal'); return rawShow.apply(null,arguments) };

/* ---- what is on the table right now ------------------------------- */
function choices(){
  const st=s(); let n=0;
  const can=c=>isFinite(c)&&c>0&&st.cash>=c;
  const canJ=c=>isFinite(c)&&c>0&&st.jars>=c;
  if(st.act===1){
    if(can(st.cratePrice))n++;
    if(can(g.spoonCost(st.spoons)))n++;
    if(st.recipes.geometry&&can(g.worksCost(st.works)))n++;
    if(st.recipes.window&&can(g.mktCost()))n++;
    if(st.autoSell&&can(g.sellerCost()))n++;
    if(st.autoSell&&st.sellers>=4&&can(g.shopCost()))n++;
  } else if(st.act===2){
    if(canJ(g.pickerCost(st.pickers)))n++;
    if(canJ(g.presserCost(st.pressers)))n++;
    if(canJ(g.lineCost(st.lines)))n++;
    if(canJ(g.sunCost(st.sun)))n++;
    if(st.sun>=1&&canJ(g.battCost(st.batt)))n++;
    if(canJ(g.vatCost(st.vats||0)))n++;
  } else {
    if(canJ(g.sporeCost()))n++;
  }
  for(const r of g.game.R){
    if(st.recipes[r.id]||r.act!==st.act)continue;
    let open=false; try{open=r.when()}catch(e){}
    if(open&&g.canAfford(r))n++;
  }
  return n;
}

/* ---- run ---------------------------------------------------------- */
const minutes=[];                        /* one row a minute */
let t=0,lastAct=1,priceAt=0,spendAt=0,bucket=0,choiceSum=0,choiceN=0,choiceMax=0;
let objText='';

function objNow(){
  try{ const o=g.objective(); return typeof o==='string'?o:(o&&o.en)||''; }catch(e){ return '' }
}

while(t<MAX_HOURS*3600&&!s().ended){
  now=t;
  const reprice=(t-priceAt>=15); if(reprice)priceAt=t;
  const spend=(t-spendAt>=1); if(spend)spendAt=t;
  const ev=P.step(t,DT,{repriceNow:reprice,spendNow:spend,style:STYLE});
  if(ev.bought)beat(t,'buy');
  for(const r of ev.recipes)beat(t,'recipe');

  const st=s();
  if(st.act!==lastAct){ beat(t,'act'); lastAct=st.act; }
  const o=objNow();
  if(o&&o!==objText){ if(objText)beat(t,'goal'); objText=o; }

  const c=choices(); choiceSum+=c; choiceN++; if(c>choiceMax)choiceMax=c;

  t+=DT;
  if(t-bucket>=60){
    minutes.push({at:bucket,act:st.act,avg:choiceSum/choiceN,max:choiceMax,
                  beats:beats.filter(b=>b.t>=bucket&&b.t<t)});
    bucket=t; choiceSum=0; choiceN=0; choiceMax=0;
  }
}

/* ---- dead stretches ----------------------------------------------- */
const dead=[];
let prev=0;
for(const b of beats){
  if(b.t-prev>=DEAD)dead.push([prev,b.t]);
  prev=b.t;
}
if(t-prev>=DEAD)dead.push([prev,t]);

/* ---- report -------------------------------------------------------- */
const GLYPH={log:'·',reveal:'*',recipe:'R',buy:'+',goal:'>',act:'#'};
console.log('\nPACE MAP'+(IDLE?'  ·  put down after 6 min':'')+(STYLE?'  ·  house: '+STYLE:'')+
            '\n  beats: + buy  R recipe  · logbook  * reveal  > objective  # act\n');
if(!QUIET){
  for(const m of minutes){
    const line=m.beats.map(b=>GLYPH[b.kind]||'?').join('');
    console.log('  '+hms(m.at).padStart(8)+'  '+('I'.repeat(m.act)).padEnd(3)+
                String(m.beats.length).padStart(3)+'  '+
                ('choice '+m.avg.toFixed(1)+'/'+m.max).padEnd(14)+
                (line.length>48?line.slice(0,48)+'…':line));
  }
}
const perAct={};
for(const m of minutes){ const a=perAct[m.act]||(perAct[m.act]={min:0,beats:0,ch:0});
  a.min++; a.beats+=m.beats.length; a.ch+=m.avg; }
console.log('\n  per act        minutes   beats/min   choices');
for(const k of Object.keys(perAct)){ const a=perAct[k];
  console.log('    Act '+('I'.repeat(k)).padEnd(4)+String(a.min).padStart(8)+
              (a.beats/a.min).toFixed(1).padStart(12)+(a.ch/a.min).toFixed(1).padStart(10)); }

console.log('\n  dead stretches (nothing happened for '+DEAD+'s or more)');
if(!dead.length)console.log('    none');
for(const [a,b] of dead.sort((x,y)=>(y[1]-y[0])-(x[1]-x[0])).slice(0,12))
  console.log('    '+hms(a).padStart(8)+' → '+hms(b).padStart(8)+'   '+hms(b-a));
console.log('');
