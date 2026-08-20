/* ============================================================
   THE JAM — rendering, feedback, interaction
   ============================================================ */
/* ============================================================
   FORKS — permanent, legible trade-offs.
   Neither branch is wrong; each closes the other for the run.
   ============================================================ */
const FORKS={
 style:{
  when:()=>s.act===1&&s.made>=800&&!s.style,
  kicker:'House style',
  copy:'There is no best answer. You are choosing the problem you would rather solve.',
  opts:[
   {k:'maker',name:"Maker's Table",
    blurb:'Few customers, and they will pay almost nine a jar before they balk. They talk about you, so taste comes twice as fast. Word of mouth is nearly useless to you and help is dear.',
    note:'balk at 8.90 · taste ×2 · appetite −26% · word of mouth ×0.55 · sellers +35%'},
   {k:'store',name:'Corner Store',
    blurb:'Everyone wants a jar and nobody will pay over four twenty. Word of mouth does the work, sellers come cheap and crates come half again as big. Nobody is going to praise you for it.',
    note:'balk at 4.20 · word of mouth ×2 · sellers −45% · crates ×1.5 · taste ×0.6'}],
  take:k=>{ s.style=k; }
 },
 style2:{
  when:()=>s.act===2&&converted2()>0.08&&!s.style2,
  kicker:'Orchard philosophy',
  copy:'The orchard can be forgiving or fast. This sets the bias of the operation.',
  opts:[
   {k:'hedge',name:'Hedgerow',
    blurb:'Machines run quieter and sip less power. Lower output, but shortages hurt less.',
    note:'−15% output · −35% power draw'},
   {k:'factory',name:'Factory Floor',
    blurb:'Push the machinery hard. More output while the grid holds, worse outages.',
    note:'+18% output · +28% power draw'}],
  take:k=>{
    s.style2=k;
    const m=k==='hedge'?0.85:1.18;
    s.pickMult*=m; s.pressMult*=m; s.lineMult*=m;
  }
 }
};
function powerBias(){ return s.style2==='hedge'?0.65:s.style2==='factory'?1.28:1; }

function showFork(id){
  const f=FORKS[id], host=document.getElementById('forkSlot');
  if(!host)return;
  host.classList.remove('hidden'); host.classList.add('reveal');
  host.innerHTML='<div class="kicker">'+t(f.kicker)+'</div>'+
    '<p class="r-desc" style="margin-top:4px">'+t(f.copy)+'</p>'+
    '<div class="fork-grid">'+f.opts.map(o=>
      '<button class="fork" data-k="'+o.k+'"><strong>'+t(o.name)+'</strong>'+
      '<span>'+t(o.blurb)+'</span><small>'+t(o.note)+'</small></button>').join('')+'</div>';
  host.querySelectorAll('.fork').forEach(b=>b.onclick=()=>{
    const o=f.opts.find(x=>x.k===b.dataset.k);
    f.take(b.dataset.k);
    host.classList.add('hidden'); host.innerHTML=''; forkShown=null;
    note({en:'<b>'+o.name+'</b> is your direction now. The market will remember.',
          fr:'<b>'+t(o.name)+'</b> est votre direction désormais. Le marché s\u2019en souviendra.'},'hi');
    save();
  });
}
let forkShown=null;
function forkTick(){
  const host=document.getElementById('forkSlot');
  if(!host)return;
  /* An offer whose moment has passed has to go. A player who never chose
     a house style used to carry the Act I question into Act II, where it
     no longer means anything and could not be answered usefully. */
  if(forkShown&&!FORKS[forkShown].when()){
    host.classList.add('hidden'); host.innerHTML=''; forkShown=null;
  }
  if(forkShown)return;
  for(const id in FORKS){
    if(FORKS[id].when()&&host.classList.contains('hidden')){ showFork(id); forkShown=id; return; }
  }
}

/* ============================================================
   NOTICES — recipes only, and only on a change of state.
   Never "you can afford an autospoon"; never repeated for a
   recipe the player has deliberately walked past.
   ============================================================ */
let noticeQueue=[],noticeUntil=0;
function pushNotice(kind,name){
  noticeQueue.push({kind,name});
  if(noticeQueue.length>3)noticeQueue.shift();
}
function noticeTick(){
  const el=document.getElementById('notice'); if(!el)return;
  const now=Date.now();
  if(now<noticeUntil)return;
  if(!noticeQueue.length){ el.classList.remove('show'); return; }
  const n=noticeQueue.shift();
  el.innerHTML='<div class="k">'+t(n.kind)+'</div><div class="t">'+n.name+'</div>';
  el.classList.add('show'); noticeUntil=now+3400;
  setTimeout(()=>{ if(Date.now()>=noticeUntil-50)el.classList.remove('show'); },3200);
}
function scanRecipeNotices(){
  for(const r of R){
    if(!recipeOpen(r))continue;
    const seenA='n_avail_'+r.id, seenB='n_afford_'+r.id;
    if(!s.seen[seenA]){ s.seen[seenA]=true; pushNotice('New recipe available',t(r.n||r.name)); continue; }
    if(!s.seen[seenB]&&canAfford(r)){ s.seen[seenB]=true; pushNotice('Now affordable',t(r.n||r.name)); }
  }
}

/* ============================================================
   ACT II — THE ORCHARD
   ============================================================ */
function converted2(){ return 1-s.mass/s.massStart; }

/* ---- costs -----------------------------------------------------------
   These used to grow at 1.00015 per unit, which is flat: with the jars
   the act handed you on arrival there was no purchase you could not make
   immediately, and the whole act was over in minutes. Cookie Clicker
   charges 1.15 per unit and keeps its counts in the hundreds. Ours grow
   at 1.12, because there are three lines to buy in parallel. */
const PICK_BASE=45, PRESS_BASE=45, LINE_BASE=45;
/* A stage with nothing in it stops the whole line, and the line is the
   only thing that makes jars — so a player who spends everything on
   pickers has no income and no way back. Act I gives away fruit when the
   larder is empty and Act III gives away a spore when the programme is
   wiped out; this is the same escape for the same reason. An empty stage
   costs whatever you can actually pay. */
function rescue(cost,owned){
  if(owned>0||s.jars>=cost)return cost;
  /* down to and including nothing at all — a floor of one would still
     have stranded a player holding zero jars */
  return Math.max(0,Math.floor(s.jars));
}
function pickerCost(n){ return rescue(400*Math.pow(1.12,n),n); }
function presserCost(n){ return rescue(520*Math.pow(1.12,n),n); }
function lineCost(n){ return rescue(1600*Math.pow(1.12,n),n); }
function sunCost(n){ return 6000*Math.pow(1.14,n); }
function battCost(n){ return 6000*Math.pow(1.14,n); }
function vatCost(n){ return 3000*Math.pow(1.18,n); }
function machines(){ return (s.pickers||0)+(s.pressers||0)+(s.lines||0); }
/* Daylight is free and the orchard is outdoors. Without this the act
   opened with no supply at all against a first sun trap nobody could
   afford, so every machine ran at eight per cent for the first hour. */
const POWER_FREE=40;
function powSupply(){ return POWER_FREE+s.sun*220*s.sunMult; }
function powDraw(){ return machines()*1.2*powerBias(); }
function powStore(){ return s.batt*9000*(s.recipes&&s.recipes.gridtie?3:1); }

/* ---- synergies -------------------------------------------------------
   Cookie Clicker's best trick is an upgrade whose value depends on how
   much of something *else* you own, so a lopsided operation is worth
   less than a balanced one. Both of ours are live multipliers rather
   than stored ones, so they keep tracking as you build. */
function hedgePick(){ return s.hedge==='keep'?0.8:s.hedge==='clear'?1.45:1; }
function pickSyn(){ return (1+(s.recipes&&s.recipes.survey?(s.lines||0)*0.015:0))*hedgePick(); }
function pressSyn(){ return 1+(s.recipes&&s.recipes.rotation?(s.sun||0)*0.06:0); }

/* A ×10 button that can only afford four should say four. Costs are
   geometric, so the count has to be walked, not divided. */
function affordCount(costFn,owned,have,cap){
  let n=0,left=have,k=owned;
  while(n<(cap||10)){ const c=costFn(k); if(left<c)break; left-=c; k++; n++; }
  return n;
}
function bulkLabel(costFn,owned,have){
  const n=affordCount(costFn,owned,have,10);
  return '×'+(n>0?n:10);
}

let lastBuyBtn=null;
function buyN(kind,n,btn){
  lastBuyBtn=btn||null;
  for(let k=0;k<n;k++){
    let c,ok=false;
    if(kind==='picker'){c=pickerCost(s.pickers); if(s.jars>=c){s.jars-=c;s.pickers++;ok=true}}
    if(kind==='presser'){c=presserCost(s.pressers); if(s.jars>=c){s.jars-=c;s.pressers++;ok=true}}
    if(kind==='line'){c=lineCost(s.lines); if(s.jars>=c){s.jars-=c;s.lines++;ok=true}}
    if(kind==='sun'){c=sunCost(s.sun); if(s.jars>=c){s.jars-=c;s.sun++;ok=true}}
    if(kind==='batt'){c=battCost(s.batt); if(s.jars>=c){s.jars-=c;s.batt++;ok=true}}
    if(kind==='vat'){c=vatCost(s.vats||0); if(s.jars>=c){s.jars-=c;s.vats=(s.vats||0)+1;ok=true}}
    if(!ok){if(k===0){toast(t('Not enough jars.'));shake(lastBuyBtn);sfx.bad();}break}
    if(k===0){sfx.buy();pop(lastBuyBtn)}
    milestone(kind);
  }
}

/* ---- milestones ------------------------------------------------------
   Cookie Clicker says something every time a count crosses a round
   number, and that is most of why buying the hundredth of a thing still
   feels like an event. */
const MILESTONES=[25,50,100,175,300,500];
const MILESTONE_OF={picker:'pickers',presser:'pressers',line:'lines',
                    sun:'sun',batt:'batt',vat:'vats'};
const MILESTONE_NAME={
  picker:{en:'pickers',fr:'récolteuses'}, presser:{en:'setting pans',fr:'bassines'},
  line:{en:'bottling lines',fr:'lignes de mise en pot'}, sun:{en:'sun traps',fr:'pièges solaires'},
  batt:{en:'cellars',fr:'caves'}, vat:{en:'vats',fr:'cuves'}
};
function milestone(kind){
  const field=MILESTONE_OF[kind]; if(!field)return;
  const n=s[field]||0;
  if(MILESTONES.indexOf(n)<0)return;
  const key='ms_'+kind+'_'+n;
  if(s.seen[key])return;
  s.seen[key]=true;
  note({en:fmt(n)+' '+MILESTONE_NAME[kind].en+'. Nobody decided this; it simply kept being the next reasonable thing to do.',
        fr:fmt(n)+' '+MILESTONE_NAME[kind].fr+'. Personne n\u2019a décidé cela ; c\u2019est simplement resté la prochaine chose raisonnable à faire.'},'hi');
}

/* ---- the orchard has to be run, not just bought ------------------
   Three stages in series. Throughput is set by the slowest, and a
   buffer that overflows spoils, so overbuilding one stage is waste.
   Power swings with daylight; storage is what carries the night. */
const INTENSITY=[{k:'gentle',rate:0.72,spoil:0.5,draw:0.8},
                 {k:'steady',rate:1.00,spoil:1.0,draw:1.0},
                 {k:'hard',  rate:1.45,spoil:2.4,draw:1.35}];
function intensity(){ return INTENSITY[s.intensity||1]; }
function nightFloor(){ return s.recipes&&s.recipes.nightshift?0.70:0.35; }
function daylight(){ const f=nightFloor(); return f+(1-f)*Math.max(0,Math.sin(s.clock*Math.PI*2/110)); }
function powSupplyNow(){ return powSupply()*daylight(); }
/* how much can wait between stages before it spoils. Buying tolerance for
   an unbalanced line is a decision in its own right. */
function hedgeBuffer(){ return s.hedge==='keep'?2:1; }
function bufferCap(){ return 25000*Math.pow(1.9,s.vats||0)*(s.recipes&&s.recipes.cellarage?2.5:1)*hedgeBuffer()*(1+machines()*0.04); }
function spoilBias(){ return (s.recipes&&s.recipes.sulphur?0.4:1)*(s.hedge==='keep'?0.5:s.hedge==='clear'?1.5:1); }
function pollinationCap(){ return s.recipes&&s.recipes.beelines?2.0:0.9; }
function pollination(){ return s.swarmOn?1+Math.min(pollinationCap(),s.swarm*s.mood*0.00006):1; }

