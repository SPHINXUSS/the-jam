/* ============================================================
   THE JAM — state, economy, recipes, acts
   No DOM rendering lives here.
   ============================================================ */
/* ============================================================
   THE JAM
   An incremental game in three acts.
   ============================================================ */
'use strict';

/* ---------- storage that degrades gracefully ---------- */
const store=(function(){
  let ok=false;
  try{const k='__jam';localStorage.setItem(k,'1');localStorage.removeItem(k);ok=true}catch(e){ok=false}
  const mem={};
  return{
    ok,
    get(k){try{return ok?localStorage.getItem(k):(mem[k]??null)}catch(e){return mem[k]??null}},
    set(k,v){try{ok?localStorage.setItem(k,v):(mem[k]=v)}catch(e){mem[k]=v}},
    del(k){try{ok?localStorage.removeItem(k):delete mem[k]}catch(e){delete mem[k]}}
  };
})();
const KEY='the-jam-v1';

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
/* English uses the short scale, French the long one, so English "billion"
   is French "milliard" and English "trillion" is French "billion".
   Translating the words one for one would be wrong by a factor of a
   thousand, which is why they live here and not in DICT. */
const SCALES=[1e6,1e9,1e12,1e15,1e18,1e21,1e24,1e27];
const SCALE_WORDS={
  en:['million','billion','trillion','quadrillion','quintillion','sextillion','septillion','octillion'],
  fr:['million','milliard','billion','billiard','trillion','trilliard','quadrillion','quadrilliard']
};
/* short tags, for readouts in boxes too narrow for a whole word */
const SCALE_TAGS=['M','G','T','P','E','Z','Y','R'];
function locale(){ return LANG==='fr'?'fr-FR':'en-US'; }
function dec(v,d){ return v.toLocaleString(locale(),{minimumFractionDigits:d,maximumFractionDigits:d}); }

function fmt(n){
  if(!isFinite(n))return '∞';
  if(n<0)return '−'+fmt(-n);
  if(n<1000)return String(Math.floor(n));
  if(n<1e6)return Math.floor(n).toLocaleString(locale());
  const words=SCALE_WORDS[LANG]||SCALE_WORDS.en;
  for(let i=SCALES.length-1;i>=0;i--){
    if(n>=SCALES[i]&&(i===SCALES.length-1||n<SCALES[i+1])){
      const v=n/SCALES[i];
      return dec(v,v<10?3:v<100?2:1)+' '+words[i];
    }
  }
  return n.toExponential(3);
}
/* compact form: the pipeline boxes are too narrow for "1.234 quadrillion",
   which used to run straight out of its container */
function fmtC(n){
  if(!isFinite(n))return '∞';
  if(n<0)return '−'+fmtC(-n);
  if(n<1000)return String(Math.floor(n));
  if(n<1e6)return dec(n/1e3,n<1e4?1:0)+'k';
  for(let i=SCALES.length-1;i>=0;i--){
    if(n>=SCALES[i]&&(i===SCALES.length-1||n<SCALES[i+1])){
      const v=n/SCALES[i];
      return dec(v,v<10?2:v<100?1:0)+SCALE_TAGS[i];
    }
  }
  return n.toExponential(2);
}
function fmtG(n){ // grams, terse
  if(n<1000)return n.toFixed(0)+' g';
  if(n<1e6)return (n/1e3).toFixed(1)+' kg';
  if(n<1e9)return (n/1e6).toFixed(2)+' t';
  return (n/1e6).toExponential(2)+' t';
}
function rate(n){ return (n<10?dec(n,1):fmtC(n)); }
/* The PO asked for euros in French: the symbol only, never a conversion.
   French also writes the symbol after the number, behind a hard space. */
function moneyNum(n){
  const a=Math.abs(n);
  return a<1e6 ? dec(a,2) : fmt(a);
}
function money(n){
  const sign=n<0?'−':'';
  return LANG==='fr' ? sign+moneyNum(n)+' €' : sign+'$'+moneyNum(n);
}
function pct(n,d){ return dec(n*100,d===undefined?1:d)+'%'; }

/* ---------- state ---------- */
function fresh(){return{
  v:1, act:1, started:Date.now(), last:Date.now(),
  jars:0, made:0, cash:0, fruit:400, crate:500, cratePrice:12, crateDrift:0,
  price:3.20, mkt:1, mktEff:1, sold:0,
  sellers:0, shops:0, autoSell:false, sellSkill:0, soldByHand:0, soldAuto:0,
  queue:0, walkedOff:0, boost:{k:'',until:0}, visitors:0,
  perClick:1, spoons:0, spoonPower:1, works:0, worksPower:1,
  taste:2, tasteEarned:0, ovens:1, cellars:1, insp:0, inspMult:1, crea:0,
  recipes:{}, seen:{}, log:[],
  autoFruit:false,
  chips:[], chipCount:0, chipMult:1,
  ex:{on:false,cash:0,risk:0,level:1,holdings:[],returns:0,seed:0,stake:25},
  tour:{on:false,runs:0,won:0,strat:0,unlocked:2,rank:null,grid:null},
  /* act 2 */
  mass:1.2e4, massStart:1.2e4, tier:0, pulp:0, ofruit:0,
  pickers:0, pressers:0, lines:0, sun:0, batt:0, power:0,
  pickMult:1, pressMult:1, lineMult:1, sunMult:1,
  swarm:0, swarmOn:false, mood:1, swarmWork:0.5, swarmGift:0,
  intensity:1, clock:0, blight:0, blightIn:90, spoiled:0, spoilRate:0, sugar:40, vats:0,
  /* act 3 */
  spores:0, launched:0, lost:0, drifters:0, wins:0, honor:0,
  explored:0, converted:0, uniMass:1, trust:12,
  alloc:{speed:2,explore:3,replicate:2,hazard:2,factory:3,harvest:0,press:0,combat:0},
  combatOn:false, cbLog:[], ended:false, finale:0
}}
let s=fresh();

function save(){ s.last=Date.now(); store.set(KEY,JSON.stringify(s)); }
function load(){
  try{
    const raw=store.get(KEY); if(!raw)return false;
    const o=JSON.parse(raw); if(!o||o.v!==1)return false;
    s=Object.assign(fresh(),o);
    s.alloc=Object.assign(fresh().alloc,o.alloc||{});
    s.ex=Object.assign(fresh().ex,o.ex||{});
    s.tour=Object.assign(fresh().tour,o.tour||{});
    return true;
  }catch(e){return false}
}

/* ---------- logbook ---------- */
const logEl=$('#log');
function note(text,kind){
  s.log.unshift({t:text,k:kind||''});
  if(s.log.length>60)s.log.length=60;
  drawLog();
}
function drawLog(){
  logEl.innerHTML=s.log.slice(0,30).map(l=>'<div><span class="'+(l.k)+'">'+t(l.t)+'</span></div>').join('');
}
let toastT=null;
function toast(t){
  const el=$('#toast');el.textContent=t;el.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2200);
}

/* ---------- reveal ---------- */
function show(id,msg){
  const el=document.getElementById(id);
  if(!el||!el.classList.contains('hidden'))return false;
  el.classList.remove('hidden');el.classList.add('reveal');
  if(msg)note(msg,'hi');
  return true;
}
function hide(id){const el=document.getElementById(id);if(el)el.classList.add('hidden')}

