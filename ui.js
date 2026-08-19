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
    blurb:'Steadier customers and room to charge a little more. The market stays calm.',
    note:'−10% appetite · gentler price curve'},
   {k:'store',name:'Corner Store',
    blurb:'More people want the jar, but they mind the price more. Volume is the reward.',
    note:'+12% appetite · sharper price curve'}],
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
    host.classList.add('hidden'); host.innerHTML='';
    note({en:'<b>'+o.name+'</b> is your direction now. The market will remember.',
          fr:'<b>'+t(o.name)+'</b> est votre direction désormais. Le marché s\u2019en souviendra.'},'hi');
    save();
  });
}
function forkTick(){
  for(const id in FORKS){
    const host=document.getElementById('forkSlot');
    if(FORKS[id].when()&&host&&host.classList.contains('hidden')) showFork(id);
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
    if(s.recipes[r.id]||r.act!==s.act)continue;
    let open=false; try{ open=r.when(); }catch(e){ open=false; }
    if(!open)continue;
    const seenA='n_avail_'+r.id, seenB='n_afford_'+r.id;
    if(!s.seen[seenA]){ s.seen[seenA]=true; pushNotice('New recipe available',t(r.n||r.name)); continue; }
    if(!s.seen[seenB]&&canAfford(r)){ s.seen[seenB]=true; pushNotice('Now affordable',t(r.n||r.name)); }
  }
}

/* ============================================================
   ACT II — THE ORCHARD
   ============================================================ */
function converted2(){ return 1-s.mass/s.massStart; }
function pickerCost(n){ return 400*Math.pow(1.00015,n); }
function presserCost(n){ return 500*Math.pow(1.00015,n); }
function lineCost(n){ return 1500*Math.pow(1.00015,n); }
function sunCost(n){ return 8000*Math.pow(1.02,n); }
function battCost(n){ return 5000*Math.pow(1.02,n); }
function powSupply(){ return s.sun*50*s.sunMult; }
function powDraw(){ return (s.pickers+s.pressers+s.lines)*0.30*powerBias(); }
function powStore(){ return s.batt*3500; }
function swarmBoost(){ return 1+(s.swarm*s.swarmWork*0.00002); }

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
    if(!ok){if(k===0){toast(t('Not enough jars.'));shake(lastBuyBtn);sfx.bad();}break}
    if(k===0)sfx.buy();
  }
}

/* ---- the orchard has to be run, not just bought ------------------
   Three stages in series. Throughput is set by the slowest, and a
   buffer that overflows spoils, so overbuilding one stage is waste.
   Power swings with daylight; storage is what carries the night. */
const INTENSITY=[{k:'gentle',rate:0.72,spoil:0.5,draw:0.8},
                 {k:'steady',rate:1.00,spoil:1.0,draw:1.0},
                 {k:'hard',  rate:1.45,spoil:2.4,draw:1.35}];
function intensity(){ return INTENSITY[s.intensity||1]; }
function daylight(){ return 0.35+0.65*Math.max(0,Math.sin(s.clock*Math.PI*2/110)); }
function powSupplyNow(){ return powSupply()*daylight(); }
function bufferCap(){ return 900*(s.pickers+s.pressers+s.lines+20); }
function pollination(){ return s.swarmOn?1+Math.min(0.9,s.swarm*s.mood*0.00006):1; }