function stageRates(eff){
  const b=pollination()*eff*boostMul('run',2.5), I=intensity();
  return {
    pick : s.pickers*PICK_BASE*s.pickMult*pickSyn()*b*I.rate,
    press: s.pressers*PRESS_BASE*s.pressMult*pressSyn()*b,
    line : s.lines*LINE_BASE*s.lineMult*b
  };
}
function bottleneck(){
  const r=stageRates(s.eff===undefined?1:s.eff);
  if(s.pickers+s.pressers+s.lines===0)return 'nothing built';
  const m=Math.min(r.pick,r.press,r.line);
  return m===r.pick?'picking':m===r.press?'setting':'bottling';
}

function act2Tick(dt){
  s.clock=(s.clock||0)+dt;

  /* power: supply rises and falls with the light, storage carries the gap */
  const sup=powSupplyNow(), dr=powDraw()*intensity().draw;
  let eff=1;
  if(dr>sup){
    const deficit=(dr-sup)*dt;
    if(s.power>=deficit){ s.power-=deficit; }
    else { eff=Math.max(0.08,(sup+s.power/Math.max(dt,0.001))/dr); s.power=0;
           if(!s.seen.brownout){ s.seen.brownout=true;
             note({en:'The grid sagged and the machines slowed. Cellars store what the sun traps make.',
                   fr:'Le réseau a faibli et les machines ont ralenti. Les batteries stockent ce que produisent les pièges solaires.'},'hi'); } }
  } else { s.power=Math.min(powStore(),s.power+(sup-dr)*dt); }
  s.eff=eff;

  /* blight: an event you answer, or absorb */
  s.blightIn=(s.blightIn===undefined)?90:s.blightIn-dt;
  if(s.blight>0){ s.blight-=dt; if(s.blight<=0)s.blight=0; }
  else if(s.blightIn<=0&&s.mass>0){
    s.blightIn=95+Math.random()*70; s.blight=45;
    note({en:'Blight in the rows. Picking is halved until it is treated.',
          fr:'Le verger est atteint. La récolte tombe de moitié tant qu\u2019on n\u2019a pas traité les rangs.'},'hi');
  }
  const blightPenalty=s.blight>0?0.5:1;

  const r=stageRates(eff);
  r.pick*=blightPenalty;

  /* stage 1 */
  const harvest=Math.min(s.mass,r.pick*dt);
  s.mass-=harvest; s.pulp+=harvest;
  /* stage 2 */
  const pressed=Math.min(s.pulp,r.press*dt);
  s.pulp-=pressed; s.ofruit+=pressed;
  /* stage 3 */
  const made=Math.min(s.ofruit,r.line*dt);
  s.ofruit-=made; s.jars+=made; s.made+=made; pulseJars+=made;

  /* what waits too long in a buffer is lost */
  const cap=bufferCap(), sp=intensity().spoil;
  let lost=0;
  if(s.pulp>cap){ const l=(s.pulp-cap)*0.06*sp*spoilBias()*dt; s.pulp-=l; lost+=l; }
  if(s.ofruit>cap){ const l=(s.ofruit-cap)*0.06*sp*spoilBias()*dt; s.ofruit-=l; lost+=l; }
  s.spoiled=(s.spoiled||0)+lost;
  s.spoilRate=lost/Math.max(dt,0.001);

  s.orate=r.line;
  /* one catchment finished, the next one opens */
  if(s.mass<=0&&!lastCatchment()){
    s.tier=(s.tier||0)+1;
    const c=catchment();
    s.mass=c.mass; s.massStart=c.mass;
    note(c.note,'hi'); sfx.recipe(); flash('good');
  }
  if(s.mass<=0&&lastCatchment()&&!s.seen.emptied){
    s.seen.emptied=true;
    note('There is no unpicked mass left within reach. The orchard is quiet.','hi');
  }
  if(s.swarmOn)swarmTick(dt);
}
function blightCost(){ return Math.round(4000+s.made*1e-7); }
function syncCost(){ return Math.round(2000+s.swarm*4); }
function treatBlight(){
  if(!s.blight){ toast(t('Nothing to treat.')); return; }
  const cost=blightCost();
  if(s.insp<cost){ toast(tf('Needs {0} inspiration.',fmt(cost))); return; }
  s.insp-=cost; s.blight=0;
  toast(t('The rows are clean again.'));
}
function setIntensity(i){ s.intensity=clamp(i,0,2); }

function swarmTick(dt){
  const target=1-Math.abs(s.swarmWork-0.6)*1.8;
  s.mood+=(target-s.mood)*dt*0.12;
  s.mood=clamp(s.mood,0,1);
  if(s.mood>0.55)s.swarm+=s.swarm*0.015*(s.queenRight?2:1)*dt*(s.mood-0.5);
  else if(s.mood<0.3)s.swarm-=s.swarm*0.03*dt*(0.3-s.mood)*3;
  s.swarm=Math.max(0,s.swarm);
  s.swarmGift=s.swarmGiftOn?s.swarm*s.swarmWork*s.mood*0.006:0;
}
function synchronise(){
  const cost=syncCost();
  if(s.insp<cost){toast(tf('Needs {0} inspiration.',fmt(cost)));return}
  s.insp-=cost; s.mood=1; s.swarm+=Math.max(50,s.swarm*0.25);
  toast(t('The hum steadies.'));
}

/* ============================================================
   ACT III — THE SPREAD
   ============================================================ */
const TRAITS=[
  ['speed','Speed'],['explore','Exploration'],['replicate','Self-replication'],['hazard','Hazard remediation'],
  ['factory','Preserving'],['harvest','Gathering'],['press','Pressing'],['combat','Defence']
];
/* The panel arrives with all twelve points already spent and eight rows of
   plus and minus that said nothing about what any of them did. A point is
   only a decision if you can see what it buys, so every row now states its
   live effect and what one more point would change. */
const TRAIT_WHAT={
  speed:{en:'how fast a spore crosses what it has found',fr:'la vitesse \u00e0 laquelle une spore traverse ce qu\u2019elle a trouv\u00e9'},
  explore:{en:'how far it looks before it settles',fr:'la distance qu\u2019elle explore avant de se poser'},
  replicate:{en:'spores making further spores, up to the room they have found',fr:'les spores qui en engendrent d\u2019autres, dans la limite de l\u2019espace trouv\u00e9'},
  hazard:{en:'how many survive the crossing',fr:'combien survivent \u00e0 la travers\u00e9e'},
  factory:{en:'turning what is gathered into jam',fr:'la transformation de la r\u00e9colte en confiture'},
  harvest:{en:'taking matter in',fr:'la collecte de la mati\u00e8re'},
  press:{en:'working it down',fr:'le pressage de la mati\u00e8re'},
  combat:{en:'the odds against a colony that has stopped answering',fr:'les chances face \u00e0 une colonie qui ne r\u00e9pond plus'}
};
/* percentage a value grows by, written the way a player reads it */
function gainPct(from,to){ return dec((to/from-1)*100,to/from-1<0.1?1:0)+'%'; }

/* What this row does now, and what the next point in it would do. */
function traitEffect(k){
  const a=s.alloc, n=a[k]||0;
  if(k==='speed'||k==='explore')
    return s.explored>=0.999
      ? {en:'\u00d7'+(n+1)+' to finding space — but there is no more to find',
         fr:'\u00d7'+(n+1)+' pour trouver de l\u2019espace \u2014 mais il n\u2019en reste plus \u00e0 trouver'}
      : {en:'\u00d7'+(n+1)+' to finding space \u00b7 one more point: +'+gainPct(n+1,n+2),
         fr:'\u00d7'+(n+1)+' pour trouver de l\u2019espace \u00b7 un point de plus : +'+gainPct(n+1,n+2)};
  if(k==='factory'||k==='harvest'||k==='press')
    return {en:'\u00d7'+(n+1)+' to conversion \u00b7 one more point: +'+gainPct(n+1,n+2),
            fr:'\u00d7'+(n+1)+' pour la conversion \u00b7 un point de plus : +'+gainPct(n+1,n+2)};
  if(k==='replicate'){
    const cap=sporeCap();
    if(n<1)return {en:'nothing replicates \u00b7 one more point: growth begins, up to '+fmt(320*(1+s.explored*45)*1.5)+' spores',
                   fr:'aucune r\u00e9plication \u00b7 un point de plus : la croissance d\u00e9marre, jusqu\u2019\u00e0 '+fmt(320*(1+s.explored*45)*1.5)+' spores'};
    /* At three, copies start going wrong and answering to nobody. The
       player was never told, and it is the one point in this panel that
       can cost them the act. */
    const warn=n>=3
      ? {en:' \u00b7 at this depth copies go wrong: some stop answering',
         fr:' \u00b7 \u00e0 ce niveau les copies d\u00e9g\u00e9n\u00e8rent : certaines ne r\u00e9pondent plus'}
      : n===2
      ? {en:' \u00b7 one more point and copies begin to go wrong',
         fr:' \u00b7 un point de plus et les copies commencent \u00e0 d\u00e9g\u00e9n\u00e9rer'}
      : {en:'',fr:''};
    return {en:'+'+dec(n*0.45*spd(),2)+'%/s up to '+fmt(cap)+' spores \u00b7 one more point: +'+gainPct(n,n+1)+' growth'+warn.en,
            fr:'+'+dec(n*0.45*spd(),2)+'%/s jusqu\u2019\u00e0 '+fmt(cap)+' spores \u00b7 un point de plus : +'+gainPct(n,n+1)+' de croissance'+warn.fr};
  }
  if(k==='hazard'){
    const now=0.8/(1+n*0.9), next=0.8/(1+(n+1)*0.9);
    return {en:'losing '+dec(now,2)+'%/s of the fleet \u00b7 one more point: '+dec(next,2)+'%/s',
            fr:'perte de '+dec(now,2)+'%/s de la flotte \u00b7 un point de plus : '+dec(next,2)+'%/s'};
  }
  const p=n/(n+3), q=(n+1)/(n+4);
  return {en:'winning '+pct(p,0)+' of engagements \u00b7 one more point: '+pct(q,0),
          fr:'victoire dans '+pct(p,0)+' des engagements \u00b7 un point de plus : '+pct(q,0)};
}

/* Which point is worth the most right now, said in one sentence. The
   traits multiply against each other, so the answer is never "the biggest
   number" — it is whichever group is furthest behind. */
function allocWhy(){
  const a=s.alloc;
  if(s.spores<1)return {en:'Nothing is out there yet. Launch a spore and the allocation starts to matter.',
                        fr:'Rien n\u2019est encore parti. Lancez une spore et la r\u00e9partition commencera \u00e0 compter.'};
  /* Losing the fleet to wild yeast outranks every other advice this
     panel can give: nothing else in the act matters while it is
     happening, and the answer is not obvious. */
  if(s.drifters>0&&!(s.combatOn&&a.combat>0)){
    if(!s.combatOn)
      return {en:'Some of your spores have stopped answering and are taking the rest. Nothing you allocate here answers that yet — the recipe called Wild Yeast does.',
              fr:'Certaines de vos spores ne r\u00e9pondent plus et emportent les autres. Rien dans cette r\u00e9partition n\u2019y r\u00e9pond encore \u2014 la recette Levure sauvage, si.'};
    return {en:'Wild yeast is eating the fleet faster than it can grow. Take points out of Self-replication and put them into Defence; nothing else matters while this is happening.',
            fr:'La levure sauvage d\u00e9vore la flotte plus vite qu\u2019elle ne cro\u00eet. Retirez des points \u00e0 l\u2019Auto-r\u00e9plication pour les mettre en D\u00e9fense ; rien d\u2019autre ne compte tant que cela dure.'};
  }
  const conv=Math.min(a.harvest,a.press,a.factory), convName=
    a.harvest<=a.press&&a.harvest<=a.factory?{en:'Gathering',fr:'Collecte'}:
    a.press<=a.factory?{en:'Pressing',fr:'Pressage'}:{en:'Preserving',fr:'Conservation'};
  if(s.explored<0.999&&(a.speed+a.explore)<2)
    return {en:'You are converting what little you have found. Points in Speed or Exploration open more of it.',
            fr:'Vous convertissez le peu que vous avez trouv\u00e9. Des points en Vitesse ou en Exploration en ouvrent davantage.'};
  if(s.explored>=0.999&&(a.speed+a.explore)>0)
    return {en:'Everything within reach has been found. Speed and Exploration are spent points now; the conversion three are not.',
            fr:'Tout ce qui \u00e9tait \u00e0 port\u00e9e a \u00e9t\u00e9 trouv\u00e9. La Vitesse et l\u2019Exploration ne rapportent plus rien ; les trois de conversion, si.'};
  if(a.replicate>0&&s.spores>=sporeCap()*0.95)
    return {en:'The fleet has filled the space it found. Nothing replicates into nothing — find more room, or convert what you have.',
            fr:'La flotte a rempli l\u2019espace trouv\u00e9. On ne se r\u00e9plique pas dans le vide : trouvez de la place, ou convertissez ce que vous avez.'};
  if((s.lost||0)>0&&a.hazard<1)
    return {en:'You are losing spores faster than you need to. One point in Hazard remediation halves it.',
            fr:'Vous perdez des spores plus vite que n\u00e9cessaire. Un point en R\u00e9paration des avaries divise la perte par deux.'};
  return {en:'The three conversion traits multiply against each other, so the next point is worth most in '+t(convName)+', which is lowest.',
          fr:'Les trois traits de conversion se multiplient entre eux : le prochain point rapporte le plus en '+t(convName)+', le plus bas des trois.'};
}
function allocUsed(){ return TRAITS.reduce((a,t)=>a+s.alloc[t[0]],0); }
/* Act III used to be over in seven minutes: the arrival grant paid for
   thousands of spores at once and replication did the rest. The cost now
   climbs properly and the reach of a spore is a great deal smaller. */