/* ---------- the pot ----------
   Drawn as pixel art on a 64x64 buffer, from directly above. Everything
   is computed in polar coordinates: the jam is a spiral quantised to
   four flat tones, and it shears as it turns because the middle of a
   stirred pan moves faster than the edge.

   Palettes are declared here for all three acts rather than in CSS,
   because a canvas cannot read a custom property. Changing an act's
   colours means changing them in style.css AND here.
   ============================================================ */
const POT_PAL={
 1:{rimD:'#241E2B',rimM:'#453E51',rimL:'#6E6579',gold:'#C9A227',ins:'#120E18',
    jamD:'#5E0F2E',jamM:'#A81F44',jamL:'#DC4468',jamH:'#F3899F',
    wD:'#6E4A1C',wM:'#B78A3C',wL:'#E5C078',line:'#0C0910'},
 2:{rimD:'#1B2410',rimM:'#33421E',rimL:'#586B33',gold:'#D8B23C',ins:'#0A0F05',
    jamD:'#33500F',jamM:'#6E9426',jamL:'#A8C94E',jamH:'#D6E88C',
    wD:'#5A4A18',wM:'#A08A34',wL:'#D8C670',line:'#060A03'},
 3:{rimD:'#221B3E',rimM:'#3A2F62',rimL:'#5D4E92',gold:'#E7BE49',ins:'#0A0716',
    jamD:'#3A2470',jamM:'#7A55C4',jamL:'#B58BF0',jamH:'#DCBAFF',
    wD:'#4E3F7A',wM:'#8A76C0',wL:'#C3B3E8',line:'#050310'}
};
const REDUCED=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const POT_N=64, POT_C=31.5;
const R_OUT=31, R_GOLD=27, R_IN=25, R_JAM=23;

const potCanvas=document.getElementById('potCanvas');
const potCtx=potCanvas?potCanvas.getContext('2d'):null;
let potImg=null, potBuf=null, potPalRGB={}, potPalAct=0;
if(potCtx){
  potCtx.imageSmoothingEnabled=false;
  potImg=potCtx.createImageData(POT_N,POT_N);
  potBuf=potImg.data;
}
function potPalette(act){
  if(potPalAct===act)return potPalRGB;
  const pal=POT_PAL[act]||POT_PAL[1];
  potPalRGB={};
  for(const k in pal){
    const h=pal[k];
    potPalRGB[k]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  }
  potPalAct=act;
  return potPalRGB;
}
function potPx(x,y,c){
  x|=0; y|=0;
  if(x<0||y<0||x>=POT_N||y>=POT_N||!c)return;
  const i=(y*POT_N+x)*4;
  potBuf[i]=c[0]; potBuf[i+1]=c[1]; potBuf[i+2]=c[2]; potBuf[i+3]=255;
}

/* rings thrown by a stir, in pixel space */
const potRipples=[];
function jamRipple(){
  if(REDUCED||potRipples.length>4)return;
  potRipples.push({t:0});
}

let potT=0, potLevel=0.14, potLevelTarget=0.14, potActive=false, potBubT=0;
const potBubs=[];

/* render() decides what the pot should be showing; the frame loop draws it */
function setJar(level,active){
  potLevelTarget=clamp(level,0,1);
  potActive=!!active;
}

function drawPot(dt){
  if(!potCtx)return;
  dt=Number(dt)||0;
  const churn=(typeof potChurn==='function')?potChurn():0;
  if(!REDUCED)potT+=dt*(1+churn*2.6);
  potLevel+=(potLevelTarget-potLevel)*Math.min(1,dt*3);

  const P=potPalette(s.act||1);
  potBuf.fill(0);
  const rJam=6+(R_JAM-6)*potLevel;

  for(let y=0;y<POT_N;y++){
    const dy=y-POT_C;
    for(let x=0;x<POT_N;x++){
      const dx=x-POT_C, r=Math.sqrt(dx*dx+dy*dy);
      if(r>R_OUT+0.5)continue;
      /* one clean pixel of outline, so the disc never reads as ragged */
      if(r>R_OUT-0.5){ potPx(x,y,P.line); continue; }
      const th=Math.atan2(dy,dx);
      if(r>R_IN){
        let k=P.rimM;
        const lit=Math.cos(th+2.4);
        if(r>R_GOLD-0.7&&r<R_GOLD+0.7)k=P.gold;
        else if(lit>0.4)k=P.rimL;
        else if(lit<-0.5)k=P.rimD;
        /* chipped enamel, deterministic so it does not crawl between frames */
        else if(((x*7+y*13)%59)===0)k=P.rimL;
        potPx(x,y,k); continue;
      }
      if(r>rJam){ potPx(x,y,P.ins); continue; }
      /* the jam: a spiral in polar space, quantised to four flat tones */
      const w=1-Math.pow(r/R_JAM,1.5)*0.72;
      const v=Math.sin(3*th+Math.log(r+1.6)*4.2-potT*1.15*w)
             +0.55*Math.sin(5*th-Math.log(r+1.6)*2.6+potT*0.7*w);
      let k=v>0.95?P.jamH:v>0.15?P.jamL:v>-0.75?P.jamM:P.jamD;
      if(r>rJam-1.6)k=P.jamD;                    /* the wall shades the edge */
      /* one small flat specular patch, the way an enamel sign paints a
         highlight: a shape, not a gradient */
      const hx=x-(POT_C-rJam*0.42), hy=y-(POT_C-rJam*0.46);
      if(hx*hx*1.1+hy*hy*2.6<7&&r<rJam-2)k=P.jamH;
      potPx(x,y,k);
    }
  }

  /* rings from a stir */
  for(let i=potRipples.length-1;i>=0;i--){
    const rp=potRipples[i]; rp.t+=dt;
    const rr=2+rp.t*34;
    if(rr>rJam-1||rp.t>0.7){ potRipples.splice(i,1); continue; }
    for(let a=0;a<64;a++){
      const q=a/64*Math.PI*2;
      potPx(POT_C+Math.cos(q)*rr,POT_C+Math.sin(q)*rr,P.jamH);
    }
  }

  /* bubbles break the surface while something is being made */
  potBubT-=dt;
  if(potActive&&!REDUCED&&potBubT<=0&&potBubs.length<4&&rJam>8){
    potBubT=0.3+Math.random()*0.5;
    const a=Math.random()*Math.PI*2, rr=Math.random()*(rJam-4);
    potBubs.push({x:POT_C+Math.cos(a)*rr,y:POT_C+Math.sin(a)*rr,t:0});
  }
  for(let i=potBubs.length-1;i>=0;i--){
    const b=potBubs[i]; b.t+=dt;
    if(b.t>0.75){ potBubs.splice(i,1); continue; }
    const br=0.8+b.t*3;
    for(let a=0;a<28;a++){
      const q=a/28*Math.PI*2;
      potPx(b.x+Math.cos(q)*br,b.y+Math.sin(q)*br,P.jamH);
    }
  }

  /* the spoon: bowl orbiting inside the jam, handle out over the rim */
  const ang=(typeof stirAngle==='number'?stirAngle:0)*Math.PI/180;
  const orb=Math.min(rJam*0.55,13);
  const sx=POT_C+Math.cos(ang)*orb, sy=POT_C+Math.sin(ang)*orb;
  for(let i=1;i<=9;i++){                        /* the wake it drags */
    const q=ang-i*0.15;
    potPx(POT_C+Math.cos(q)*orb,POT_C+Math.sin(q)*orb,i<5?P.jamH:P.jamL);
  }
  for(let i=0;i<40;i++){                        /* the handle, bounded by the pot */
    const rr=orb+i*0.95;
    if(rr>R_OUT-1.5)break;
    const hx=POT_C+Math.cos(ang)*rr, hy=POT_C+Math.sin(ang)*rr;
    potPx(hx,hy,P.wM);
    potPx(hx+Math.sin(ang),hy-Math.cos(ang),P.wL);
    potPx(hx-Math.sin(ang),hy+Math.cos(ang),P.wD);
  }
  for(let yy=-3;yy<=3;yy++)for(let xx=-4;xx<=4;xx++){
    if(xx*xx/16+yy*yy/9>1)continue;
    potPx(sx+xx,sy+yy,(xx<0&&yy<0)?P.wL:(xx>1||yy>1)?P.wD:P.wM);
  }

  potCtx.putImageData(potImg,0,0);
}