function stageRates(eff){
  const b=pollination()*eff*boostMul('run',2.5), I=intensity();
  return {
    pick : s.pickers*12*s.pickMult*b*I.rate,
    press: s.pressers*12*s.pressMult*b,
    line : s.lines*12*s.lineMult*b
  };
}
function bottleneck(){
  const r=stageRates(s.eff===undefined?1:s.eff);
  if(s.pickers+s.pressers+s.lines===0)return 'nothing built';
  const m=Math.min(r.pick,r.press,r.line);
  return m===r.pick?'picking':m===r.press?'pressing':'bottling';
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
  if(s.pulp>cap){ const l=(s.pulp-cap)*0.06*sp*dt; s.pulp-=l; lost+=l; }
  if(s.ofruit>cap){ const l=(s.ofruit-cap)*0.06*sp*dt; s.ofruit-=l; lost+=l; }
  s.spoiled=(s.spoiled||0)+lost;
  s.spoilRate=lost/Math.max(dt,0.001);

  s.orate=r.line;
  if(s.mass<=0&&!s.seen.emptied){
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
  if(s.mood>0.55)s.swarm+=s.swarm*0.015*dt*(s.mood-0.5);
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
function allocUsed(){ return TRAITS.reduce((a,t)=>a+s.alloc[t[0]],0); }
function sporeCost(){
  const base=5e7*Math.pow(1.0008,s.launched);
  /* losing every spore must never be terminal — you can always reseed */
  if(s.spores<1) return Math.min(base, Math.max(1, s.jars*0.4));
  return base;
}
function spd(){ return s.spdMult||1; }

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
    s.explored=clamp(s.explored+s.spores*(a.speed+1)*(a.explore+1)*5e-9*spd()*dt,0,1);
    const gather=(a.harvest+1)*(a.press+1)*(a.factory+1);
    const rateFrac=s.spores*gather*4.5e-11*spd()*s.explored*boostMul('run',3);
    const before=s.converted;
    s.converted=clamp(s.converted+rateFrac*dt,0,1);
    const gained=(s.converted-before)*UNI_JARS;
    s.made+=gained; s.jars+=gained; pulseJars+=gained;
    s.convRate=rateFrac;
    if(a.replicate>0&&s.converted<1){
      s.spores+=s.spores*a.replicate*0.0016*spd()*dt;
    }
    const hazard=s.spores*(0.010/(1+a.hazard*0.9))*dt;
    s.spores=Math.max(0,s.spores-hazard); s.lost+=hazard;
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
        const dead=Math.min(s.spores,s.drifters*dt*0.4);
        s.spores-=dead;s.lost+=dead;
        s.drifters+=s.drifters*dt*0.02;
      }
      s.drifters=Math.max(0,s.drifters);
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
    'The starter does not stay in the pan. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.',
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
      s.jars=Math.max(s.made*0.8,5e6);
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
      s.jars=Math.max(s.jars,s.made);
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
    return '<div class="alloc"><span>'+t(tr[1])+'</span><button data-t="'+t[0]+'" data-d="-1" type="button">−</button>'+
      '<b id="al_'+tr[0]+'">'+s.alloc[tr[0]]+'</b><button data-t="'+tr[0]+'" data-d="1" type="button">+</button></div>';
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

let recipeSig='';
function drawRecipes(force){
  const list=R.filter(r=>!s.recipes[r.id]&&r.act===s.act&&r.when());
  const sig=list.map(r=>r.id+(canAfford(r)?'1':'0')).join(',');
  if(sig===recipeSig&&!force)return;
  recipeSig=sig;
  $('#recipeEmpty').classList.toggle('hidden',list.length>0);
  $('#recipeList').innerHTML=list.map(r=>
    '<button class="recipe" data-id="'+r.id+'"'+(canAfford(r)?'':' disabled')+'>'+
    '<div class="r-top"><span class="r-name">'+t(r.n||r.name)+'</span><span class="r-cost">'+recipeCost(r)+'</span></div>'+
    '<div class="r-desc">'+t(r.d||r.desc)+'</div></button>').join('');
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
  if(b==='picking')return {en:'Picking is the slowest stage, so the pressers and the lines are idle.',
                           fr:'La récolte est l\u2019étape la plus lente : les presses et les lignes tournent à vide.'};
  if(b==='pressing')return {en:'Pressing cannot keep up, so pulp is overflowing its buffer.',
                            fr:'Le pressage ne suit pas : la pulpe déborde de sa réserve.'};
  return {en:'Bottling cannot keep up, so pressed fruit is overflowing its buffer.',
          fr:'La mise en pot ne suit pas : les fruits pressés débordent de leur réserve.'};
}


/* One sentence saying what the two bars mean and what to do about it.
   The playtester read the old bar as "raise the price to make more money",
   which is the opposite of how the curve works. */
function marketWhy(want,make,moving){
  if(make<=0&&s.jars<1)return {en:'Nothing is being made yet. Stir the pot.',
                               fr:'Rien n\u2019est encore produit. Remuez la marmite.'};
  if(!s.autoSell)return {en:'Nobody delivers for you yet. Jars move only when somebody comes to the door and you serve them.',
                         fr:'Personne ne livre pour vous. Les pots ne partent que si quelqu\u2019un se présente et que vous le servez.'};
  if(moving<want*0.75){
    if(make>want*1.1)return {en:'Your sellers reach only a fraction of the people who want a jar, so the rest pile up. Hire someone.',
                             fr:'Vos vendeurs n\u2019atteignent qu\u2019une partie de ceux qui veulent un pot : le reste s\u2019accumule. Embauchez quelqu\u2019un.'};
    return {en:'People want more than your sellers can deliver. Hire someone.',
            fr:'On en veut plus que vos vendeurs ne peuvent livrer. Embauchez quelqu\u2019un.'};
  }
  if(want<make*0.75)return {en:'You are making more than people want at this price. Lower it, or sell to more people.',
                            fr:'Vous produisez plus qu\u2019on n\u2019en veut à ce prix. Baissez-le, ou touchez plus de monde.'};
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
  b.innerHTML=visitorGlyph(cfg.glyph);
  /* the margins, never over a control */
  const left=Math.random()<0.5;
  b.style.left=left?(4+Math.random()*3)+'vw':(88+Math.random()*4)+'vw';
  b.style.top=(18+Math.random()*58)+'vh';
  b.style.setProperty('--drift',(left?1:-1)*(6+Math.random()*10)+'px');
  b.onclick=()=>takeVisitor(b);
  document.body.appendChild(b);
  visitorEl=b;
  sfx.warn();
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
 'exCash','exValue','exReturn','exHoldings','exRisk','sugarVal','sugarEffect','sugarCost','sugarWant',
 'doorCount','walkedOff','oBottle','oSpoil','powDay','blightLeft','tasteBar','tasteNext','objText','soldByHand','sellerCount','shopCount','reachPct','tRuns','tWon','tGrid','tRank',
 'oMatter','oPulp','oFruit','oRate','dPickers','dPressers','dFactories',
 'powSupply','powDemand','powMeter','powStored','swCount','swMood','swBar','swGift',
 'spCount','spLaunched','spLost','spExplored','spConverted','sporeCost','allocFree',
 'cbDrifters','cbWins','cbHonor','cbLog','vesselCap'].forEach(id=>el[id]=document.getElementById(id));

/* Look the node up on first use if it was not in the list above, so a new
   readout can never fail silently just because the id was never registered.
   Three live readouts were frozen this way before the fallback existed. */
function set(k,v){
  let n=el[k];
  if(n===undefined)n=el[k]=document.getElementById(k);
  if(n&&n.textContent!==v)n.textContent=v;
}

/* ---- the door -------------------------------------------------------
   The marks are rebuilt only when the count changes, so the arrival
   animation plays once per person instead of sixty times a second. */
let doorShown=-1;
function drawDoor(){
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
  const why=$('#doorWhy');
  if(why)why.textContent=t(
    (s.queue||0)>=cap-0.05
      ? {en:'The doorstep is full and people have started giving up. Sell faster, or pay somebody to reach them for you.',
         fr:'Le pas de la porte est plein et certains renoncent déjà. Vendez plus vite, ou payez quelqu\u2019un pour aller à eux.'}
    : walkInPerSec()<0.25
      ? {en:'At this price almost nobody is walking up. Lower it and the doorstep fills faster.',
         fr:'À ce prix, presque personne ne se déplace. Baissez-le et le pas de la porte se remplira plus vite.'}
    : {en:'Anyone your sellers cannot reach comes to the door instead. They do not wait long.',
       fr:'Ceux que vos vendeurs n\u2019atteignent pas viennent frapper à la porte. Ils n\u2019attendent pas longtemps.'});
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
    set('crateSize',fmt(s.crate));
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
    const moving=Math.min(servicedPerSec(), s.jars>1?Infinity:make);
    set('sellRate',rate(moving)+' '+t('/sec'));
    set('backlog',fmt(Math.floor(s.jars)));
    set('revRate',money(moving*(s.price-sugarCostPerJar()))+' '+t('/sec'));
    const why=$('#marketWhy');
    if(why)why.textContent=t(marketWhy(want,make,moving));
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
    if(bandWrap)bandWrap.classList.toggle('on',Math.abs(s.sugar-peak)<=tol*0.5);
    const sWhy=$('#sugarWhy');
    if(sWhy)sWhy.textContent=t(s.price<2.6
      ? {en:'At this price people are buying sweetness, and they will forgive a lot of it. Sugar is not free, though.',
         fr:'À ce prix, les gens achètent du sucre, et ils pardonnent beaucoup. Le sucre n\u2019est pas gratuit pour autant.'}
      : s.price>5.2
      ? {en:'At this price people read the label. They want fruit, and they notice when it is not there.',
         fr:'À ce prix, les gens lisent l\u2019étiquette. Ils veulent du fruit, et ils remarquent quand il n\u2019y en a pas.'}
      : {en:'Change the price and the crowd changes with it. So does what they want in the jar.',
         fr:'Changez le prix et la clientèle change avec. Ce qu\u2019elle veut dans le pot aussi.'});
    set('mktLevel',String(s.mkt));
    set('mktCost',money(mktCost()));
    $('#buyFruit').disabled=s.cash<s.cratePrice;
    $('#buySpoon').disabled=s.cash<spoonCost(s.spoons);
    $('#buyWorks').disabled=s.cash<worksCost(s.works);
    $('#buyMkt').disabled=s.cash<mktCost();
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
    const rWhy=$('#reachWhy');
    if(rWhy)rWhy.textContent=s.autoSell
      ? tf('Your sellers get to {0} of the {1} jars a second people want. Everyone else has to come to the door.',
           rate(servicedPerSec()),rate(demand()))
      : t('Nobody sells for you yet. Every jar leaves through the front door, one at a time.');
    set('sellerCost',money(sellerCost()));
    set('shopCost',money(shopCost()));
    $('#hireSeller').disabled=s.cash<sellerCost();
    $('#openShop').disabled=s.cash<shopCost();
    if((s.sellers||0)>=4)$('#openShop').classList.remove('hidden');
  }
  set('insp',fmt(Math.floor(s.insp)));
  el.inspBar.style.width=clamp(s.insp/inspMax()*100,0,100)+'%';
  set('creativity',fmt(Math.floor(s.crea)));
  set('taste',String(s.taste));
  const tn=nextTasteAt();
  set('tasteNext',tn===null?'—':fmt(tn)+' '+t('jars'));
  if(el.tasteBar)el.tasteBar.style.width=(tasteProgress()*100).toFixed(1)+'%';
  /* the larder running dry stops the only verb in the game, so it gets a
     stamp on the panel rather than a line in a list */
  const stamp=$('#larderStamp');
  if(stamp){
    const dry=s.act===1&&s.fruit<1;
    if(dry!==stamp.classList.contains('on')){
      stamp.classList.toggle('on',dry);
      if(dry)sfx.warn();
    }
  }
  /* a live boost has to say so, and say how long is left */
  const bl=$('#boostLine');
  if(bl){
    const left=boostLeft();
    bl.classList.toggle('hidden',left<=0);
    if(left>0)bl.textContent=tf('Everything is running at triple for {0}s.',Math.ceil(left));
  }
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
    if(ex)ex.textContent=t('Each palate is a rule for choosing.')+' '+t(STRATS[s.tour.strat].n)+
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
    const why=$('#pipeWhy');
    if(why)why.textContent=(s.pickers+s.pressers+s.lines===0)
      ? t({en:'Nothing is built yet. Pickers turn the orchard into pulp.',
           fr:'Rien n\u2019est encore construit. Les récolteuses transforment le verger en pulpe.'})
      : t({en:'Throughput is set by the slowest stage. Building past it is waste.',
           fr:'Le débit est fixé par l\u2019étape la plus lente. Construire au-delà est du gaspillage.'});
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
    $('#buyPicker').textContent=t('Build picker')+' · '+fmt(pickerCost(s.pickers));
    $('#buyPresser').textContent=t('Build presser')+' · '+fmt(presserCost(s.pressers));
    $('#buyFactory').textContent=t('Build line')+' · '+fmt(lineCost(s.lines));
    $('#buySun').textContent=t('Sun trap')+' · '+fmt(sunCost(s.sun));
    $('#buyBattery').textContent=t('Cellar')+' · '+fmt(battCost(s.batt));
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
       ['buyMkt',mktCost(),s.cash],['buyFruit',s.cratePrice,s.cash],
       ['hireSeller',sellerCost(),s.cash],['openShop',shopCost(),s.cash]]
    : s.act===2
    ? [['buyPicker',pickerCost(s.pickers),s.jars],['buyPresser',presserCost(s.pressers),s.jars],
       ['buyFactory',lineCost(s.lines),s.jars],['buySun',sunCost(s.sun),s.jars],
       ['buyBattery',battCost(s.batt),s.jars]]
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
  drawJar(level,active,dt);
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
function autoPulse(dt){
  pulseAcc+=dt;
  if(pulseAcc<PULSE_EVERY)return;
  pulseAcc=0;
  const jarNode=document.getElementById(s.act===1?'jars':'barJars'),
        cashNode=document.getElementById('barCash');
  if(pulseJars>=0.5&&jarNode&&!jarNode.parentElement.classList.contains('hidden')){
    floatFrom(jarNode,'+'+fmt(Math.round(pulseJars)));
    bump(jarNode);
  }
  if(pulseCash>0.005&&cashNode){ floatFrom(cashNode,'+'+money(pulseCash),'good'); }
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
    if(cx===undefined)floatFrom(node,'+'+fmt(got),'good');
    else { floatText('+'+fmt(got),cx,cy-10,'good'); splash(cx,cy,5+Math.min(6,Math.floor(got/2))); }
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
const potEl=$('#potSvg');
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
  s.cash-=c; s.sellers=(s.sellers||0)+1; floatFrom(e.currentTarget,'+1','good'); sfx.buy();
};
$('#openShop').onclick=e=>{
  const c=shopCost();
  if(s.cash<c){ shake(e.currentTarget); sfx.bad(); return; }
  s.cash-=c; s.shops=(s.shops||0)+1; floatFrom(e.currentTarget,'+1','good'); sfx.buy();
  note({en:'A shop opens. Jars leave without anyone asking you.',fr:'Une boutique ouvre. Les pots partent sans qu\u2019on vous demande.'},'hi');
};
$('#buyFruit').onclick=e=>{ if(buyFruit()){floatFrom(e.currentTarget,'+'+fmt(s.crate),'good');sfx.buy();} else {shake(e.currentTarget);sfx.bad();} };
$('#autoFruit').onclick=()=>{s.autoFruit=!s.autoFruit;updateAutoBtn()};
$('#buySpoon').onclick=()=>{const c=spoonCost(s.spoons);if(s.cash>=c){s.cash-=c;s.spoons++;sfx.buy()}};
$('#buySpoon10').onclick=e=>{let n=0;for(let i=0;i<10;i++){const c=spoonCost(s.spoons);if(s.cash<c)break;s.cash-=c;s.spoons++;n++}
  if(n){sfx.buy()}else{toast(t('Not enough cash.'));shake(e.currentTarget);sfx.bad()}};