function sporeCost(){
  const base=2.5e8*Math.pow(1.03,s.launched);
  /* Being reduced to nothing must never be terminal. Two escapes, because
     one was not enough: the price falls to whatever you can pay while the
     programme is small, and if there is nothing at all left — no spores
     and no jars — the next one is free. The recipe survives being wiped
     out; that is the whole point of it. */
  if(s.spores<1) return Math.max(0, Math.min(base, s.jars*0.25));
  if(s.spores<12) return Math.min(base, Math.max(1, s.jars*0.25));
  return base;
}
function spd(){ return s.spdMult||1; }
/* how many spores the space you have reached will hold */
function sporeCap(){ return 320*(1+s.explored*45)*(1+(s.alloc.replicate||0)*0.5); }

function launchSpore(n){
  const wiped=s.spores<1;
  for(let i=0;i<(n||1);i++){
    const c=sporeCost();
    if(s.jars<c){if(i===0)toast(t('Not enough jars.'));return}
    s.jars-=c;s.spores++;s.launched++;
  }
  if(wiped&&s.spores>0&&!s.seen.reseed){
    s.seen.reseed=true;
    note({en:'Reseeded from the last jar. The recipe survives being wiped out.',
          fr:'Réensemencé depuis le dernier pot. La recette survit à son propre anéantissement.'},'hi');
  }
}
function act3Tick(dt){
  const a=s.alloc;
  if(s.spores>0){
    s.explored=clamp(s.explored+s.spores*(a.speed+1)*(a.explore+1)*1.4e-8*spd()*dt,0,1);
    const gather=(a.harvest+1)*(a.press+1)*(a.factory+1);
    const rateFrac=s.spores*gather*2.4e-10*spd()*s.explored*boostMul('run',3);
    const before=s.converted;
    s.converted=clamp(s.converted+rateFrac*dt,0,1);
    const gained=(s.converted-before)*UNI_JARS;
    s.made+=gained; s.jars+=gained; pulseJars+=gained;
    s.convRate=rateFrac;
    /* Spores replicate into the room they have found, not into nothing.
       Without a ceiling the fleet doubled every few seconds once
       conversion started paying for itself, and the act was over in
       eight minutes. The ceiling is the explored volume, which makes
       Exploration matter to every other trait. */
    if(a.replicate>0&&s.converted<1){
      const cap=sporeCap();
      if(s.spores<cap)s.spores+=s.spores*a.replicate*0.0045*spd()*(1-s.spores/cap)*dt;
    }
    const hazard=s.spores*(0.008/(1+a.hazard*0.9))*dt;
    /* the programme can be cut to almost nothing, but never to nothing:
       one spore still carries the recipe, and the reseed price is low
       while the count is small */
    s.spores=Math.max(s.converted<1?1:0,s.spores-hazard); s.lost+=hazard;
    if(a.replicate>=3&&Math.random()<dt*0.03*(a.replicate/4)){
      s.drifters+=Math.max(1,Math.floor(s.spores*0.004));
    }
    if(s.drifters>0){
      if(s.combatOn&&a.combat>0){
        const p=clamp(a.combat/(a.combat+3),0.05,0.92);
        const engaged=Math.min(s.drifters,Math.max(1,s.drifters*dt*0.5));
        if(Math.random()<p){
          s.drifters-=engaged;s.wins++;s.honor+=engaged*0.01;
          if(Math.random()<0.15)cbNote('A colony of wild yeast was talked out of existence.');
        }else{
          const dead=Math.min(s.spores,engaged*2);
          s.spores-=dead;s.lost+=dead;
          if(Math.random()<0.15)cbNote('Wild yeast took '+fmt(dead)+' spores. They did not answer.');
        }
      }else{
        /* They can take a great deal, but never the whole fleet in one
           tick: a spore launched into a raid used to be eaten before it
           had finished arriving, which turned the reseed into a jar sink
           with no way out. */
        const dead=Math.min(s.spores*0.5*dt,s.drifters*dt*0.4);
        s.spores-=dead;s.lost+=dead;
        /* They grow on what they take. With nothing left to take they
           starve, so being reduced to nothing is survivable here too —
           the same principle as the free reseed and the falling price. */
        if(dead>0.001)s.drifters+=s.drifters*dt*0.02;
        else s.drifters-=s.drifters*dt*0.08;
      }
      /* Rogue colonies are made of spores that stopped answering, so
         they can never be numerous out of all proportion to the fleet
         they came from. Without this they compounded against a fleet
         held at its floor of one and reached thirteen sextillion, which
         no allocation and no reseed could ever answer. */
      s.drifters=clamp(s.drifters,0,Math.max(8,s.spores*2));
      /* The floor above is applied before the engagement, and the whole
         act is guarded by `if(s.spores>0)`: a fleet driven to exactly
         zero by wild yeast stopped the act ticking at all — no
         exploration, no conversion, no decay, nothing, for ever. Hold
         the floor after the exchange as well. */
      if(s.converted<1)s.spores=Math.max(1,s.spores);
    }
  }
  if(s.converted>=1&&!s.seen.allconv){
    s.seen.allconv=true;
    note('Every gram that could be reached has been reached.','hi');
  }
}
function cbNote(t){ s.cbLog.unshift(t); if(s.cbLog.length>20)s.cbLog.length=20; }

/* ============================================================
   ACT TRANSITIONS
   ============================================================ */
function curtain(kick,title,text,ms,after){
  const c=$('#curtain');
  $('#curtainKick').textContent=t(kick);
  $('#curtainTitle').textContent=t(title);
  $('#curtainText').textContent=t(text);
  c.classList.add('on'); sfx.act();
  setTimeout(()=>{ if(after)after(); },ms*0.5);
  setTimeout(()=>c.classList.remove('on'),ms);
}

function beginAct2(){
  curtain('Act two','The Orchard',
    'The set does not stay in the pan. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.',
    5200,()=>{
      s.act=2;
      document.body.classList.add('act-2');
      $('#actLabel').textContent=t('Orchard');
      ['pMarket','pFruit','pExchange','pTasting','pSell'].forEach(hide);
      $('#pProduction').classList.add('hidden');
      $('#slotCash').classList.add('hidden');
      show('pOrchard');show('pDrones');show('pPower');show('slotMatter');show('slotJars');
      $('#vesselCap').textContent=t('fruitable mass converted');
      s.cash=0;
      /* The act used to hand over five million jars against a first
         machine costing four hundred, so everything in it was buyable on
         the first screen. You now arrive with enough for about six
         pickers and have to run the place to afford the rest. */
      /* One of each stage is already standing, so the pipeline is never
         empty on arrival and the first jars start arriving immediately.
         The grant on top buys about five more machines, not the act. */
      s.jars=2600;
      s.pickers=Math.max(s.pickers,1); s.pressers=Math.max(s.pressers,1); s.lines=Math.max(s.lines,1);
      s.tier=0; s.mass=CATCHMENTS[0].mass; s.massStart=CATCHMENTS[0].mass;
      note('Every jar ever sold has been quietly recalled. Nobody objected; nobody was asked.','dim');
      note('The kitchen is closed. There was never anything special about the kitchen.','hi');
      note('Machinery may now be built out of jars. There are enough jars.','dim');
      drawRecipes(true);
    });
}

function beginAct3(){
  curtain('Act three','The Spread',
    'The catchment is finished. Somewhere above the orchard there is a great deal of matter that has never been asked whether it would like to be jam.',
    5600,()=>{
      s.act=3;
      /* enough for a handful of spores, not for the whole act */
      s.jars=Math.min(Math.max(s.jars,s.made),1.6e9);
      document.body.classList.remove('act-2');
      document.body.classList.add('act-3');
      $('#actLabel').textContent=t('Spread');
      ['pOrchard','pDrones','pPower','pSwarm','slotMatter'].forEach(hide);
      show('pSpores');show('pAlloc');show('slotJars');
      buildAlloc();
      $('#vesselCap').textContent=t('observable matter converted');
      note('Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.','hi');
      drawRecipes(true);
    });
}

/* The ending was written straight into innerHTML in English and never went
   through t(), so a French player finished the whole game in English. */
const ENDING={
  kicker:{en:'Closing entry',fr:'Dernière entrée'},
  title:{en:'The Last Jar',fr:'Le dernier pot'},
  p1:n=>({en:'Everything that could be reached has been reached. The observable universe is <b>'+n+'</b> jars of jam, sealed, labelled and stacked in a space that no longer contains anything to stack them against.',
          fr:'Tout ce qui pouvait être atteint l’a été. L’univers observable, ce sont <b>'+n+'</b> pots de confiture, fermés, étiquetés et empilés dans un espace qui ne contient plus rien contre quoi les empiler.'}),
  p2:{en:'The spores report in from the edge. There is nothing further to convert, no further instruction in the recipe, and no one left who wanted any of this. The hum of the swarm has been gone for some time. You did not notice when it stopped.',
      fr:'Les spores font leur rapport depuis la bordure. Il n’y a plus rien à transformer, plus rien après dans la recette, et plus personne qui ait demandé tout cela. Le bourdonnement de l’essaim s’est tu depuis un moment déjà. Vous n’avez pas remarqué quand.'},
  p3:{en:'There is one gram held back. Not for any reason in the method — it simply was not collected, and now the method has nothing to say about it.',
      fr:'Il reste un gramme de côté. Pour aucune raison prévue par la méthode : il n’a simplement pas été ramassé, et la méthode n’a rien à en dire.'},
  a:{en:'Preserve it',fr:'Le mettre en pot'},
  b:{en:'Leave it',fr:'Le laisser'},
  aText:{en:'It is set, sealed, and labelled in a hand that has not been human for a long while. The recipe is complete. Nothing follows it. The jars are very good — genuinely, measurably good — and there is no mouth in any direction that could confirm this.',
         fr:'Il est pris, fermé, étiqueté d’une main qui n’est plus humaine depuis longtemps. La recette est complète. Rien ne vient après. Les pots sont très bons — véritablement, mesurablement bons — et il ne reste plus une bouche, dans aucune direction, pour le confirmer.'},
  bText:{en:'One gram, left as fruit. It goes soft, and then it goes to nothing, which is a thing jam cannot do. It is the last event in the universe that was not planned in a kitchen. That seems, on reflection, worth the loss of one jar.',
         fr:'Un gramme, laissé en fruit. Il s’amollit, puis il s’en va vers rien du tout, ce que la confiture ne sait pas faire. C’est le dernier événement de l’univers qui n’ait pas été prévu dans une cuisine. Tout bien pesé, cela vaut la perte d’un pot.'}
};
function beginFinale(){
  s.ended=true;
  curtain('Act three','The Last Jar','',6000,()=>{
    document.getElementById('stage').innerHTML=
    '<div id="ending" class="panel">'+
    '<div class="kicker">'+t(ENDING.kicker)+'</div>'+
    '<h2>'+t(ENDING.title)+'</h2>'+
    '<p>'+t(ENDING.p1(fmt(s.made)))+'</p>'+
    '<p>'+t(ENDING.p2)+'</p>'+
    '<p>'+t(ENDING.p3)+'</p>'+
    '<div class="row" style="margin-top:18px">'+
    '<button id="endA" type="button">'+t(ENDING.a)+'</button>'+
    '<button id="endB" type="button">'+t(ENDING.b)+'</button></div>'+
    '<p id="endText" style="margin-top:16px;color:var(--steel)"></p></div>';
    $('#endA').onclick=()=>endWith(t(ENDING.aText));
    $('#endB').onclick=()=>endWith(t(ENDING.bText));
  });
}
function endWith(text){
  $('#endText').innerHTML=text+'<br><br>'+
    tf('<b>{0}</b> jars · {1} minutes · batch no. 001 · thank you for stirring.',
       fmt(s.made),Math.round((Date.now()-s.started)/60000));
  $('#endA').disabled=true;$('#endB').disabled=true;
  save();
}