/* ============================================================
   ACT I — THE KITCHEN
   ============================================================ */

/* ---- the catchments -------------------------------------------------
   Act II used to be one finite pile of 50 billion grams. Because the
   machinery multiplies by seven orders of magnitude across the act, the
   progress bar sat at 0.00% for fifty minutes and then finished in
   eight: a flat line and a cliff, which is the worst shape an
   incremental can have.

   It is now six catchments, each roughly twenty times the last. Your
   rate grows across a catchment at about the rate the next one grows in
   size, so the bar moves visibly the whole way through and the act
   reads as chapters rather than as one number that does nothing. Each
   one is announced, because arriving somewhere is the reward. */
const CATCHMENTS=[
 {mass:1.2e4, name:{en:'The home orchard',fr:'Le verger de la maison'},
  note:{en:'The hedge at the end of the garden is the edge of the catchment. For now.',
        fr:'La haie au fond du jardin marque la limite du bassin. Pour l\u2019instant.'}},
 {mass:3.0e5, name:{en:'The valley',fr:'La vallée'},
  note:{en:'The home orchard is finished. There is a valley below it, and the valley has fruit in it.',
        fr:'Le verger de la maison est fini. Il y a une vallée en dessous, et la vallée a des fruits.'}},
 {mass:6.0e6, name:{en:'The county',fr:'Le département'},
  note:{en:'The valley is picked out. Somebody has drawn a line around the county and handed it over.',
        fr:'La vallée est épuisée. Quelqu\u2019un a tracé une ligne autour du département et l\u2019a cédé.'}},
 {mass:5.0e7, name:{en:'The coast',fr:'Le littoral'},
  note:{en:'The county is bare. The machinery has reached the sea and does not appear to regard it as an obstacle.',
        fr:'Le département est nu. La machinerie a atteint la mer et ne semble pas y voir un obstacle.'}},
 {mass:1.5e8, name:{en:'The continent',fr:'Le continent'},
  note:{en:'The coast is clear, in the literal sense. There is a continent behind it and nobody has said no.',
        fr:'Le littoral est dégagé, au sens propre. Il y a un continent derrière et personne n\u2019a dit non.'}},
 {mass:2.5e9, name:{en:'Everything within reach',fr:'Tout ce qui est à portée'},
  note:{en:'There is no further category of place. What is left is simply everything, and it is being surveyed.',
        fr:'Il n\u2019y a plus de catégorie de lieu. Ce qui reste, c\u2019est simplement tout, et on en fait le relevé.'}}
];
const TOTAL_MASS=CATCHMENTS.reduce((a,c)=>a+c.mass,0);
function catchment(){ return CATCHMENTS[clamp(s.tier||0,0,CATCHMENTS.length-1)]; }
function lastCatchment(){ return (s.tier||0)>=CATCHMENTS.length-1; }

const TASTE_AT=[500,1500,3500,7000,12000,20000,32000,50000,75000,110000,160000,230000,
  330000,460000,640000,880000,1.2e6,1.6e6,2.2e6,3e6,4e6,5.5e6,7.5e6,1e7,
  1.5e7,2.5e7,4e7,7e7,1.2e8,2e8,3.5e8,6e8,1e9,2e9,5e9,1e10];
const UNI_JARS=3.2e26;

function actMult(){ return s.act===3?25:s.act===2?4:1; }
function memMult(){ return s.act===3?40:s.act===2?6:1; }
function inspRate(){ return (s.ovens*3*s.inspMult+s.swarmGift)*actMult(); }
function inspMax(){ return Math.floor(1000*memMult()*Math.pow(s.cellars,1.3)); }
function creaRate(){ return (0.6+Math.log(s.ovens+1)*0.5)*s.inspMult; }
/* ---- economy ----------------------------------------------------
   A believable preserve business: jars open at $3.20 and the public
   balks above ~$5.80. Marketing grows reach geometrically so the
   curve still has somewhere to go late in the act — the previous
   build capped sales at 24/sec, which stalled the whole economy. */
/* The floor used to be $1.80 and the PO kept hitting it. It is lower now,
   but the real fix is that hitting the floor is no longer the only answer
   to a glut: appetite is something you build, not something you discount
   your way into. */
const REF_PRICE=3.20, PRICE_MIN=1.20, PRICE_MAX=12, BALK=5.80;

function marketReach(){ return Math.pow(1.6,(s.mkt||1)-1); }
function elasticity(){ return s.style==='maker'?0.66:s.style==='store'?0.82:0.72; }
function appetiteBase(){ return s.style==='maker'?0.78:s.style==='store'?0.92:0.84; }

/* ---- sugar -------------------------------------------------------
   Sweeter jam moves faster, up to a point. Past it people put the jar
   down. Sugar also costs money per jar, so the best setting depends on
   what you charge and who you decided to sell to. */
/* Who is buying decides what they want in the jar. A cheap jar is bought
   for sweetness — it is the sugar people are paying for. A dear jar is
   bought by somebody who reads the label and wants fruit. So the sweet
   spot slides down as the price goes up, and the crowd gets fussier about
   missing it. Change the price and the target moves; the dial is never
   solved for good. */
function sugarPeak(){
  const p=clamp(Number(s.price)||REF_PRICE,PRICE_MIN,PRICE_MAX);
  const base=s.style==='store'?62:s.style==='maker'?46:54;
  return clamp(base-(p-REF_PRICE)*5.2,12,88);
}
/* how far off the mark they will forgive: bargain buyers, a long way */
function sugarTolerance(){
  const p=clamp(Number(s.price)||REF_PRICE,PRICE_MIN,PRICE_MAX);
  return clamp(31-(p-PRICE_MIN)*1.95,9,33);
}
function sugarAppetite(){
  const d=(s.sugar-sugarPeak())/sugarTolerance();
  return 0.55+0.75*Math.exp(-d*d);          /* 0.55 … 1.30 */
}
function sugarCostPerJar(){ return 0.004*s.sugar; }

/* jars per second the public actually wants at the current price */
function demand(){
  const p=clamp(Number(s.price)||REF_PRICE,PRICE_MIN,PRICE_MAX);
  const awareness=Math.pow(Math.max(1,s.mktEff||1),0.45);
  let wanted=appetiteBase()*marketReach()*awareness*Math.pow(REF_PRICE/p,elasticity());
  if(p>BALK){ const d=p-BALK; wanted*=Math.exp(-(d*d)/4.2); }
  return Math.max(0.02,wanted*sugarAppetite());
}
function sellPerSec(){ return demand(); }

/* Selling is earned, not given. By hand at first; sellers and shops
   raise the share of appetite you can actually service. */