$('#buyWorks').onclick=()=>{const c=worksCost(s.works);if(s.cash>=c){s.cash-=c;s.works++;sfx.buy()}};
$('#buyWorks10').onclick=e=>{let n=0;for(let i=0;i<10;i++){const c=worksCost(s.works);if(s.cash<c)break;s.cash-=c;s.works++;n++}
  if(n){sfx.buy()}else{toast(t('Not enough cash.'));shake(e.currentTarget);sfx.bad()}};


$('#buyMkt').onclick=()=>{const c=mktCost();if(s.cash>=c){s.cash-=c;s.mkt++;sfx.buy();note({en:'Word of mouth is at level '+s.mkt+' now.',
      fr:'Le bouche-à-oreille passe au niveau '+s.mkt+'.'},'dim')}};
$('#buyOven').onclick=()=>{if(s.taste>=1){s.taste--;s.ovens++;sfx.buy()}};
$('#buyCellar').onclick=()=>{if(s.taste>=1){s.taste--;s.cellars++;sfx.buy()}};
const priceStep=()=>s.price<2?0.05:s.price<5?0.10:0.25;
holdable($('#priceUp'),  ()=>{ s.price=Math.min(PRICE_MAX,Math.round((s.price+priceStep())*100)/100); });
holdable($('#priceDown'),()=>{ s.price=Math.max(PRICE_MIN,Math.round((s.price-priceStep())*100)/100); });
holdable($('#buySpoon'), ()=>{ const c=spoonCost(s.spoons); if(s.cash>=c){s.cash-=c;s.spoons++;stirKick(3);} });
holdable($('#sugarUp'),  ()=>{ s.sugar=clamp(Math.round(s.sugar+1),0,100); });
holdable($('#sugarDown'),()=>{ s.sugar=clamp(Math.round(s.sugar-1),0,100); });
$('#treatBlight').onclick=e=>{ const b=s.blight; treatBlight(); if(!s.blight&&b)floatFrom(e.currentTarget,'✓','good'); else shake(e.currentTarget); };
$('#intensityRow').querySelectorAll('button').forEach(b=>b.onclick=()=>setIntensity(+b.dataset.i));
holdable($('#buyWorks'), ()=>{ const c=worksCost(s.works); if(s.cash>=c){s.cash-=c;s.works++;stirKick(5);} });