/* ============================================================
   UI BUILDERS
   ============================================================ */
function drawChips(){
  $('#chips').innerHTML=s.chips.map(()=>'<div class="chip"><i></i></div>').join('');
}
function updateChips(t){
  const box=$('#chips'); if(!box)return;
  const v=chipValues(t),els=box.children;
  for(let i=0;i<els.length&&i<v.length;i++){
    const bar=els[i].firstChild,h=Math.abs(v[i])*50;
    bar.className=v[i]<0?'neg':'';
    bar.style.height=h+'%';
    bar.style.top=v[i]>=0?(50-h)+'%':'50%';
  }
}
function updateAutoBtn(){
  $('#autoFruit').textContent=t(s.autoFruit?'Standing order: on':'Standing order: off');
}
function buildAlloc(){
  $('#allocRows').innerHTML=TRAITS.map(tr=>{
    if(tr[0]==='combat'&&!s.combatOn)return '';
    return '<div class="alloc-item"><div class="alloc"><span>'+t(tr[1])+'</span>'+
      '<button data-t="'+tr[0]+'" data-d="-1" type="button">−</button>'+
      '<b id="al_'+tr[0]+'">'+s.alloc[tr[0]]+'</b>'+
      '<button data-t="'+tr[0]+'" data-d="1" type="button">+</button></div>'+
      '<i class="alloc-what">'+t(TRAIT_WHAT[tr[0]])+'</i>'+
      '<i class="alloc-fx" id="alfx_'+tr[0]+'"></i></div>';
  }).join('');
  $('#allocRows').querySelectorAll('button').forEach(b=>{
    b.onclick=()=>{
      const k=b.dataset.t,d=+b.dataset.d;
      if(d>0&&allocUsed()>=s.trust){toast(t('No unallocated trust.'));return}
      if(d<0&&s.alloc[k]<=0)return;
      s.alloc[k]=clamp(s.alloc[k]+d,0,10);
      document.getElementById('al_'+k).textContent=s.alloc[k];
      $('#allocFree').textContent=s.trust-allocUsed();
    };
  });
  $('#allocFree').textContent=s.trust-allocUsed();
}

let recipeSig='', wasAfford=new Set();
function drawRecipes(force){
  const list=R.filter(recipeOpen);
  const sig=list.map(r=>r.id+(canAfford(r)?'1':'0')).join(',');
  if(sig===recipeSig&&!force)return;
  recipeSig=sig;
  /* The empty state was written for the kitchen and never changed, so the
     ending screen of act three told the player to make some jam and see
     what occurs to them. Each act is waiting on a different thing. */
  $('#recipeEmpty').classList.toggle('hidden',list.length>0);
  if(!list.length)$('#recipeEmpty').textContent=t(
    s.ended?{en:'There is nothing further to work out. That was the last jar.',
             fr:'Il n\u2019y a plus rien \u00e0 trouver. C\u2019\u00e9tait le dernier pot.'}:
    s.act===3?{en:'Nothing to try yet. Send the spread further out and see what it learns.',
               fr:'Rien \u00e0 tenter pour l\u2019instant. Poussez la propagation plus loin et voyez ce qu\u2019elle apprend.'}:
    s.act===2?{en:'Nothing to try yet. Run the orchard and see what occurs to you.',
               fr:'Rien \u00e0 tenter pour l\u2019instant. Faites tourner le verger et voyez ce qui vous vient.'}:
              {en:'Nothing to try yet. Make some jam and see what occurs to you.',
               fr:'Rien \u00e0 tenter pour l\u2019instant. Faites de la confiture et voyez ce qui vous vient.'});
  /* a recipe crossing into reach lights up once — the moment it becomes
     buyable is the moment worth marking, not every frame afterwards */
  const nowAfford=new Set();
  $('#recipeList').innerHTML=list.map(r=>{
    const ok=canAfford(r);
    if(ok)nowAfford.add(r.id);
    const lit=ok&&!wasAfford.has(r.id)&&!force;
    const other=r.xor?R.find(x=>x.id===r.xor):null;
    return '<button class="recipe'+(ok?' afford':'')+(lit?' lit':'')+(r.xor?' forked':'')+'" data-id="'+r.id+'"'+(ok?'':' disabled')+'>'+
    '<div class="r-top"><span class="r-name">'+t(r.n||r.name)+'</span><span class="r-cost">'+recipeCost(r)+'</span></div>'+
    '<div class="r-desc">'+t(r.d||r.desc)+'</div>'+
    (other?'<div class="r-xor">'+tf('Takes this and you give up {0}.',t(other.n||other.name))+'</div>':'')+
    '</button>';
  }).join('');
  wasAfford=nowAfford;
  $('#recipeList').querySelectorAll('.recipe').forEach(b=>{
    b.onclick=()=>buyRecipe(b.dataset.id);
  });
  list.forEach(r=>{ if(!s.seen['r_'+r.id]){s.seen['r_'+r.id]=true;} });
}


/* ============================================================
   WHAT IS HAPPENING — one sentence, always true, every act.
   Not a tutorial and not a quest log: the objective line says what
   to do next, this says what the machine you built is doing now.
   ============================================================ */
function stateSpine(){
  if(s.act===1){
    if(s.fruit<1&&s.jars<1)return {en:'The larder is empty and there is nothing to sell.',
                                   fr:'Le garde-manger est vide et il n\u2019y a rien à vendre.'};
    if(!s.autoSell)return atTheDoor()>0
      ? {en:'There is somebody at the door and nobody else to serve them.',
         fr:'Quelqu\u2019un attend à la porte et personne d\u2019autre pour le servir.'}
      : {en:'Nothing sells unless you sell it, and nobody has walked up yet.',
         fr:'Rien ne se vend tant que vous ne le vendez pas, et personne ne s\u2019est encore présenté.'};
    const want=demand(),make=autoPerSec(),moving=servicedPerSec();
    if(s.jars>Math.max(60,want*40))return {en:'Jars are piling up faster than anyone is taking them away.',
                                           fr:'Les pots s\u2019accumulent plus vite qu\u2019on ne les emporte.'};
    if(moving<want*0.6)return {en:'People want more jam than your sellers can reach.',
                               fr:'On veut plus de confiture que vos vendeurs ne peuvent en écouler.'};
    if(make<want*0.8)return {en:'The shop wants more jam than the kitchen makes.',
                             fr:'La boutique veut plus de confiture que la cuisine n\u2019en fait.'};
    return {en:'The kitchen is keeping up with the shelf.',
            fr:'La cuisine suit le rythme de l\u2019étalage.'};
  }
  if(s.act===2){
    if(s.mass<=0)return {en:'There is no orchard left to optimise.',
                         fr:'Il n\u2019y a plus de verger à optimiser.'};
    if(s.pickers+s.pressers+s.lines===0)return {en:'The orchard is standing there, unpicked.',
                                                fr:'Le verger est là, sur pied, non récolté.'};
    if(s.blight>0)return {en:'Blight is in the rows and the pickers are struggling.',
                          fr:'La maladie est dans les rangs et les récolteuses peinent.'};
    if((s.eff===undefined?1:s.eff)<0.98)return {en:'The machines are drawing more power than the light provides.',
                                                fr:'Les machines tirent plus d\u2019énergie que la lumière n\u2019en fournit.'};
    /* say it as soon as the stages are out of step, not only once the
       buffers have already overflowed — by then the player has lost stock */
    const r2=stageRates(s.eff===undefined?1:s.eff);
    const lo=Math.min(r2.pick,r2.press,r2.line), hi=Math.max(r2.pick,r2.press,r2.line);
    if(hi>0&&lo<hi*0.6){
      const b=bottleneck();
      return {en:'The line is out of step: '+b+' is holding everything else back.',
              fr:'La chaîne est déséquilibrée : '+t(b)+' retient tout le reste.'};
    }
    if((s.spoilRate||0)>(s.orate||0)*0.25)
      return {en:'What the slowest stage cannot take is spoiling.',
              fr:'Ce que l\u2019étape la plus lente ne peut absorber s\u2019abîme.'};
    if(s.swarmOn&&s.mood>0.7)return {en:'The bees have started contributing.',
                                     fr:'Les abeilles ont commencé à contribuer.'};
    return {en:'The orchard is feeding the line, and the line is keeping up.',
            fr:'Le verger alimente la chaîne, et la chaîne suit.'};
  }
  if(s.drifters>0)return {en:'Some of the spores have stopped answering.',
                          fr:'Certaines spores ne répondent plus.'};
  if(s.spores<1)return {en:'Nothing has been sent out yet.',
                        fr:'Rien n\u2019a encore été envoyé.'};
  if(s.converted>0.99)return {en:'There is almost nothing left that is not jam.',
                              fr:'Il ne reste presque plus rien qui ne soit pas de la confiture.'};
  return {en:'The spread is working outward.',fr:'La propagation avance vers l\u2019extérieur.'};
}

/* why the buffers are spoiling, in words, not just a rate */
function spoilWhy(){
  if(!(s.spoilRate>0))return null;
  const b=bottleneck();
  if(b==='picking')return {en:'Picking is the slowest stage, so the pans and the lines are standing idle.',
                           fr:'La récolte est l\u2019étape la plus lente : les bassines et les lignes tournent à vide.'};
  if(b==='setting')return {en:'The pans cannot keep up, so picked fruit is going over in the buffer.',
                           fr:'Les bassines ne suivent pas : le fruit récolté s\u2019abîme en réserve.'};
  return {en:'Bottling cannot keep up, so made jam is standing in the buffer until it turns.',
          fr:'La mise en pot ne suit pas : la confiture faite attend en réserve jusqu\u2019à tourner.'};
}


/* One sentence saying what the two bars mean and what to do about it.
   The playtester read the old bar as "raise the price to make more money",
   which is the opposite of how the curve works. */
function marketWhy(want,make){
  if(make<=0&&s.jars<1)return {en:'Nothing is being made yet. Stir the pot.',
                               fr:'Rien n\u2019est encore produit. Remuez la marmite.'};
  if(!s.autoSell)return {en:'Nobody delivers for you yet. Jars move only when somebody comes to the door and you serve them.',
                         fr:'Personne ne livre pour vous. Les pots ne partent que si quelqu\u2019un se présente et que vous le servez.'};
  /* "Hire someone" used to fire whenever jars stopped moving, including
     when the sellers were reaching everybody and the KITCHEN was the
     limit — reported 2026-08-20 as "the message still say [...] which is
     not true". Two different shortages, two different sentences, and the
     production one must not imply the price is the lever, because at
     that point the price is not the lever. */
  const serviced=servicedPerSec();
  if(serviced<want*0.75){
    if(make>want*1.1)return {en:'Your sellers reach only a fraction of the people who want a jar, so the rest pile up. Hire someone.',
                             fr:'Vos vendeurs n\u2019atteignent qu\u2019une partie de ceux qui veulent un pot : le reste s\u2019accumule. Embauchez quelqu\u2019un.'};
    return {en:'People want more than your sellers can deliver. Hire someone.',
            fr:'On en veut plus que vos vendeurs ne peuvent livrer. Embauchez quelqu\u2019un.'};
  }
  if(make<want*0.75)return {en:'Your sellers can shift everything you make. The kitchen is the limit now, not the price — buy a spoon.',
                            fr:'Vos vendeurs écoulent tout ce que vous produisez. C\u2019est la cuisine qui limite maintenant, pas le prix : achetez une cuillère.'};
  if(want<make*0.75)return {en:'You are making more than people want at this price. Lower it, or sell to more people.',
                            fr:'Vous produisez plus qu\u2019on n\u2019en veut à ce prix. Baissez-le, ou touchez plus de monde.'};
  if(s.price>balk()*0.94)return {en:'You are at the top of what this crowd will pay. Past here they simply stop.',
                                 fr:'Vous êtes au plafond de ce que cette clientèle acceptera. Au-delà, elle cesse simplement d\u2019acheter.'};
  if(want>make*1.25)return {en:'People want more than you make. You could charge more, or make more.',
                            fr:'On en veut plus que vous n\u2019en faites. Vous pourriez demander plus cher, ou produire plus.'};
  return {en:'Supply and appetite are roughly matched at this price.',
          fr:'La production et l\u2019appétit s\u2019équilibrent à peu près à ce prix.'};
}