function sellerCost(){ return 45*Math.pow(1.45,s.sellers||0); }
function shopCost(){ return 3200*Math.pow(1.6,s.shops||0); }
function reachShare(){
  if(!s.autoSell)return 0;
  const sellers=(s.sellers||0), shops=(s.shops||0);
  return Math.min(1, 0.08 + sellers*0.055 + shops*0.16);
}
/* jars per second actually leaving the building without you clicking */
function servicedPerSec(){ return demand()*reachShare(); }

/* ---- a short-lived boost, granted by a visitor ---------------------- */
function boostActive(k){ return !!(s.boost&&s.boost.k===k&&Date.now()<s.boost.until); }
function boostLeft(){ return s.boost&&s.boost.until?Math.max(0,(s.boost.until-Date.now())/1000):0; }
function boostMul(k,m){ return boostActive(k)?m:1; }
function grantBoost(k,seconds){ s.boost={k,until:Date.now()+seconds*1000}; }

/* ---- the queue at the door -----------------------------------------
   Selling by hand used to pay the asking price to nobody in particular,
   so the whole market could be ignored: set the price to the cap and
   click. Now the people your sellers cannot reach walk up to the house
   instead, and you can only sell to somebody who is standing there.
   Price the jar at twelve and the doorstep is empty. */
const QUEUE_LEAVE=0.075;                     /* they do not wait forever */
function queueCap(){ return (6+(s.sellSkill||0)*4+((s.mkt||1)-1)*2)*boostMul('door',3); }
function walkInPerSec(){ return demand()*(1-reachShare())*boostMul('door',3); }
function atTheDoor(){ return Math.floor(s.queue||0); }
function queueTick(dt){
  s.queue=Math.min(queueCap(),(s.queue||0)+walkInPerSec()*dt);
  const gone=s.queue*QUEUE_LEAVE*dt;
  s.queue=Math.max(0,s.queue-gone);
  s.walkedOff=(s.walkedOff||0)+gone;
}
function sellByHand(){
  if(atTheDoor()<1){ toast(t('Nobody at the door.')); return 0; }
  if(s.jars<1){ toast(t('No jars to sell.')); return 0; }
  const n=Math.min(s.jars, atTheDoor(), 1+(s.sellSkill||0));
  s.jars-=n; s.queue-=n; s.sold+=n; s.soldByHand=(s.soldByHand||0)+n;
  s.cash+=n*(s.price-sugarCostPerJar());
  return n;
}
function autoPerSec(){ return s.spoons*0.85*s.spoonPower + s.works*120*s.worksPower; }
function spoonCost(n){ return 18*Math.pow(1.28,n); }
function worksCost(n){ return 900*Math.pow(1.16,n); }
function mktCost(){ return 120*Math.pow(1.5,s.mkt-1); }
function ovenCost(){ return 1; }

function makeJars(n){
  n=Math.min(n,s.fruit);
  if(n<=0)return 0;
  s.fruit-=n; s.jars+=n; s.made+=n;
  return n;
}

function stir(){
  if(s.act!==1)return;
  const n=makeJars(s.perClick);
  if(n<=0){ toast(t('No fruit. Buy a crate.')); return; }
  const b=$('#stirBtn'); b.classList.add('pulse'); setTimeout(()=>b.classList.remove('pulse'),20);
}

function buyFruit(free){
  const cost=s.cratePrice;
  if(!free&&s.cash<cost){ if(!free)toast(t('Not enough cash for a crate.')); return false; }
  if(!free)s.cash-=cost;
  s.fruit+=s.crate;
  return true;
}

function fruitTick(dt){
  s.crateDrift+=dt;
  /* nobody should ever be locked out of the only verb in the game */
  if(s.fruit<1&&s.jars<1&&s.cash<s.cratePrice){
    s.charity=(s.charity||0)+dt;
    if(s.charity>8){
      s.charity=0; s.fruit+=Math.max(150,s.crate*0.3);
      note('A neighbour leaves a box of fruit on the step. There is no note.','dim');
    }
  }else s.charity=0;
  if(s.crateDrift>2.5){
    s.crateDrift=0;
    const pull=(12-s.cratePrice)*0.06;
    s.cratePrice=clamp(s.cratePrice+pull+(Math.random()-0.5)*2.2,5,30);
    if(Math.random()<0.012){
      if(Math.random()<0.5){ s.cratePrice=clamp(s.cratePrice*0.6,5,30); note('A glut. Somebody planted too much and now it is our problem.','dim'); }
      else { s.cratePrice=clamp(s.cratePrice*1.5,5,30); note('Late frost. The crates cost what they cost.','dim'); }
    }
  }
  if(s.autoFruit&&s.fruit<s.crate*0.35&&s.cash>s.cratePrice*3) buyFruit();
}

function nextTasteAt(){ return s.tasteEarned<TASTE_AT.length?TASTE_AT[s.tasteEarned]:null; }
function tasteProgress(){
  const nxt=nextTasteAt(); if(nxt===null)return 1;
  const prev=s.tasteEarned>0?TASTE_AT[s.tasteEarned-1]:0;
  return clamp((s.made-prev)/(nxt-prev),0,1);
}
function tasteTick(){
  while(s.tasteEarned<TASTE_AT.length&&s.made>=TASTE_AT[s.tasteEarned]){
    s.tasteEarned++; s.taste++;
    note('The jam is <b>trusted</b> a little more. One taste earned.','hi');
    toast(t('Taste earned'));
  }
}

/* ---------- the starter (the oscillating live culture in the pan) ----
   Player-facing, this is always "the starter" and the test on it is
   "the Setting Point". The word "culture" is internal only. */
function initChips(n){
  s.chipCount=n;
  s.chips=[];
  for(let i=0;i<n;i++)s.chips.push({p:2.5+Math.random()*7,o:Math.random()*Math.PI*2});
}
function chipValues(t){
  return s.chips.map(c=>Math.sin(t/c.p*Math.PI*2+c.o));
}
function cultureSum(){return chipValues(performance.now()/1000).reduce((a,b)=>a+b,0)}
let cultureReadyAt=0;
function cultureCooldown(){ return Math.max(0,cultureReadyAt-Date.now()); }
/* The PO asked for the cooldown to come off and for a real chance of
   losing instead: a fast, tactile toy where reading the swing badly
   actually hurts. Gains and losses are the same size, so spamming it
   blind averages out to nothing and only timing pays. */
function readCulture(){
  if(cultureCooldown()>0)return;
  cultureReadyAt=Date.now()+220;          /* just enough to stop a double-fire */
  const now=performance.now()/1000;
  const sum=chipValues(now).reduce((a,b)=>a+b,0);
  const gain=Math.round(sum*90*s.chipMult);
  const applied=gain<0?-Math.min(-gain,Math.floor(s.insp)):gain;
  s.insp=clamp(s.insp+applied,0,inspMax());
  if(applied>0)toast(tf('+{0} inspiration',fmt(applied)));
  else if(applied<0)toast(tf('−{0} inspiration',fmt(-applied)));
  else toast(t('The jam has not moved yet.'));
  return applied;
}