$('#readCulture').onclick=e=>{
  const before=s.insp;
  readCulture();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); bump($('#insp')); sfx.sell(); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); bump($('#insp'),'bump-bad'); shake($('#pCulture')); sfx.bad(); }
};
$('#exStakeRow').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  s.ex.stake=+b.dataset.stake;
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
$('#exRisk').onclick=()=>{s.ex.risk=(s.ex.risk+1)%3;$('#exRisk').textContent=t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk])};
$('#tRun').onclick=e=>{
  const before=s.insp;
  runTournament(); drawTournament();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); }
};
$('#tStrat').onclick=()=>{s.tour.strat=(s.tour.strat+1)%s.tour.unlocked};
$('#buyPicker').onclick=e=>buyN('picker',1,e.currentTarget);
$('#buyPicker10').onclick=e=>buyN('picker',10,e.currentTarget);
$('#buyPresser').onclick=e=>buyN('presser',1,e.currentTarget);
$('#buyPresser10').onclick=e=>buyN('presser',10,e.currentTarget);
$('#buyFactory').onclick=e=>buyN('line',1,e.currentTarget);
$('#buyFactory10').onclick=e=>buyN('line',10,e.currentTarget);
$('#buySun').onclick=e=>buyN('sun',1,e.currentTarget);
$('#buyBattery').onclick=e=>buyN('batt',1,e.currentTarget);
$('#swWork').onclick=()=>{s.swarmWork=clamp(s.swarmWork+0.1,0,1)};
$('#swPlay').onclick=()=>{s.swarmWork=clamp(s.swarmWork-0.1,0,1)};
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
    if(s.recipes.geometry)show('pWorks'); if(s.crea>0)show('rCreativity');
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