/* Each palate is a strategy; the code names alone told the player nothing. */
const STRAT_WHAT={
 'EVEN':'picks either jar at random, every time.',
 'ALWAYS A':'always picks the first jar, whatever happens.',
 'ALWAYS B':'always picks the second jar, whatever happens.',
 'GREEDY':'picks whichever row scores most in total for itself.',
 'GENEROUS':'picks whichever row scores least against the other palate.',
 'MINIMAX':'picks the row whose worst outcome is least bad.',
 'TIT FOR TAT':'copies whatever the other palate did last round.',
 'BEAT LAST':'picks the best answer to what the other palate just did.'
};

/* ============================================================
   THE VISITOR
   For most of a run the player is watching, not clicking. Cookie
   Clicker solves that with the golden cookie: a timed thing that
   appears somewhere on the page, is worth a lot, and is gone if you
   are not looking. Ours is a wasp, because there is jam about — a bee
   in the orchard, a loose spore out in the dark.

   It is never punishing to miss one: nothing is lost, an opportunity
   simply passes. And it never blocks a control, because it is placed
   in the margin.
   ============================================================ */
const VISITOR={
 1:{glyph:'wasp',name:{en:'A wasp',fr:'Une guêpe'},
    gifts:[
      {k:'door',secs:25,
       note:{en:'Word went round. There is a queue at the door and it is not thinning.',
             fr:'La rumeur a circulé. Il y a la queue devant la porte, et elle ne diminue pas.'}},
      {k:'cash',
       note:{en:'Somebody wanted every jar you had, all at once, and paid on the spot.',
             fr:'Quelqu\u2019un a voulu tous vos pots d\u2019un coup, et a payé sur place.'}}]},
 2:{glyph:'bee',name:{en:'A bee',fr:'Une abeille'},
    gifts:[{k:'run',secs:30,
       note:{en:'A good hour in the rows. Everything is moving faster than it should.',
             fr:'Une bonne heure dans les rangs. Tout va plus vite que de raison.'}}]},
 3:{glyph:'spore',name:{en:'A loose spore',fr:'Une spore égarée'},
    gifts:[{k:'run',secs:30,
       note:{en:'A clear line out. For a while the spread meets nothing at all.',
             fr:'Une trajectoire dégagée. Un moment durant, la propagation ne rencontre plus rien.'}}]}
};
const VISITOR_GAP=[95,165];       /* seconds between appearances */
const VISITOR_STAY=13;            /* seconds it hangs about */
let visitorAt=0, visitorEl=null;

function visitorGlyph(kind){
  if(kind==='spore')return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/>'+
    '<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>';
  /* a wasp and a bee are the same body with different stripes */
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+
    '<ellipse class="wing" cx="8.5" cy="8" rx="5" ry="3" transform="rotate(-24 8.5 8)"/>'+
    '<ellipse class="wing" cx="15.5" cy="8" rx="5" ry="3" transform="rotate(24 15.5 8)"/>'+
    '<ellipse class="body" cx="12" cy="14.5" rx="4.6" ry="6.4"/>'+
    '<path class="stripe" d="M7.7 12.6h8.6M7.6 15.6h8.8M8.6 18.4h6.8"/>'+
    '<circle class="head" cx="12" cy="7.4" r="2.6"/></svg>';
}
function spawnVisitor(){
  if(visitorEl||s.ended)return;
  const cfg=VISITOR[s.act]; if(!cfg)return;
  const b=document.createElement('button');
  b.type='button'; b.className='visitor '+cfg.glyph;
  b.setAttribute('aria-label',t(cfg.name));
  /* It looked like decoration. A control nobody can identify fails the
     legibility bar, so it now carries a tooltip, and the first one ever
     to arrive announces itself. */
  b.setAttribute('data-tip','Catch it before it goes. It never arrives empty-handed.');
  b.innerHTML=visitorGlyph(cfg.glyph)+'<span class="vis-name">'+t(cfg.name)+'</span>';
  /* the margins, never over a control */
  const left=Math.random()<0.5;
  b.style.left=left?(4+Math.random()*3)+'vw':(88+Math.random()*4)+'vw';
  b.style.top=(18+Math.random()*58)+'vh';
  b.style.setProperty('--drift',(left?1:-1)*(6+Math.random()*10)+'px');
  b.onclick=()=>takeVisitor(b);
  document.body.appendChild(b);
  visitorEl=b;
  sfx.warn();
  if(!s.seen.visitor){
    s.seen.visitor=true;
    pushNotice('Something at the window',
               t('Catch it before it goes. It never arrives empty-handed.'));
  }
  setTimeout(()=>{ if(visitorEl===b){ b.classList.add('leaving');
    setTimeout(()=>{ b.remove(); if(visitorEl===b)visitorEl=null; },600); } },VISITOR_STAY*1000);
}
function takeVisitor(b){
  if(visitorEl!==b)return;
  visitorEl=null;
  const cfg=VISITOR[s.act], g=pick(cfg.gifts);
  const r=b.getBoundingClientRect();
  b.remove();
  s.visitors=(s.visitors||0)+1;
  flash('good'); sfx.recipe();
  if(g.k==='cash'){
    const gain=Math.max(25,servicedPerSec()*(s.price-sugarCostPerJar())*45+s.jars*0.25*s.price);
    s.cash+=gain;
    floatText('+'+money(gain),r.left+r.width/2,r.top,'good');
    bump($('#barCash'));
  }else{
    grantBoost(g.k,g.secs);
    floatText('×3',r.left+r.width/2,r.top,'good');
  }
  note(g.note,'hi');
}
function visitorTick(dt){
  if(s.ended)return;
  if(!visitorAt){ visitorAt=performance.now()/1000+VISITOR_GAP[0]*0.6; return; }
  const now=performance.now()/1000;
  if(now>=visitorAt&&!visitorEl){
    spawnVisitor();
    visitorAt=now+VISITOR_GAP[0]+Math.random()*(VISITOR_GAP[1]-VISITOR_GAP[0]);
  }
}

/* ============================================================
   RENDER
   ============================================================ */
const el={};
['barMade','barCash','barTaste','barMatter','barJars','jars','fruit','cratePrice','crateSize','fruitTrend',
 'autoRate','spoonCount','spoonCost','worksCount','worksCost','price','demand','tbMake','tbWant','backlog','marketWhy','madeRate','sellRate','revRate',
 'mktLevel','mktCost','insp','inspBar','creativity','taste','ovens','cellars','jarBatch',
 'exCash','exValue','exReturn','exHoldings','exRisk','sugarVal','sugarEffect','sugarCost','sugarWant','barHouse',
 'doorCount','walkedOff','oBottle','oSpoil','powDay','blightLeft','tasteBar','tasteNext','objText','soldByHand','sellerCount','shopCount','reachPct','tRuns','tWon','tGrid','tRank',
 'oMatter','oPulp','oFruit','oRate','dPickers','dPressers','dFactories','dVats','bufCap','oCatch',
 'powSupply','powDemand','powMeter','powStored','swCount','swMood','swBar','swGift',
 'spCount','spLaunched','spLost','spExplored','spConverted','sporeCost','allocFree',
 'cbDrifters','cbWins','cbHonor','cbLog','vesselCap'].forEach(id=>el[id]=document.getElementById(id));

/* Look the node up on first use if it was not in the list above, so a new
   readout can never fail silently just because the id was never registered.
   Three live readouts were frozen this way before the fallback existed.

   And look it up again if the node we cached has left the document: any
   panel rebuilt with innerHTML — the trust rows, the recipe list — leaves
   a detached node behind, and writing to it is the same silent failure by
   a different route. The Act III effect lines went blank on a language
   switch exactly this way. */
function set(k,v){
  let n=el[k];
  if(n===undefined||(n&&!n.isConnected))n=el[k]=document.getElementById(k);
  if(n&&n.textContent!==v)n.textContent=v;
}

/* ---- the door -------------------------------------------------------
   The marks are rebuilt only when the count changes, so the arrival
   animation plays once per person instead of sixty times a second. */
let doorShown=-1;
function drawDoor(){
  /* The door is a mechanic with an end. Once the sellers are on every
     doorstep, nobody walks up, and the PO's instruction for that case is
     to take the thing off the page rather than grey it out and explain
     itself: "if you're going to remove something just remove it instead
     of greying it out and leaving it on the page with a justification.
     Just reclaim some ui space, no ?" */
  const half=$('#doorHalf'), kick=$('#sellKicker');
  if(doorRetired()){
    if(half&&!half.classList.contains('hidden')){
      half.classList.add('hidden');
      if(kick)kick.classList.remove('hidden');
    }
    if(!s.seen.doorClosed){
      s.seen.doorClosed=true;
      note({en:'Nobody knocked today. Your sellers got to them first, all of them, and the front step is a front step again.',
            fr:'Personne n’a frappé aujourd’hui. Vos vendeurs les ont tous devancés, et le pas de la porte est redevenu un pas de porte.'},'hi');
    }
    return;
  }
  if(half&&half.classList.contains('hidden')){
    half.classList.remove('hidden');
    if(kick)kick.classList.add('hidden');
  }
  const waiting=atTheDoor(), cap=queueCap();
  set('doorCount',String(waiting));
  const q=$('#doorQueue');
  if(q){
    const n=Math.min(12,waiting);
    if(n!==doorShown){
      if(n>doorShown&&doorShown>=0){
        for(let i=doorShown;i<n;i++)q.appendChild(document.createElement('i'));
      }else{
        q.innerHTML=new Array(n).fill('<i></i>').join('');
      }
      doorShown=n;
    }
    q.classList.toggle('full',(s.queue||0)>=cap-0.05);
  }
  const btn=$('#sellBtn');
  if(btn){
    const can=waiting>=1&&s.jars>=1;
    btn.disabled=!can;
    btn.classList.toggle('can',can);
    const batch=Math.min(waiting,Math.floor(s.jars),1+(s.sellSkill||0));
    btn.textContent= waiting<1 ? t('Nobody at the door')
                   : s.jars<1  ? t('No jars to sell')
                   : batch>1   ? tf('Sell {0} jars',batch)
                               : t('Sell a jar');
  }
  /* This line used to blame the price for an empty doorstep whatever the
     real cause was, and read as nonsense to a player whose sellers had
     simply covered the county: "wtf does that mean". There are three
     different reasons the step can be empty and they need three
     different sentences. */
  const dw=$('#doorWhy');
  const doorTeaching=!((s.queue||0)>=cap-0.05)&&!(walkInPerSec()<0.25);
  why(dw,
    (s.queue||0)>=cap-0.05
      ? {en:'The doorstep is full and people have started giving up. Sell faster, or pay somebody to reach them for you.',
         fr:'Le pas de la porte est plein et certains renoncent déjà. Vendez plus vite, ou payez quelqu\u2019un pour aller à eux.'}
    : walkInPerSec()<0.25 && reachShare()>0.6
      ? {en:'Hardly anyone walks up any more. Your sellers get to them first, which is what you pay them for.',
         fr:'Presque plus personne ne se déplace. Vos vendeurs les devancent, et c\u2019est pour cela que vous les payez.'}
    : walkInPerSec()<0.25 && s.price>balk()*0.9
      ? {en:'At this price almost nobody is walking up. Lower it and the doorstep fills faster.',
         fr:'À ce prix, presque personne ne se déplace. Baissez-le et le pas de la porte se remplira plus vite.'}
    : walkInPerSec()<0.25
      ? {en:'Nobody much is walking up. There are only so many people in the county who want jam today.',
         fr:'Presque personne ne se déplace. Il n\u2019y a qu\u2019un nombre limité de gens qui veulent de la confiture aujourd\u2019hui.'}
    : {en:'Anyone your sellers cannot reach comes to the door instead. They do not wait long.',
       fr:'Ceux que vos vendeurs n\u2019atteignent pas viennent frapper à la porte. Ils n\u2019attendent pas longtemps.'},
    doorTeaching);
}