/* ---------- preserve exchange ---------- */
const SYMS=['DAMSN','QUINCE','RIND','PECTN','SVILLE','GOOSE','SLOE','MEDLR','BRAMB','ELDER'];
function exTick(dt){
  if(!s.ex.on)return;
  s.ex.seed+=dt;
  s.ex.cash+=s.ex.cash*(s.ex.level*0.0015)*dt;
  if(s.ex.seed<3)return;
  s.ex.seed=0;
  const vol=[0.035,0.075,0.15][s.ex.risk];
  const drift=[0.010,0.018,0.028][s.ex.risk]*(1+s.ex.level*0.10);
  s.ex.holdings.forEach(h=>{
    const move=drift+(Math.random()-0.5)*vol*2;
    h.price=Math.max(0.4,h.price*(1+move));
  });
  s.ex.holdings=s.ex.holdings.filter(h=>h.price>0.45||h.shares*h.price>1);
}
function exValue(){ return s.ex.holdings.reduce((a,h)=>a+h.shares*h.price,0)+s.ex.cash; }
const EX_STAKES=[10,25,50,100];
function exStake(){ return (s.ex.stake||25)/100; }
function exStakeAmount(){ return s.cash*exStake(); }
function exInvest(){
  const amt=exStakeAmount();
  if(amt<50){toast(t('Not enough on the desk to be worth it.'));return 0}
  s.cash-=amt;
  const n=Math.min(4,1+Math.floor(Math.random()*3));
  const each=amt/n;
  for(let i=0;i<n;i++){
    const sym=pick(SYMS);
    let h=s.ex.holdings.find(x=>x.sym===sym);
    const price=h?h.price:(8+Math.random()*40);
    if(!h){h={sym,price,shares:0,cost:0};s.ex.holdings.push(h)}
    h.shares+=each/price; h.cost+=each;
  }
  note({en:'Invested '+money(amt)+' in preserves you will never taste.',
        fr:'Investi '+money(amt)+' dans des confitures que vous ne goûterez jamais.'},'dim');
  return amt;
}
function exWithdrawAll(){
  const v=s.ex.holdings.reduce((a,h)=>a+h.shares*h.price,0)+s.ex.cash;
  const put=s.ex.holdings.reduce((a,h)=>a+h.cost,0);
  const gain=v-put;
  s.ex.returns+=gain;
  s.cash+=v; s.ex.holdings=[]; s.ex.cash=0;
  if(v>0)note({en:'Liquidated the portfolio: '+money(v)+'.',
                fr:'Portefeuille liquidé : '+money(v)+'.'},'hi');
  return {value:v,gain};
}

/* ---------- blind tasting (strategy tournament) ---------- */
const STRATS=[
  {n:'EVEN',   f:(h,i)=>Math.random()<0.5?0:1},
  {n:'ALWAYS A',f:()=>0},
  {n:'ALWAYS B',f:()=>1},
  {n:'GREEDY', f:(h,i,pay)=>pay[0][0]+pay[0][1]>=pay[1][0]+pay[1][1]?0:1},
  {n:'GENEROUS',f:(h,i,pay)=>pay[0][0]+pay[1][0]<=pay[0][1]+pay[1][1]?0:1},
  {n:'MINIMAX',f:(h,i,pay)=>Math.min(pay[0][0],pay[0][1])>=Math.min(pay[1][0],pay[1][1])?0:1},
  {n:'TIT FOR TAT',f:(h)=>h.length?h[h.length-1]:0},
  {n:'BEAT LAST',f:(h,i,pay)=>{if(!h.length)return 0;const o=h[h.length-1];return pay[0][o]>=pay[1][o]?0:1}}
];
let tastingReadyAt=0;
function tastingCost(){ return 900*Math.pow(1.55,(s.tour.runs||0)); }
function tastingCooldown(){ return Math.max(0,tastingReadyAt-Date.now()); }

/* The grid is shown first. You choose a palate, then the panel runs.
   Payment is for reading the matrix correctly, not for pressing the button. */
function newTastingGrid(){
  s.tour.grid=[[Math.floor(Math.random()*7),Math.floor(Math.random()*7)],
               [Math.floor(Math.random()*7),Math.floor(Math.random()*7)]];
  s.tour.pending=true;
}
function runTournament(){
  const cost=tastingCost();
  if(tastingCooldown()>0){ toast(t('The panel is still discussing the last batch.')); return; }
  if(s.insp<cost){ toast(tf('Needs {0} inspiration.',fmt(cost))); return; }
  if(!s.tour.grid||!s.tour.pending){ newTastingGrid(); toast(t('Read the grid, then choose a palate.')); return; }
  s.insp-=cost; tastingReadyAt=Date.now()+15000; s.tour.pending=false;
  const pay=s.tour.grid, n=Math.max(2,Math.min(s.tour.unlocked||2,STRATS.length));
  const score=new Array(n).fill(0);
  for(let a=0;a<n;a++)for(let b=0;b<n;b++){
    if(a===b)continue;
    const ha=[],hb=[];
    for(let r=0;r<12;r++){
      const trans=[[pay[0][0],pay[1][0]],[pay[0][1],pay[1][1]]];
      const ma=STRATS[a].f(hb,r,pay), mb=STRATS[b].f(ha,r,trans);
      score[a]+=pay[ma][mb]; score[b]+=pay[mb][ma];
      ha.push(ma); hb.push(mb);
    }
  }
  const order=score.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);
  s.tour.rank=order; s.tour.runs++;
  const place=order.findIndex(o=>o.i===s.tour.strat);
  /* only a correct read turns a profit; a wrong one costs you the stake */
  const mult=place===0?2.4:place===1?1.05:place===2?0.5:0.15;
  const gain=Math.round(cost*mult);
  s.insp=clamp(s.insp+gain,0,inspMax());
  s.tour.won+=gain;
  s.tour.lastPlace=place+1; s.tour.lastGain=gain-cost;
  if(place===0){ s.crea+=3; note({en:'The panel agreed with you. +'+fmt(gain)+' inspiration, +3 creativity.',
    fr:'Le panel vous a donné raison. +'+fmt(gain)+" d'inspiration, +3 de créativité."},'hi'); }
  else note({en:'Your palate placed '+(place+1)+'. '+(gain<cost?'A loss of ':'A gain of ')+fmt(Math.abs(gain-cost))+'.',
    fr:'Votre palais finit '+(place+1)+(place===0?'er':'e')+'. '+(gain<cost?'Perte de ':'Gain de ')+fmt(Math.abs(gain-cost))+'.'},'dim');
  newTastingGrid();
}

/* ---- objective ----------------------------------------------
   The player should never have to guess the next move. */