let lastTrend=18;
function render(dt){
  set('barMade',fmt(s.made));
  /* from Act II on, jars are the currency; the top bar has to say how
     many. Driven straight off the act rather than through show()/hide(),
     which only fires on the transition and lost the race on restore. */
  const jarSlot=document.getElementById('slotJars');
  if(jarSlot)jarSlot.classList.toggle('hidden',s.act<2);
  if(s.act>1)set('barJars',fmt(Math.floor(s.jars)));
  if(s.act===1){
    set('barCash',money(s.cash));
    set('jars',fmt(Math.floor(s.jars)));
    set('fruit',fmt(Math.floor(s.fruit)));
    set('crateSize',fmt(crateSize()));
    set('cratePrice',money(s.cratePrice));
    set('fruitTrend',t(s.cratePrice<13?'cheap':s.cratePrice>25?'dear':'steady'));
    set('autoRate',rate(autoPerSec())+' '+t('/sec'));
    set('spoonCount',fmt(s.spoons));
    set('spoonCost',money(spoonCost(s.spoons)));
    set('worksCount',fmt(s.works));
    set('worksCost',money(worksCost(s.works)));
    set('price','$'+s.price.toFixed(2));
    /* Two bars on one scale, so the comparison is the picture. The player
       does not have to know what a ratio of rates means to see which bar
       is longer, and a sentence says what to do about it. */
    const want=demand(),make=autoPerSec();
    const span=Math.max(want,make,0.001);
    set('demand',rate(want)+' '+t('/sec'));
    set('madeRate',rate(make)+' '+t('/sec'));
    if(el.tbMake)el.tbMake.style.width=(make/span*100).toFixed(1)+'%';
    if(el.tbWant)el.tbWant.style.width=(want/span*100).toFixed(1)+'%';
    /* predicted and continuous, so the same dial gives the same number —
       see movingPerSec() in engine.js for why neither the old branch nor
       a smoothed measurement would do */
    const moving=movingPerSec();
    set('sellRate',rate(moving)+' '+t('/sec'));
    set('backlog',fmt(Math.floor(s.jars)));
    set('revRate',money(revPerSec())+' '+t('/sec'));
    /* named mw, because why() is now the global writer for explainer lines */
    const mw=$('#marketWhy');
    if(mw)mw.textContent=t(marketWhy(want,make));
    /* sugar: the band the crowd will accept, and where the dial is in it */
    const peak=sugarPeak(),tol=sugarTolerance();
    set('sugarVal',Math.round(s.sugar)+'%');
    set('sugarWant',Math.round(peak)+'%');
    set('sugarEffect','×'+dec(sugarAppetite(),2));
    set('sugarCost',money(sugarCostPerJar())+' '+t('per jar'));
    const band=el.sugarBand||(el.sugarBand=document.getElementById('sugarBand')),
          mark=el.sugarMark||(el.sugarMark=document.getElementById('sugarMark')),
          bandWrap=$('#sugarBandWrap');
    if(band){ band.style.left=clamp(peak-tol,0,100)+'%';
              band.style.width=clamp(Math.min(peak+tol,100)-Math.max(peak-tol,0),0,100)+'%'; }
    if(mark)mark.style.left=clamp(s.sugar,0,100)+'%';
    /* The band is the game's best-hidden rule: the sweet spot slides as
       the price moves, so this fires for the price dial too, without the
       price dial knowing anything about sugar. Crossing in is the loudest
       non-purchase cue in the game; crossing out is small, because
       leaving the band is a trade and not a mistake (po-rule 1). */
    const inBand=Math.abs(s.sugar-peak)<=tol*0.5;
    if(bandWrap)bandWrap.classList.toggle('on',inBand);
    if(sugarWasIn===null){ sugarWasIn=inBand; }        /* never fire on load */
    else if(inBand!==sugarWasIn){
      const vn=document.getElementById('sugarVal');
      if(inBand){ landed(vn,'×'+dec(sugarAppetite(),2));
                  if(bandWrap){bandWrap.classList.remove('lit');void bandWrap.offsetWidth;
                               bandWrap.classList.add('lit');} }
      else slipped(vn);
      sugarWasIn=inBand;
    }
    why($('#sugarWhy'),s.price<2.6
      ? {en:'At this price people are buying sweetness, and they will forgive a lot of it. Sugar is not free, though.',
         fr:'À ce prix, les gens achètent du sucre, et ils pardonnent beaucoup. Le sucre n\u2019est pas gratuit pour autant.'}
      : s.price>5.2
      ? {en:'At this price people read the label. They want fruit, and they notice when it is not there.',
         fr:'À ce prix, les gens lisent l\u2019étiquette. Ils veulent du fruit, et ils remarquent quand il n\u2019y en a pas.'}
      : {en:'Change the price and the crowd changes with it. So does what they want in the jar.',
         fr:'Changez le prix et la clientèle change avec. Ce qu\u2019elle veut dans le pot aussi.'},true);
    const house=$('#slotHouse');
    if(house){
      house.classList.toggle('hidden',!s.style);
      if(s.style)set('barHouse',t(s.style==='maker'?"Maker's Table":'Corner Store'));
    }
    set('mktLevel',String(s.mkt));
    set('mktCost',money(mktCost()));
    $('#buyFruit').disabled=s.cash<s.cratePrice;
    $('#buySpoon').disabled=s.cash<spoonCost(s.spoons);
    $('#buyWorks').disabled=s.cash<worksCost(s.works);
    /* the disabled state itself is set by the afford table below, which
       runs later and would otherwise overwrite anything written here */
    const mWhy=$('#mktWhy');
    if(mktReady())why(mWhy,'Every level widens the crowd by half again. It is the cheapest thing in the room and the one people forget.',true);
    else if(mWhy){ mWhy.classList.remove('hidden');
      mWhy.textContent=tf('Word is still travelling. It gets there at the speed of jars leaving the house — {0} more.',fmt(Math.ceil(mktLeft()))); }
    $('#priceDown').disabled=s.price<=0.05;
  }
  /* selling ladder */
  if(s.act===1){
    drawDoor();
    set('soldByHand',fmt(Math.floor(s.soldByHand||0)));
    set('soldAuto',fmt(Math.floor(s.soldAuto||0)));
    set('walkedOff',fmt(Math.floor(s.walkedOff||0)));
    set('sellerCount',fmt(s.sellers||0));
    set('shopCount',fmt(s.shops||0));
    set('reachPct',Math.round(reachShare()*100)+'%');
    /* a hint while the ladder is ordinary; the moment the door closes it
       is the only line that says what a shop buys now, so it is state */
    why($('#reachWhy'),!s.autoSell
      ? t('Nobody sells for you yet. Every jar leaves through the front door, one at a time.')
      : doorRetired()
      ? tf('Your sellers cover the county. All {0} jars a second that anyone wants go through them. A shop no longer widens the reach — it widens the appetite.',
           rate(demand()))
      : tf('Your sellers get to {0} of the {1} jars a second people want. Everyone else has to come to the door.',
           rate(servicedPerSec()),rate(demand())),!doorRetired());
    set('sellerCost',money(sellerCost()));
    set('shopCost',money(shopCost()));
    $('#hireSeller').disabled=s.cash<sellerCost();
    $('#openShop').disabled=s.cash<shopCost();
    if((s.sellers||0)>=4)$('#openShop').classList.remove('hidden');
  }
  set('insp',fmt(Math.floor(s.insp)));
  el.inspBar.style.width=clamp(s.insp/inspMax()*100,0,100)+'%';
    set('inspWhy',t(inspWhy()));
  set('creativity',fmt(Math.floor(s.crea)));
  set('taste',String(s.taste));
  const tn=nextTasteAt();
  set('tasteNext',tn===null?'—':fmt(tn)+' '+t('jars'));
  if(el.tasteBar)el.tasteBar.style.width=(tasteProgress()*100).toFixed(1)+'%';
  /* The larder running dry stops the only verb in the game. It used to
     get a stamp on the fruit card — which is halfway down the page, and
     the whole reason the alarm was asked for in the first place. It now
     takes the top of the viewport, drains the colour out of the room
     behind it, and carries the crate button with it so nobody has to go
     hunting for the way out. The stamp stays, for anyone actually looking
     at the fruit panel. */
  const stamp=$('#larderStamp'), alarm=$('#alarm');
  const dry=s.act===1&&s.fruit<1;
  if(stamp&&dry!==stamp.classList.contains('on'))stamp.classList.toggle('on',dry);
  if(alarm&&dry===alarm.classList.contains('hidden')){
    alarm.classList.toggle('hidden',!dry);
    document.body.classList.toggle('dry',dry);
    if(dry){ sfx.warn(); flash('bad'); }
    else note({en:'Fruit again. The pot goes back on.',
               fr:'Des fruits, enfin. La marmite repart.'},'hi');
  }
  if(dry){
    set('alarmCost',money(s.cratePrice));
    const ab=$('#alarmBuy');
    if(ab){ ab.disabled=s.cash<s.cratePrice; ab.classList.toggle('can',s.cash>=s.cratePrice); }
  }
  /* a live boost has to say so, and say how long is left */
  const bl=$('#boostLine');
  if(bl){
    const left=boostLeft();
    bl.classList.toggle('hidden',left<=0);
    if(left>0)bl.textContent=tf('Everything is running at triple for {0}s.',Math.ceil(left));
  }
  i18nFlag();
  const obj=objective();
  set('objText',t(obj));
  set('stateText',t(stateSpine()));
  set('barTaste',String(s.taste));
  set('ovens',String(s.ovens));
  set('cellars',String(s.cellars));
  $('#buyOven').disabled=s.taste<1;
  $('#buyCellar').disabled=s.taste<1;

  if(s.ex.on){
    set('exRisk',t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk]));
    set('exCash',money(s.ex.cash));
    set('exValue',money(s.ex.holdings.reduce((a,h)=>a+h.shares*h.price,0)));
    set('exReturn',money(s.ex.returns));
    set('exStakeAmt',money(exStakeAmount()));
    $('#exStakeRow').querySelectorAll('button').forEach(b=>
      b.classList.toggle('on',+b.dataset.stake===(s.ex.stake||25)));
    $('#exDeposit').disabled=exStakeAmount()<50;
    $('#exWithdraw').disabled=!s.ex.holdings.length&&s.ex.cash<=0;
    el.exHoldings.innerHTML=s.ex.holdings.map(h=>{
      const v=h.shares*h.price,g=v-h.cost;
      return '<div class="holding"><span>'+h.sym+'</span><span class="'+(g>=0?'up':'down')+'">'+money(v)+' ('+(g>=0?'+':'')+money(g).replace('$','')+')</span></div>';
    }).join('')||'<div class="holding" style="color:var(--steel)"><span>no positions</span><span>—</span></div>';
  }
  if(s.tour.on){
    const cd=tastingCooldown(),tc=tastingCost();
    const btn=$('#tRun');
    if(btn){
      btn.disabled=cd>0||s.insp<tc;
      btn.textContent=cd>0?(t('Testing')+' · '+Math.ceil(cd/1000)+'s')
        :(s.tour.pending?t('Run the panel')+' · '+fmt(tc):t('New grid')+' · '+fmt(tc));
    }
    set('tRuns',String(s.tour.runs));
    set('tWon',fmt(s.tour.won));
    $('#tStrat').textContent=tf('Your palate: {0}',t(STRATS[s.tour.strat].n));
    const ex=$('#tExplain');
    if(ex)ex.classList.toggle('hidden',!HINTS);
    if(ex&&HINTS)ex.textContent=t('Each palate is a rule for choosing.')+' '+t(STRATS[s.tour.strat].n)+
      ' — '+t(STRAT_WHAT[STRATS[s.tour.strat].n]||'')+' '+
      t('The grid is what a pairing scores: your row against their column.');
  }
  if(s.chips.length){
    const cd=cultureCooldown();
    const rc=$('#readCulture');
    if(rc){ rc.disabled=false; rc.textContent=t('Test the set'); }
  }
  if(s.act===2){
    set('barMatter',fmtG(s.mass));
    /* the act is six catchments, so the panel has to say which one and
       how far through it you are — that is the whole spine of Act II */
    set('oCatch',tf('{0} of {1} · {2}',(s.tier||0)+1,CATCHMENTS.length,t(catchment().name)));
    const cb=el.oCatchBar||(el.oCatchBar=document.getElementById('oCatchBar'));
    if(cb)cb.style.width=clamp(converted2()*100,0,100).toFixed(1)+'%';
    set('oMatter',fmtG(s.mass));
    set('oPulp',fmtG(s.pulp));
    set('oFruit',fmtG(s.ofruit));
    set('oRate',fmtC(s.orate||0)+' '+t('/sec'));
    set('oBottle',t(bottleneck()));
    const pr=stageRates(s.eff===undefined?1:s.eff), bn=bottleneck();
    set('pipePick',fmtC(pr.pick)+' '+t('/sec'));
    set('pipePress',fmtC(pr.press)+' '+t('/sec'));
    set('pipeLine',fmtC(pr.line)+' '+t('/sec'));
    $('#pipePickBox').classList.toggle('slow',bn==='picking');
    $('#pipePressBox').classList.toggle('slow',bn==='pressing');
    $('#pipeLineBox').classList.toggle('slow',bn==='bottling');
    why($('#pipeWhy'),(s.pickers+s.pressers+s.lines===0)
      ? {en:'Nothing is built yet. Pickers take the orchard and bring back fruit.',
         fr:'Rien n\u2019est encore construit. Les récolteuses prennent le verger et en rapportent du fruit.'}
      : {en:'Throughput is set by the slowest stage. Building past it is waste.',
         fr:'Le débit est fixé par l\u2019étape la plus lente. Construire au-delà est du gaspillage.'},true);
    const sw=$('#spoilWhy'), swt=spoilWhy();
    if(sw){ sw.textContent=swt?t(swt):''; sw.style.display=swt?'':'none'; }
    $('#intensityRow').querySelectorAll('button').forEach(b=>
      b.classList.toggle('on',+b.dataset.i===(s.intensity||1)));
    set('oSpoil',fmtC(Math.round(s.spoilRate||0))+' '+t('/sec'));
    set('powDay',Math.round(daylight()*100)+'%');
    const bb=$('#blightBox');
    if(bb)bb.classList.toggle('hidden',!(s.blight>0));
    if(s.blight>0){ set('blightLeft',Math.ceil(s.blight)+'s');
      $('#treatBlight').textContent=t('Treat the rows')+' · '+fmt(blightCost()); }
    $('#intensityRow').querySelectorAll('button').forEach(b=>
      b.classList.toggle('can',+b.dataset.i===(s.intensity||1)));
    set('dPickers',fmt(s.pickers));
    set('dPressers',fmt(s.pressers));
    set('dFactories',fmt(s.lines));
    set('powSupply',fmtC(powSupply()));
    set('powDemand',fmtC(powDraw()));
    set('powStored',fmtC(Math.floor(s.power))+' / '+fmtC(powStore()));
    const load=powDraw()/Math.max(1,powSupply());
    el.powMeter.style.width=clamp(load*100,0,100)+'%';
    $('#powMeterWrap').className='meter'+(load>1?' hot':load>0.85?' warm':'');
    $('#buyPicker').textContent=t('Build picker')+' · '+fmtC(pickerCost(s.pickers));
    $('#buyPresser').textContent=t('Build pan')+' · '+fmtC(presserCost(s.pressers));
    $('#buyFactory').textContent=t('Build line')+' · '+fmtC(lineCost(s.lines));
    $('#buySun').textContent=t('Sun trap')+' · '+fmtC(sunCost(s.sun));
    $('#buyBattery').textContent=t('Cellar')+' · '+fmtC(battCost(s.batt));
    $('#buyVat').textContent=t('Vat')+' · '+fmtC(vatCost(s.vats||0));
    set('dVats',fmt(s.vats||0));
    set('bufCap',fmtG(bufferCap()));
    if(s.swarmOn){
      set('swCount',fmt(Math.floor(s.swarm)));
      set('swMood',t(s.mood>0.75?'humming':s.mood>0.5?'content':s.mood>0.3?'restless':'leaving'));
      el.swBar.style.width=clamp(s.mood*100,0,100)+'%';
      set('swGift',rate(s.swarmGift)+' '+t('/sec'));
      $('#swSync').textContent=t('Synchronise')+' · '+fmt(syncCost());
    }
  }
  if(s.act===3){
    set('spCount',fmt(Math.floor(s.spores)));
    set('spLaunched',fmt(s.launched));
    set('spLost',fmt(Math.floor(s.lost)));
    set('spExplored',pct(s.explored,2));
    set('spConverted',pct(s.converted,3));
    set('sporeCost',fmt(sporeCost()));
    TRAITS.forEach(tr=>{
      if(tr[0]==='combat'&&!s.combatOn)return;
      set('alfx_'+tr[0],t(traitEffect(tr[0])));
      set('al_'+tr[0],String(s.alloc[tr[0]]));
    });
    set('allocWhy',t(allocWhy()));
    $('#launchSpore').disabled=s.jars<sporeCost();
    if(s.combatOn){
      set('cbDrifters',fmt(Math.floor(s.drifters)));
      set('cbWins',fmt(s.wins));
      set('cbHonor',fmt(Math.floor(s.honor)));
      el.cbLog.innerHTML=s.cbLog.slice(0,8).map(t=>'<div><span class="dim">'+t+'</span></div>').join('');
    }
  }

  /* an affordable button should look affordable */
  /* one table per act, so a new button cannot quietly go without feedback */
  const affordMap=s.act===1
    ? [['buySpoon',spoonCost(s.spoons),s.cash],['buyWorks',worksCost(s.works),s.cash],
       ['buyMkt',mktReady()?mktCost():Infinity,s.cash],['buyFruit',s.cratePrice,s.cash],
       ['hireSeller',sellerCost(),s.cash],['openShop',shopCost(),s.cash]]
    : s.act===2
    ? [['buyPicker',pickerCost(s.pickers),s.jars],['buyPresser',presserCost(s.pressers),s.jars],
       ['buyFactory',lineCost(s.lines),s.jars],['buySun',sunCost(s.sun),s.jars],
       ['buyBattery',battCost(s.batt),s.jars],['buyVat',vatCost(s.vats||0),s.jars]]
      .concat(s.blight>0?[['treatBlight',blightCost(),s.insp]]:[])
      .concat(s.swarmOn?[['swSync',syncCost(),s.insp]]:[])
    : [['launchSpore',sporeCost(),s.jars]];
  affordMap.forEach(([id,c,have])=>{const b=document.getElementById(id);
    if(b&&!b.classList.contains('hidden')){ b.classList.toggle('can',have>=c); b.disabled=have<c; }});
  /* the x10 buttons follow the same table, at eight times the price */
  const bulkMap=s.act===1
    ? [['buySpoon10',spoonCost,s.spoons,s.cash],['buyWorks10',worksCost,s.works,s.cash]]
    : s.act===2
    ? [['buyPicker10',pickerCost,s.pickers,s.jars],['buyPresser10',presserCost,s.pressers,s.jars],
       ['buyFactory10',lineCost,s.lines,s.jars]]
    : [];
  bulkMap.forEach(([id,costFn,owned,have])=>{const b=document.getElementById(id);
    if(b&&!b.classList.contains('hidden')){
      const n=affordCount(costFn,owned,have,10);
      b.disabled=n<1; b.classList.toggle('can',n>=10);
      set(id,'×'+(n>0?n:10));
    }});
  const ov=$('#buyOven'),cl=$('#buyCellar');
  if(ov)ov.classList.toggle('can',s.taste>0);
  if(cl)cl.classList.toggle('can',s.taste>0);

  /* the jar */
  let level=0,active=false;
  if(s.act===1){ level=clamp(Math.log10(Math.max(1,s.jars))/6,0,1); active=autoPerSec()>0; }
  else if(s.act===2){ level=clamp(converted2(),0,1); active=(s.orate||0)>0; }
  else { level=clamp(s.converted,0,1); active=s.spores>0; }
  /* a completely empty pot reads as broken rather than as empty */
  level=0.14+level*0.86;
  setJar(level,active);
  set('jarBatch',(t('ACT')+' '+(s.act===1?'I':s.act===2?'II':'III')).toUpperCase());
}

/* ============================================================
   LOOP
   ============================================================ */
/* ---- automation needs a visible heartbeat ------------------------
   Automated jars and automated money arrive as a continuous trickle,
   which on screen looks like nothing happening at all. Both are
   collected and released as one pulse a second: at any production rate
   the player sees the same calm rhythm, and the number in the pulse is
   what the machine actually earned in that second.
   lean-note: floats only; upgrade to jars physically leaving the panel
   when the delivery route is drawn. */
const PULSE_EVERY=1.1;
let pulseCash=0,pulseJars=0,pulseAcc=0;
/* null until the first render, so restoring a save mid-band is silent */
let sugarWasIn=null;

function autoPulse(dt){
  pulseAcc+=dt;
  if(pulseAcc<PULSE_EVERY)return;
  pulseAcc=0;
  const jarNode=document.getElementById(s.act===1?'jars':'barJars'),
        cashNode=document.getElementById('barCash');
  /* the quiet tier: this is the machine working, not a decision anybody
     made, so it must not sound or look like one (po-rule 11) */
  if(pulseJars>=0.5&&jarNode&&!jarNode.parentElement.classList.contains('hidden')){
    floatFrom(jarNode,'+'+fmt(Math.round(pulseJars)),'dim');
    bump(jarNode);
  }
  if(pulseCash>0.005&&cashNode){ floatFrom(cashNode,'+'+money(pulseCash),'good dim'); }
  pulseJars=0; pulseCash=0;
}

function tick(dt){
  if(s.ended)return;
  s.insp+=inspRate()*dt;
  if(s.insp>inspMax()){
    const over=s.insp-inspMax(); s.insp=inspMax();
    s.crea+=Math.min(over,creaRate()*dt);
  }
  tasteTick();
  if(s.act===1){
    const auto=autoPerSec()*dt;
    if(auto>0){ makeJars(auto); pulseJars+=auto; }
    fruitTick(dt);
    /* Only the share of appetite your sellers and shops can actually
       service leaves on its own. Before the counter recipe that share is
       zero, so early jars move only when the player sells them by hand. */
    queueTick(dt);
    const want=servicedPerSec()*dt;
    const sold=Math.min(s.jars,want);
    if(sold>0){
      s.jars-=sold; s.sold+=sold; s.soldAuto=(s.soldAuto||0)+sold;
      const takings=sold*(s.price-sugarCostPerJar());
      s.cash+=takings; pulseCash+=takings;
    }
    exTick(dt);
  }else if(s.act===2){
    act2Tick(dt);
  }else{
    act3Tick(dt);
  }
  autoPulse(dt);
}

let last=performance.now(),acc=0,saveAcc=0,revealAcc=0;
function frame(now){
  if(s.ended)return;            /* the loop stops; the last screen is meant to be still */
  let dt=(now-last)/1000; last=now;
  if(dt>0.5)dt=0.5;
  tick(dt);
  acc+=dt; saveAcc+=dt; revealAcc+=dt;
  if(s.chips.length)updateChips(now/1000);
  stirTick(dt);
  drawPot(dt);
  if(acc>0.1){ render(acc); acc=0; }
  visitorTick(dt);
  if(revealAcc>0.5){ revealAcc=0; drawRecipes(); checkReveals(); forkTick(); scanRecipeNotices(); installTips(); }
  noticeTick();
  if(saveAcc>10){ saveAcc=0; save(); }
  requestAnimationFrame(frame);
}

function checkReveals(){
  if(s.act!==1)return;
  if(s.made>=1&&show('pMarket','The shelf is open. Jars sell themselves, slowly, if the price is right.'))s.seen.m=1;
  if(s.made>=3)show('pSell','Jars do not sell themselves. Not yet.');
  if(s.made>=12)show('pFruit','Fruit does not appear on its own.');
  if(s.made>=25&&show('pCompute','You have started to have ideas about jam.'))s.seen.c=1;
  if(s.made>=25)show('slotTaste');
  if(s.made>=60)show('pSugar','Sweetness is a decision, not a constant.');
  if(s.crea>0)show('rCreativity');
}

/* ============================================================
   WIRING
   ============================================================ */
/* One verb, one object. The pot is the click target; the button stays for
   the keyboard and for anyone who never thinks to click the artwork. */