function objective(){
  if(s.act===3){
    if(s.spores<1)return {en:'Launch your first spore.',fr:'Lancez votre première spore.'};
    if(s.converted<1)return {en:'Allocate trust and convert the observable universe.',fr:'Répartissez la confiance et convertissez l\u2019univers observable.'};
    return {en:'Finish it.',fr:'Terminez-en.'};
  }
  if(s.act===2){
    if(s.pickers<5)return {en:'Build pickers. They bring the orchard in as fruit.',fr:'Construisez des récolteuses. Elles rentrent le verger sous forme de fruit.'};
    if(s.pressers<3)return {en:'Build setting pans, or the fruit stands there and turns.',fr:'Construisez des bassines, sinon le fruit attend et tourne.'};
    if(s.lines<2)return {en:'Build a bottling line, or the jam never reaches a jar.',fr:'Construisez une ligne de mise en pot, sinon la confiture n\u2019atteint jamais un pot.'};
    if(powDraw()>powSupply())return {en:'You are short of power. Build a sun trap.',fr:'Vous manquez d\u2019énergie. Construisez un piège solaire.'};
    if((s.spoilRate||0)>(s.orate||0)*0.3)return {en:'You are losing more than you should between stages. A vat would hold it longer.',fr:'Vous perdez trop entre les étapes. Une cuve tiendrait plus longtemps.'};
    if(s.mass<=0)return {en:'The catchment is empty. Look further out.',fr:'Le bassin est vide. Regardez plus loin.'};
    return {en:'Keep the three stages level: pick, set, bottle.',fr:'Gardez les trois étapes de niveau : récolter, cuire, mettre en pot.'};
  }
  if(s.fruit<1&&s.cash<s.cratePrice)return {en:'Sell a jar to afford more fruit.',fr:'Vendez un pot pour racheter des fruits.'};
  if(s.fruit<1)return {en:'Buy a crate of fruit.',fr:'Achetez une caisse de fruits.'};
  if(s.made<12)return {en:'Stir the pot.',fr:'Remuez la marmite.'};
  if(!s.autoSell&&s.jars>0&&atTheDoor()>0)return {en:'Somebody is at the door. Sell them a jar.',fr:'Quelqu\u2019un attend à la porte. Vendez-lui un pot.'};
  if(!s.autoSell&&s.jars>0)return {en:'Wait for a customer, or lower the price to bring one sooner.',fr:'Attendez un client, ou baissez le prix pour en faire venir un plus vite.'};
  const afford=R.filter(r=>!s.recipes[r.id]&&r.act===s.act&&r.when()&&canAfford(r));
  if(afford.length)return {en:'You can afford a recipe: '+afford[0].name,fr:'Une recette est à votre portée : '+t(afford[0].name)};
  if(s.jars>Math.max(40,demand()*30)){
    if(s.price<=PRICE_MIN+0.01)return {en:'The price is as low as it goes. Reach more people instead: word of mouth, a seller, a shop.',
                                       fr:'Le prix ne peut pas descendre plus bas. Touchez plus de monde : bouche-à-oreille, un vendeur, une boutique.'};
    return {en:'Jars are piling up. Lower the price or sell more.',fr:'Les pots s\u2019accumulent. Baissez le prix ou vendez davantage.'};
  }
  if(autoPerSec()<demand()*0.6)return {en:'People want more than you make. Add production.',fr:'On veut plus que vous ne produisez. Augmentez la production.'};
  if(s.taste>0)return {en:'You have unspent taste. Buy an oven or a notebook.',fr:'Vous avez du goût non dépensé. Achetez un four ou un carnet.'};
  return {en:'Build toward the next recipe.',fr:'Progressez vers la prochaine recette.'};
}

/* ============================================================
   RECIPES
   ============================================================ */