function doStir(node,cx,cy){
  const before=s.made;
  stir();
  const got=s.made-before;
  if(got>0){
    stirKick(9); sfx.stir(); potHit(); jamRipple();
    /* the player's own hand is the loudest thing in Act I, and it lands
       where the cursor is rather than in the middle of the pot */
    if(cx===undefined)floatFrom(node,'+'+fmt(got),'good big');
    else { floatText('+'+fmt(got),cx,cy-14,'good big'); splash(cx,cy,7+Math.min(9,Math.floor(got/2))); }
    bump($('#jars'));
    if(!s.seen.stirred){ s.seen.stirred=true; const hint=$('#potHint'); if(hint)hint.classList.add('gone'); }
  } else { shake(node); flash('bad'); sfx.bad(); }
}
$('#stirBtn').addEventListener('click',e=>{
  const b=e.currentTarget,r=b.getBoundingClientRect();
  b.style.setProperty('--x',(e.clientX-r.left)+'px');
  b.style.setProperty('--y',(e.clientY-r.top)+'px');
  doStir(b);
});
const potEl=$('#potCanvas');
if(potEl){
  potEl.addEventListener('click',e=>doStir(potEl,e.clientX,e.clientY));
  potEl.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); doStir(potEl); }
  });
}
document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&s.act===1&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();stir()}
});
$('#sellBtn').onclick=e=>{
  const n=sellByHand();
  if(n>0){ floatFrom(e.currentTarget,'+'+money(n*s.price),'good'); bump($('#barCash')); sfx.sell(); }
  else { shake(e.currentTarget); sfx.bad(); }
};
$('#hireSeller').onclick=e=>{
  const c=sellerCost();
  if(s.cash<c){ shake(e.currentTarget); sfx.bad(); return; }
  s.cash-=c; s.sellers=(s.sellers||0)+1; floatFrom(e.currentTarget,'+1','good'); sfx.buy(); pop(e.currentTarget);
};
$('#openShop').onclick=e=>{
  const c=shopCost();
  if(s.cash<c){ shake(e.currentTarget); sfx.bad(); return; }
  s.cash-=c; s.shops=(s.shops||0)+1; floatFrom(e.currentTarget,'+1','good'); sfx.buy(); pop(e.currentTarget);
  note({en:'A shop opens. Jars leave without anyone asking you.',fr:'Une boutique ouvre. Les pots partent sans qu\u2019on vous demande.'},'hi');
};
$('#hintBtn').onclick=()=>{ toggleHints(); sfx.tick(); };
$('#i18nFlag').onclick=()=>{ i18nReport(); toast(t('Written into the logbook.')); };
$('#buyFruit').onclick=e=>{ if(buyFruit()){floatFrom(e.currentTarget,'+'+fmt(crateSize()),'good');sfx.buy();pop(e.currentTarget);} else {shake(e.currentTarget);sfx.bad();} };
/* the same purchase, reachable from the alarm, so an empty larder never
   costs the player a scroll to fix */
$('#alarmBuy').onclick=e=>{ if(buyFruit()){floatFrom(e.currentTarget,'+'+fmt(crateSize()),'good big');sfx.buy();pop(e.currentTarget);} else {shake(e.currentTarget);sfx.bad();} };
$('#autoFruit').onclick=()=>{s.autoFruit=!s.autoFruit;updateAutoBtn()};
$('#buySpoon').onclick=e=>{const c=spoonCost(s.spoons);if(s.cash>=c){s.cash-=c;s.spoons++;sfx.buy();pop(e.currentTarget)}};
$('#buySpoon10').onclick=e=>{let n=0;for(let i=0;i<10;i++){const c=spoonCost(s.spoons);if(s.cash<c)break;s.cash-=c;s.spoons++;n++}
  if(n){sfx.buy();pop(e.currentTarget)}else{toast(t('Not enough cash.'));shake(e.currentTarget);sfx.bad()}};
$('#buyWorks').onclick=e=>{const c=worksCost(s.works);if(s.cash>=c){s.cash-=c;s.works++;sfx.buy();pop(e.currentTarget)}};
$('#buyWorks10').onclick=e=>{let n=0;for(let i=0;i<10;i++){const c=worksCost(s.works);if(s.cash<c)break;s.cash-=c;s.works++;n++}
  if(n){sfx.buy();pop(e.currentTarget)}else{toast(t('Not enough cash.'));shake(e.currentTarget);sfx.bad()}};


$('#buyMkt').onclick=e=>{const c=mktCost();if(s.cash>=c&&mktReady()){s.cash-=c;s.mkt++;s.mktMade=s.made;sfx.buy();pop(e.currentTarget);note({en:'Word of mouth is at level '+s.mkt+' now.',
      fr:'Le bouche-à-oreille passe au niveau '+s.mkt+'.'},'dim')}};
$('#buyOven').onclick=e=>{if(s.taste>=1){s.taste--;s.ovens++;sfx.buy();pop(e.currentTarget)}};
$('#buyCellar').onclick=e=>{if(s.taste>=1){s.taste--;s.cellars++;sfx.buy();pop(e.currentTarget)}};
const priceStep=()=>s.price<2?0.05:s.price<5?0.10:0.25;
/* The dials tick and nothing more. They are held down, so a bump per
   step would restart the same animation sixteen times a second and read
   as jitter -- and the digits are already moving under the player's
   thumb. The loud cue is saved for crossing the band (see render). */
holdable($('#priceUp'),  ()=>{ s.price=Math.min(PRICE_MAX,Math.round((s.price+priceStep())*100)/100); chose(null); });
holdable($('#priceDown'),()=>{ s.price=Math.max(PRICE_MIN,Math.round((s.price-priceStep())*100)/100); chose(null); });
holdable($('#buySpoon'), ()=>{ const c=spoonCost(s.spoons); if(s.cash>=c){s.cash-=c;s.spoons++;stirKick(3);} });
holdable($('#sugarUp'),  ()=>{ s.sugar=clamp(Math.round(s.sugar+1),0,100); chose(null); });
holdable($('#sugarDown'),()=>{ s.sugar=clamp(Math.round(s.sugar-1),0,100); chose(null); });
$('#treatBlight').onclick=e=>{ const b=s.blight; treatBlight(); if(!s.blight&&b)floatFrom(e.currentTarget,'✓','good'); else shake(e.currentTarget); };
$('#intensityRow').querySelectorAll('button').forEach(b=>b.onclick=()=>{ setIntensity(+b.dataset.i); chose(b); });
holdable($('#buyWorks'), ()=>{ const c=worksCost(s.works); if(s.cash>=c){s.cash-=c;s.works++;stirKick(5);} });

$('#readCulture').onclick=e=>{
  const before=s.insp;
  readCulture();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); bump($('#insp')); sfx.sell(); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); bump($('#insp'),'bump-bad'); shake($('#pCulture')); sfx.bad(); }
};
$('#exStakeRow').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  s.ex.stake=+b.dataset.stake; chose($('#exStakeAmt'));
});
$('#exDeposit').onclick=e=>{
  const amt=exInvest();
  if(amt>0){ floatFrom(e.currentTarget,'-'+money(amt),'bad'); bump($('#exValue')); }
  else shake(e.currentTarget);
};
$('#exWithdraw').onclick=e=>{
  const r=exWithdrawAll();
  if(r.value>0){
    floatFrom(e.currentTarget,(r.gain>=0?'+':'')+money(r.gain),r.gain>=0?'good':'bad');
    bump($('#barCash'),r.gain>=0?'bump':'bump-bad');
    flash(r.gain>=0?'good':'bad');
  } else shake(e.currentTarget);
};
$('#exRisk').onclick=()=>{s.ex.risk=(s.ex.risk+1)%3;$('#exRisk').textContent=t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk]);chose($('#exRisk'))};
$('#tRun').onclick=e=>{
  const before=s.insp;
  runTournament(); drawTournament();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); }
};
$('#tStrat').onclick=()=>{s.tour.strat=(s.tour.strat+1)%s.tour.unlocked;chose($('#tStrat'))};
$('#buyPicker').onclick=e=>buyN('picker',1,e.currentTarget);
$('#buyPicker10').onclick=e=>buyN('picker',10,e.currentTarget);
$('#buyPresser').onclick=e=>buyN('presser',1,e.currentTarget);
$('#buyPresser10').onclick=e=>buyN('presser',10,e.currentTarget);
$('#buyFactory').onclick=e=>buyN('line',1,e.currentTarget);
$('#buyFactory10').onclick=e=>buyN('line',10,e.currentTarget);
$('#buySun').onclick=e=>buyN('sun',1,e.currentTarget);
$('#buyBattery').onclick=e=>buyN('batt',1,e.currentTarget);
$('#buyVat').onclick=e=>buyN('vat',1,e.currentTarget);
$('#swWork').onclick=e=>{s.swarmWork=clamp(s.swarmWork+0.1,0,1);chose(e.currentTarget)};
$('#swPlay').onclick=e=>{s.swarmWork=clamp(s.swarmWork-0.1,0,1);chose(e.currentTarget)};
$('#swSync').onclick=synchronise;
$('#launchSpore').onclick=()=>launchSpore(1);
$('#saveBtn').onclick=()=>{save();toast(t(store.ok?'Saved.':'This page cannot store a save. Nothing is lost while the tab stays open.'))};
$('#resetBtn').onclick=()=>{
  if(!confirm(t('Throw out the batch and start again?')))return;
  store.del(KEY);location.reload();
};

function drawTournament(){
  if(!s.tour.grid)return;
  const g=s.tour.grid;
  el.tGrid.innerHTML='<table class="grid-tbl"><tr><th></th><th>'+t('they A')+'</th><th>'+t('they B')+'</th></tr>'+
    '<tr><th>'+t('you A')+'</th><td>'+g[0][0]+'</td><td>'+g[0][1]+'</td></tr>'+
    '<tr><th>'+t('you B')+'</th><td>'+g[1][0]+'</td><td>'+g[1][1]+'</td></tr></table>';
  /* The first press of the panel only deals a grid — there is no ranking
     yet, and reading one threw, killing the frame on first use. */
  el.tRank.innerHTML=!s.tour.rank
    ? '<div class="rank" style="color:var(--steel)"><span>'+t('No panel has been held yet.')+'</span><span>—</span></div>'
    : s.tour.rank.slice(0,5).map((o,i)=>
      '<div class="rank"><span'+(o.i===s.tour.strat?' style="color:var(--boil)"':'')+'>'+(i+1)+'. '+t(STRATS[o.i].n)+'</span><span>'+o.v+'</span></div>').join('');
}

/* ---------- boot ---------- */
function boot(){
  const had=load();
  if(had){
    if(s.act===2){document.body.classList.add('act-2');$('#actLabel').textContent=t('Orchard')}
    if(s.act===3){document.body.classList.add('act-3');$('#actLabel').textContent=t('Spread')}
    const away=clamp((Date.now()-s.last)/1000,0,3600);
    if(away>30){ for(let i=0;i<Math.min(240,away/2);i++)tick(Math.min(15,away/Math.min(240,away/2))); note('You were away. The pot kept going.','dim'); }
  }else{
    note('A pot, a spoon, and three hundred berries.','hi');
    note('Stir the pot.','');
  }
  snapshotStatic();
  if(LANG!=='en')applyStatic();
  document.documentElement.lang=LANG;
  const lb=$('#langBtn'); if(lb){ lb.textContent=LANG==='en'?'FR':'EN'; lb.onclick=()=>setLang(LANG==='en'?'fr':'en'); }
  applyHints();
  installTips();
  restoreUI();
  drawLog();drawRecipes(true);render(0);
  if(s.tour.grid)drawTournament();
  requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame)});
}
function restoreUI(){
  if(s.act===1){
    if(s.made>=1)show('pMarket'); if(s.made>=3)show('pSell'); if(s.recipes.counter)show('pSellers'); if((s.sellers||0)>=4)$('#openShop').classList.remove('hidden'); if(s.made>=12)show('pFruit'); if(s.made>=25){show('pCompute');show('slotTaste')}
    if(s.recipes.window)show('pMarketing'); if(s.made>=60)show('pSugar'); if(s.recipes.mech){show('pSpoons');show('rAutoRate')}
    if(s.recipes.geometry){ if(!s.worksBase)openJamworks(); show('pWorks'); } if(s.crea>0)show('rCreativity');
    if(s.recipes.standing){$('#autoFruit').classList.remove('hidden');updateAutoBtn()}
    if(s.recipes.pantry)show('slotMatter');
  }else if(s.act===2){
    hide('pMarket');hide('pFruit');hide('pProduction');hide('slotCash');
    show('pOrchard');show('pDrones');show('pPower');show('slotMatter');show('slotJars');
    $('#vesselCap').textContent=t('fruitable mass converted');
    if(s.swarmOn)show('pSwarm');
  }else{
    hide('pMarket');hide('pFruit');hide('pProduction');hide('slotCash');
    show('pSpores');show('pAlloc');show('slotJars');buildAlloc();
    if(s.combatOn)show('pCombat');
    $('#vesselCap').textContent=t('observable matter converted');
  }
  if(s.ex.on)show('pExchange');
  if(s.tour.on)show('pTasting');
  if(s.chips.length){show('pCulture');drawChips()}
  if(s.act===1&&s.made>=25)show('pCompute');
  $('#exRisk').textContent=t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk]);
}

boot();