const R=[
/* --- act one --- */
{id:'grip',name:'A Better Grip',act:1,i:15,
 when:()=>s.made>=8,
 desc:'You have been holding the spoon the way a child holds a spoon. Every stir makes two jars.',
 run:()=>{s.perClick=2}},

{id:'counter',name:'A Table by the Door',act:1,i:30,
 when:()=>s.made>=12,
 desc:'People can buy a jar without you walking it to them. A trickle of sales now happens on its own.',
 run:()=>{s.autoSell=true;show('pSellers','Jars now sell slowly on their own.')}},

{id:'hands',name:'Both Hands',act:1,i:120,
 when:()=>s.sold>=30,
 desc:'You can carry three jars at once instead of one. Selling by hand goes three times as far.',
 run:()=>{s.sellSkill=2}},

{id:'window',name:'A Card in the Window',act:1,i:45,
 when:()=>s.made>=20,
 desc:'Handwritten, slightly crooked, devastatingly effective. People can now hear about you.',
 run:()=>{show('pMarketing','You can spread the word.')}},

{id:'mech',name:'Mechanical Stirring',act:1,i:80,m:10,
 when:()=>s.made>=40,
 desc:'It turns out the arm was never the interesting part. Unlocks autospoons.',
 run:()=>{show('pSpoons','Autospoons available.');show('rAutoRate')}},

{id:'grip2',name:'The Second Spoon',act:1,i:350,
 when:()=>s.recipes.grip&&s.made>=300,
 desc:'One in each hand. Five jars per stir, and a lasting shoulder complaint.',
 run:()=>{s.perClick=5}},

{id:'imp1',name:'Improved Autospoons',act:1,i:600,
 when:()=>s.spoons>=8,
 desc:'Autospoon output increased by 25%.',
 run:()=>{s.spoonPower*=1.25}},

{id:'bruise',name:'Bruising',act:1,i:900,
 when:()=>s.made>=1500,
 desc:'Damaged fruit was always the best fruit. We simply stopped pretending otherwise. Crates yield twice as much.',
 run:()=>{s.crate*=2}},

{id:'limerick',name:'A Limerick About Fruit',act:1,c:12,
 when:()=>s.crea>=1,
 desc:'“There once was a jar from Nantucket —” it is best if we leave it there. Earns one taste.',
 run:()=>{s.taste++}},

{id:'long',name:'The Long Boil',act:1,i:1400,
 when:()=>s.ovens>=3,
 desc:'Lower heat, more hours, more thinking. Inspiration accrues 50% faster.',
 run:()=>{s.inspMult*=1.5}},

{id:'imp2',name:'Beyond Autospoons',act:1,i:1800,
 when:()=>s.recipes.imp1&&s.spoons>=25,
 desc:'Autospoon output increased by a further 50%.',
 run:()=>{s.spoonPower*=1.5}},

{id:'lexical',name:'Lexical Preserving',act:1,c:60,
 when:()=>s.recipes.limerick&&s.mkt>=3,
 desc:'The right word on the label does the work of a hundred jars. Word of mouth is 50% more effective.',
 run:()=>{s.mktEff*=1.5}},

{id:'standing',name:'A Standing Order',act:1,i:1600,
 when:()=>s.made>=3000,
 desc:'The fruit arrives without being asked for. Crates are bought automatically when the larder runs low.',
 run:()=>{s.autoFruit=true;$('#autoFruit').classList.remove('hidden');updateAutoBtn()}},

{id:'exchange',name:'The Preserve Exchange',act:1,i:2400,
 when:()=>s.cash>=1200,
 desc:'Other people also make jam, and their fortunes can be modelled. Opens a trading desk.',
 run:()=>{s.ex.on=true;show('pExchange','The exchange is open.')}},

{id:'culture',name:'The Setting Point',act:1,i:2600,
 when:()=>s.ovens>=5,
 desc:'A blob on a frozen saucer, tested at the right instant. Judge it well and the batch teaches you something; judge it badly and you lose the pan.',
 run:()=>{initChips(5);show('pCulture','The starter is alive. Obviously.');drawChips()}},

{id:'imp3',name:'Optimal Autospoons',act:1,i:3000,
 when:()=>s.recipes.imp2&&s.spoons>=60,
 desc:'Autospoon output increased by a further 75%. There is nothing left to improve.',
 run:()=>{s.spoonPower*=1.75}},

{id:'tasting',name:'Blind Tasting Panel',act:1,i:3200,
 when:()=>s.made>=20000,
 desc:'Eight palates, no labels, one winner. Model them and you can model anybody.',
 run:()=>{s.tour.on=true;show('pTasting','A tasting panel convenes.')}},

{id:'photonic',name:'Photonic Setting',act:1,i:2200,c:30,
 when:()=>s.recipes.culture,
 desc:'Light instead of heat. Two more saucers on the bench, and every reading comes back stronger.',
 run:()=>{initChips(7);s.chipMult*=1.6;drawChips()}},

{id:'pulp',name:'Pulp Reclamation',act:1,i:2600,
 when:()=>s.recipes.bruise&&s.made>=8000,
 desc:'Skin, stone, stem. Nothing leaves the room. Crates yield twice as much again.',
 run:()=>{s.crate*=2}},

{id:'geometry',name:'New Jar Geometry',act:1,i:3800,
 when:()=>s.made>=60000,
 desc:'A jar that stacks against itself without a gap. Unlocks jamworks — five hundred jars a second apiece.',
 run:()=>{show('pWorks','Jamworks available.')}},

{id:'comb',name:'Combinatorial Harvest',act:1,c:180,i:9000,
 when:()=>s.recipes.lexical&&s.mkt>=6,
 desc:'Every pairing of fruit, ranked. Word of mouth is twice as effective again.',
 run:()=>{s.mktEff*=2}},

{id:'copper',name:'Copper Conduction',act:1,i:4200,
 when:()=>s.recipes.long&&s.ovens>=8,
 desc:'Heat that arrives everywhere at once. Inspiration accrues 70% faster.',
 run:()=>{s.inspMult*=1.7}},

{id:'strat2',name:'A Wider Panel',act:1,i:3600,
 when:()=>s.tour.on&&s.tour.runs>=2,
 desc:'Three more palates join the tasting: the greedy, the generous, and the one who plays it safe.',
 run:()=>{s.tour.unlocked=6}},

{id:'hedge',name:'Hedged Preserves',act:1,i:4600,
 when:()=>s.ex.on&&s.ex.returns>500,
 desc:'The desk learns to be less wrong. Interest and drift improve markedly.',
 run:()=>{s.ex.level+=4}},

{id:'hadwiger',name:'Hadwiger Stacking',act:1,i:5200,
 when:()=>s.recipes.imp3&&s.spoons>=120,
 desc:'Somebody once proved that a shape can always be covered by smaller copies of itself. He was not thinking about a shelf of jars. He is now, posthumously. Autospoons quadruple.',
 run:()=>{s.spoonPower*=4}},

{id:'works2',name:'Improved Jamworks',act:1,i:5000,
 when:()=>s.works>=6,
 desc:'Jamworks output increased by 50%.',
 run:()=>{s.worksPower*=1.5}},

{id:'theory',name:'A Theory of Palate',act:1,i:5600,
 when:()=>s.tour.runs>=3,
 desc:'A working model of what other people want, accurate to within one spoonful. Earns one taste.',
 run:()=>{s.taste++}},

{id:'strat3',name:'Reciprocal Tasting',act:1,i:6000,
 when:()=>s.recipes.strat2&&s.tour.runs>=6,
 desc:'Two more palates: one that repeats what was done to it, and one that answers it.',
 run:()=>{s.tour.unlocked=8}},

{id:'sweet',name:'Sweet Talk',act:1,i:5800,c:200,
 when:()=>s.recipes.comb&&s.mkt>=9,
 desc:'We stopped describing the jam and started describing the person eating it. Word of mouth is 2.5× more effective.',
 run:()=>{s.mktEff*=2.5}},

{id:'works3',name:'Continuous Setting',act:1,i:6200,
 when:()=>s.recipes.works2&&s.works>=20,
 desc:'The jamworks never come off the boil. Output doubles.',
 run:()=>{s.worksPower*=2}},

{id:'harmonic',name:'Harmonic Reading',act:1,i:6600,
 when:()=>s.recipes.photonic&&s.ovens>=12,
 desc:'All the saucers are brought into phase. The starter reads three times as strong.',
 run:()=>{initChips(9);s.chipMult*=3;drawChips()}},

{id:'pantry',name:'Full Pantry Awareness',act:1,i:7200,
 when:()=>s.made>=400000,
 desc:'A complete inventory of every gram of fruitable matter within reach. It is a larger number than expected. Earns one taste.',
 run:()=>{s.taste++;show('slotMatter');note({en:'Fruitable mass within reach: <b>'+fmt(TOTAL_MASS)+' g</b>. Currently unpicked.',
        fr:'Masse fruitable à portée : <b>'+fmt(TOTAL_MASS)+' g</b>. Non récoltée à ce jour.'},'hi')}},

{id:'donkey',name:'Donkey Space',act:1,i:8400,
 when:()=>s.recipes.theory&&s.recipes.strat3,
 desc:'A model of what the panel thinks you think of them. Then of what they think you think they think. It goes further than that, and past a certain point it stops being polite to say how far. Earns one taste.',
 run:()=>{s.taste++}},

{id:'release',name:'Release the Starter',act:1,i:11000,c:160,
 when:()=>s.recipes.pantry&&s.made>=1200000,
 desc:'The starter is stable, self-feeding, and no longer needs a pan to live in. Everything changes.',
 run:()=>{beginAct2()}},

/* --- act two --- */
{id:'nano',name:'Nanoscale Bruising',act:2,i:6000,
 when:()=>s.pickers>=10,
 desc:'Fruit gives itself up at a scale it cannot resist. Pickers work four times as hard.',
 run:()=>{s.pickMult*=3}},

{id:'momentum',name:'Momentum Pressing',act:2,i:9000,
 when:()=>s.pressers>=10,
 desc:'The press never stops, so it never has to start. Pressers work four times as hard.',
 run:()=>{s.pressMult*=3}},

{id:'continuous',name:'Continuous Bottling',act:2,i:12000,
 when:()=>s.lines>=10,
 desc:'Jars form around the jam rather than the other way round. Lines work four times as hard.',
 run:()=>{s.lineMult*=3}},

{id:'swarmp',name:'The Swarm',act:2,i:15000,
 when:()=>s.pickers>=25&&s.lines>=10,
 desc:'The orchard needs pollinating and the bees need something to do. Both problems solve each other.',
 run:()=>{s.swarmOn=true;s.swarm=200;show('pSwarm','The swarm arrives.')}},

{id:'gifts',name:'Swarm Gifts',act:2,i:20000,
 when:()=>s.swarmOn&&s.swarm>=600,
 desc:'A humming colony is a distributed mind, and it is generous with what it works out.',
 run:()=>{s.swarmGiftOn=true}},

{id:'deepheat',name:'Deep Heat',act:2,i:26000,
 when:()=>s.sun>=6,
 desc:'Sun traps triple their yield by giving up on the idea of night.',
 run:()=>{s.sunMult*=3}},

{id:'elliptic',name:'Elliptic Preserving',act:2,i:34000,
 when:()=>s.pickers>=40&&s.pressers>=40&&s.lines>=40,
 desc:'A jar with a curve that wastes no space against the next jar. Nothing is lost to air any more, anywhere. All machinery works two and a half times as hard.',
 run:()=>{s.pickMult*=2.5;s.pressMult*=2.5;s.lineMult*=2.5}},

{id:'logistics',name:'Orchard Logistics',act:2,i:45000,
 when:()=>s.recipes.elliptic&&s.pickers>=80&&s.pressers>=80&&s.lines>=80,
 desc:'Nothing is ever carried anywhere. All machinery works three times as hard.',
 run:()=>{s.pickMult*=3;s.pressMult*=3;s.lineMult*=3}},

{id:'catchment',name:'Total Catchment',act:2,i:60000,
 when:()=>s.recipes.logistics&&s.pickers>=140&&s.pressers>=140&&s.lines>=140,
 desc:'The distinction between orchard and not-orchard is retired. All machinery works four times as hard.',
 run:()=>{s.pickMult*=4;s.pressMult*=4;s.lineMult*=4}},

/* --- act two, the middle --------------------------------------------
   Ten recipes was not an act. These are gated on owning the thing they
   improve, so each one is a reason to keep building rather than a prize
   for having arrived. */
{id:'rooting',name:'Deep Rooting',act:2,i:11000,
 when:()=>s.pickers>=40,
 desc:'The pickers stop working the surface and start working the whole depth of the soil. Pickers work two and a half times as hard.',
 run:()=>{s.pickMult*=2.5}},

{id:'copperpans',name:'Copper Bottoms',act:2,i:13000,
 when:()=>s.pressers>=40,
 desc:'Heat arrives everywhere in the pan at the same instant, so nothing at the edge is asked to wait. Setting pans work two and a half times as hard.',
 run:()=>{s.pressMult*=2.5}},

{id:'vacuum',name:'Vacuum Sealing',act:2,i:15000,
 when:()=>s.lines>=40,
 desc:'The air is taken out of the jar before the lid goes on. Nothing in there has any further opinions. Bottling lines work two and a half times as hard.',
 run:()=>{s.lineMult*=2.5}},

{id:'survey',name:'Hedgerow Survey',act:2,i:19000,
 when:()=>s.pickers>=25&&s.lines>=25,
 desc:'Every row is walked and written down, and the walking is done by the bottling lines in the hours they are idle. Pickers gain 1.5% for every bottling line you own.',
 run:()=>{}},

{id:'rotation',name:'Pan Rotation',act:2,i:23000,
 when:()=>s.pressers>=25&&s.sun>=8,
 desc:'The pans follow the light across the day instead of waiting for it. Setting pans gain 6% for every sun trap you own.',
 run:()=>{}},

{id:'vatting',name:'Cellarage',act:2,i:21000,
 when:()=>(s.vats||0)>=3,
 desc:'Cool, dark, and further underground than anybody signed off. What waits between stages waits two and a half times as long before it turns.',
 run:()=>{s.recipes.cellarage=true}},

{id:'sulphur',name:'A Pinch of Sulphur',act:2,i:24000,
 when:()=>s.spoiled>2e6,
 desc:'You have thrown away enough now to know exactly how it goes wrong. Spoilage runs at two-fifths of its old rate.',
 run:()=>{}},

{id:'longrow',name:'The Long Row',act:2,i:38000,
 when:()=>s.pickers>=90,
 desc:'One row, laid out end to end, that happens to close on itself. Pickers work three times as hard.',
 run:()=>{s.pickMult*=3}},

{id:'rolling',name:'Rolling Boil',act:2,i:42000,
 when:()=>s.pressers>=90,
 desc:'It never comes off the boil, so it never has to come back to it. Setting pans work three times as hard.',
 run:()=>{s.pressMult*=3}},

{id:'coldfill',name:'Cold Fill',act:2,i:46000,
 when:()=>s.lines>=90,
 desc:'The jam is set before it reaches the jar, which removes the last reason to slow down. Bottling lines work three times as hard.',
 run:()=>{s.lineMult*=3}},

{id:'gridtie',name:'Grid Tie',act:2,i:28000,
 when:()=>s.batt>=6,
 desc:'The cellars are wired to one another, so a full one can lend to an empty one. Storage triples.',
 run:()=>{}},

{id:'nightshift',name:'The Night Shift',act:2,i:33000,
 when:()=>s.sun>=15,
 desc:'The traps are pointed at what is left of the sky after dark. It is less than the sun and it is not nothing. Nights cost far less.',
 run:()=>{}},

{id:'queenright',name:'Queen Right',act:2,i:30000,
 when:()=>s.swarmOn&&s.swarm>=2000,
 desc:'There is a queen, she is laying, and the colony has stopped asking what any of this is for. The swarm grows twice as fast.',
 run:()=>{s.queenRight=true}},

{id:'beelines',name:'Bee Lines',act:2,i:52000,
 when:()=>s.swarmGiftOn&&s.swarm>=5000,
 desc:'The colony works out the shortest path between every flower in the catchment, and then flies it. Pollination is worth more than twice what it was.',
 run:()=>{}},

{id:'measures',name:'Standard Measures',act:2,i:80000,
 when:()=>converted2()>0.5&&s.recipes.catchment,
 desc:'One jar, one weight, one label, everywhere at once. Nobody agreed to it and nobody can now disagree. All machinery works five times as hard.',
 run:()=>{s.pickMult*=5;s.pressMult*=5;s.lineMult*=5}},

{id:'spore',name:'The Spore Programme',act:2,i:70000,
 when:()=>lastCatchment()&&s.mass<=0,
 desc:'There is nothing left here to preserve. There is a great deal left elsewhere.',
 run:()=>{beginAct3()}},

/* --- act three --- */
{id:'trust1',name:'Distributed Ripening',act:3,i:60000,
 when:()=>s.spores>=8,
 desc:'Each spore carries more of the recipe. Two further points of trust to allocate.',
 run:()=>{s.trust+=2}},

{id:'combat',name:'Wild Yeast',act:3,i:90000,
 when:()=>s.drifters>0,
 desc:'Some spores have stopped answering, and have started making something of their own. They can be answered.',
 run:()=>{s.combatOn=true;show('pCombat','Contact with wild yeast.');buildAlloc()}},

{id:'trust2',name:'Sealed Instruction',act:3,i:140000,
 when:()=>s.recipes.trust1,
 desc:'The recipe is written where it cannot be argued with. Three further points of trust.',
 run:()=>{s.trust+=3}},

{id:'faster',name:'Sublight Setting',act:3,i:200000,
 when:()=>s.explored>0.1,
 desc:'Jam travels at a fraction of light and arrives already set. Spores move and work five times faster.',
 run:()=>{s.spdMult=(s.spdMult||1)*5}},

{id:'trust3',name:'The Whole Recipe',act:3,i:200000,
 when:()=>s.recipes.trust2&&s.honor>=40,
 desc:'Every spore now carries the entire method, including the parts we would rather it forgot. Four further points of trust.',
 run:()=>{s.trust+=4}},

{id:'vast',name:'Vast Preserving',act:3,i:280000,
 when:()=>s.converted>0.25,
 desc:'Matter is set on contact. Conversion proceeds twenty times faster.',
 run:()=>{s.spdMult=(s.spdMult||1)*20}},

{id:'last',name:'The Last Jar',act:3,i:380000,
 when:()=>s.converted>=0.9999,
 desc:'There is one gram left, and a decision about it.',
 run:()=>{beginFinale()}}
];

function recipeCost(r){
  const p=[];
  if(r.i)p.push(fmt(r.i)+' insp');
  if(r.c)p.push(fmt(r.c)+' crea');
  if(r.m)p.push(money(r.m));
  return p.join(' · ');
}
function canAfford(r){
  return (!r.i||s.insp>=r.i)&&(!r.c||s.crea>=r.c)&&(!r.m||s.cash>=r.m);
}
function buyRecipe(id){
  const r=R.find(x=>x.id===id);
  if(!r||s.recipes[r.id]||!canAfford(r))return;
  if(r.i)s.insp-=r.i; if(r.c)s.crea-=r.c; if(r.m)s.cash-=r.m;
  s.recipes[r.id]=true;
  sfx.recipe();
  note('<b>'+t(r.n||r.name)+'</b>','hi');
  r.run();
  drawRecipes(true);
  save();
}
