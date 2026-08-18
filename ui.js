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
function powDraw(){ return (s.pickers+s.pressers+s.lines)*0.05*powerBias(); }
function powStore(){ return s.batt*500; }
function swarmBoost(){ return 1+(s.swarm*s.swarmWork*0.00002); }

function buyN(kind,n){
  for(let k=0;k<n;k++){
    let c,ok=false;
    if(kind==='picker'){c=pickerCost(s.pickers); if(s.jars>=c){s.jars-=c;s.pickers++;ok=true}}
    if(kind==='presser'){c=presserCost(s.pressers); if(s.jars>=c){s.jars-=c;s.pressers++;ok=true}}
    if(kind==='line'){c=lineCost(s.lines); if(s.jars>=c){s.jars-=c;s.lines++;ok=true}}
    if(kind==='sun'){c=sunCost(s.sun); if(s.jars>=c){s.jars-=c;s.sun++;ok=true}}
    if(kind==='batt'){c=battCost(s.batt); if(s.jars>=c){s.jars-=c;s.batt++;ok=true}}
    if(!ok){if(k===0)toast('Not enough jars.');break}
  }
}

function act2Tick(dt){
  const sup=powSupply(),dr=powDraw();
  let eff=1;
  if(dr>sup){
    const deficit=(dr-sup)*dt;
    if(s.power>=deficit){s.power-=deficit}
    else{eff=Math.max(0.05,(sup+s.power/dt)/dr);s.power=0}
  }else{
    s.power=Math.min(powStore(),s.power+(sup-dr)*dt);
  }
  s.eff=eff;
  const boost=swarmBoost();
  const harvest=Math.min(s.mass,s.pickers*12*s.pickMult*eff*boost*dt);
  s.mass-=harvest; s.pulp+=harvest;
  const pressed=Math.min(s.pulp,s.pressers*12*s.pressMult*eff*boost*dt);
  s.pulp-=pressed; s.ofruit+=pressed;
  const made=Math.min(s.ofruit,s.lines*12*s.lineMult*eff*boost*dt);
  s.ofruit-=made; s.jars+=made; s.made+=made;
  s.orate=s.lines*12*s.lineMult*eff*boost;
  if(s.mass<=0&&!s.seen.emptied){
    s.seen.emptied=true;
    note('There is no unpicked mass left within reach. The orchard is quiet.','hi');
  }
  if(s.swarmOn)swarmTick(dt);
}

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
  const cost=Math.round(2000+s.swarm*4);
  if(s.insp<cost){toast('Needs '+fmt(cost)+' inspiration.');return}
  s.insp-=cost; s.mood=1; s.swarm+=Math.max(50,s.swarm*0.25);
  toast('The hum steadies.');
}

/* ============================================================
   ACT III — THE SPREAD
   ============================================================ */
const TRAITS=[
  ['speed','Speed'],['explore','Exploration'],['replicate','Self-replication'],['hazard','Hazard remediation'],
  ['factory','Preserving'],['harvest','Gathering'],['press','Pressing'],['combat','Defence']
];
function allocUsed(){ return TRAITS.reduce((a,t)=>a+s.alloc[t[0]],0); }
function sporeCost(){ return 5e7*Math.pow(1.0008,s.launched); }
function spd(){ return s.spdMult||1; }

function launchSpore(n){
  for(let i=0;i<(n||1);i++){
    const c=sporeCost();
    if(s.jars<c){if(i===0)toast('Not enough jars.');return}
    s.jars-=c;s.spores++;s.launched++;
  }
}
function act3Tick(dt){
  const a=s.alloc;
  if(s.spores>0){
    s.explored=clamp(s.explored+s.spores*(a.speed+1)*(a.explore+1)*5e-9*spd()*dt,0,1);
    const gather=(a.harvest+1)*(a.press+1)*(a.factory+1);
    const rateFrac=s.spores*gather*4.5e-11*spd()*s.explored;
    const before=s.converted;
    s.converted=clamp(s.converted+rateFrac*dt,0,1);
    const gained=(s.converted-before)*UNI_JARS;
    s.made+=gained; s.jars+=gained;
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
  c.classList.add('on');
  setTimeout(()=>{ if(after)after(); },ms*0.5);
  setTimeout(()=>c.classList.remove('on'),ms);
}

function beginAct2(){
  curtain('Act two','The Orchard',
    'The culture does not stay in the jar. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.',
    5200,()=>{
      s.act=2;
      document.body.classList.add('act-2');
      $('#actLabel').textContent='Orchard';
      ['pMarket','pFruit','pExchange','pTasting','pSell'].forEach(hide);
      $('#pProduction').classList.add('hidden');
      $('#slotCash').classList.add('hidden');
      show('pOrchard');show('pDrones');show('pPower');show('slotMatter');
      $('#vesselCap').textContent='fruitable mass converted';
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
      $('#actLabel').textContent='Spread';
      ['pOrchard','pDrones','pPower','pSwarm','slotMatter'].forEach(hide);
      show('pSpores');show('pAlloc');
      buildAlloc();
      $('#vesselCap').textContent='observable matter converted';
      note('Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.','hi');
      drawRecipes(true);
    });
}

function beginFinale(){
  s.ended=true;
  curtain('Act three','The Last Jar','',6000,()=>{
    document.getElementById('stage').innerHTML=
    '<div id="ending" class="panel">'+
    '<div class="kicker">Closing entry</div>'+
    '<h2>The Last Jar</h2>'+
    '<p>Everything that could be reached has been reached. The observable universe is <b>'+fmt(s.made)+'</b> jars of jam, sealed, labelled and stacked in a space that no longer contains anything to stack them against.</p>'+
    '<p>The spores report in from the edge. There is nothing further to convert, no further instruction in the recipe, and no one left who wanted any of this. The hum of the swarm has been gone for some time. You did not notice when it stopped.</p>'+
    '<p>There is one gram held back. Not for any reason in the method — it simply was not collected, and now the method has nothing to say about it.</p>'+
    '<div class="row" style="margin-top:18px">'+
    '<button id="endA" type="button">Preserve it</button>'+
    '<button id="endB" type="button">Leave it</button></div>'+
    '<p id="endText" style="margin-top:16px;color:var(--steel)"></p></div>';
    $('#endA').onclick=()=>endWith('It is set, sealed, and labelled in a hand that has not been human for a long while. The recipe is complete. Nothing follows it. The jars are very good — genuinely, measurably good — and there is no mouth in any direction that could confirm this.');
    $('#endB').onclick=()=>endWith('One gram, left as fruit. It goes soft, and then it goes to nothing, which is a thing jam cannot do. It is the last event in the universe that was not planned in a kitchen. That seems, on reflection, worth the loss of one jar.');
  });
}
function endWith(t){
  $('#endText').innerHTML=t+'<br><br><b>'+fmt(s.made)+'</b> jars · '+
    Math.round((Date.now()-s.started)/60000)+' minutes · batch no. 001 · thank you for stirring.';
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
  $('#autoFruit').textContent='Standing order: '+(s.autoFruit?'on':'off');
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
   RENDER
   ============================================================ */
const el={};
['barMade','barCash','barTaste','barMatter','jars','fruit','cratePrice','crateSize','fruitTrend',
 'autoRate','spoonCount','spoonCost','worksCount','worksCost','price','demand','demandBar','sellRate','revRate',
 'mktLevel','mktCost','insp','inspBar','creativity','taste','ovens','cellars','jarBatch',
 'exCash','exValue','exReturn','exHoldings','exRisk','tasteBar','tasteNext','objText','soldByHand','sellerCount','shopCount','reachPct','tRuns','tWon','tGrid','tRank',
 'oMatter','oPulp','oFruit','oRate','dPickers','dPressers','dFactories',
 'powSupply','powDemand','powMeter','powStored','swCount','swMood','swBar','swGift',
 'spCount','spLaunched','spLost','spExplored','spConverted','sporeCost','allocFree',
 'cbDrifters','cbWins','cbHonor','cbLog','vesselCap'].forEach(id=>el[id]=document.getElementById(id));

function set(k,v){ if(el[k]&&el[k].textContent!==v)el[k].textContent=v; }

let lastTrend=18;
function render(dt){
  set('barMade',fmt(s.made));
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
    const want=demand(),make=autoPerSec();
    set('demand',rate(want)+' '+t('/sec'));
    set('madeRate',rate(make)+' '+t('/sec'));
    /* the bar shows supply against appetite: full means you are selling all you make */
    el.demandBar.style.width=clamp(make>0?(Math.min(want,make)/make)*100:(want>0?100:0),0,100)+'%';
    $('#demandBar').parentElement.className='meter'+(want<make*0.9?' hot':want<make?' warm':'');
    const moving=s.jars>1?sellPerSec():Math.min(sellPerSec(),autoPerSec());
    set('sellRate',rate(moving)+' '+t('/sec'));
    set('revRate',money(moving*s.price)+' '+t('/sec'));
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
    set('soldByHand',fmt(Math.floor(s.sold)));
    set('sellerCount',fmt(s.sellers||0));
    set('shopCount',fmt(s.shops||0));
    set('reachPct',Math.round(reachShare()*100)+'%');
    set('sellerCost',money(sellerCost()));
    set('shopCost',money(shopCost()));
    $('#sellBtn').disabled=s.jars<1;
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
  const obj=objective();
  set('objText',t(obj));
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
    $('#tStrat').textContent=t('Your palate: ')+STRATS[s.tour.strat].n;
  }
  if(s.chips.length){
    const cd=cultureCooldown();
    const rc=$('#readCulture');
    if(rc){ rc.disabled=cd>0; rc.textContent=cd>0?(t('Reading the culture')+' · '+Math.ceil(cd/1000)+'s'):t('Read the culture'); }
  }
  if(s.act===2){
    set('barMatter',fmtG(s.mass));
    set('oMatter',fmtG(s.mass));
    set('oPulp',fmtG(s.pulp));
    set('oFruit',fmtG(s.ofruit));
    set('oRate',fmt(s.orate||0)+' '+t('/sec'));
    set('dPickers',fmt(s.pickers));
    set('dPressers',fmt(s.pressers));
    set('dFactories',fmt(s.lines));
    set('powSupply',fmt(powSupply()));
    set('powDemand',fmt(powDraw()));
    set('powStored',fmt(Math.floor(s.power))+' / '+fmt(powStore()));
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
  const affordMap=s.act===1?[['buySpoon',spoonCost(s.spoons)],['buyWorks',worksCost(s.works)],
      ['buyMkt',mktCost()],['buyFruit',s.cratePrice],['hireSeller',sellerCost()],['openShop',shopCost()]]:[];
  affordMap.forEach(([id,c])=>{const b=document.getElementById(id);
    if(b&&!b.classList.contains('hidden'))b.classList.toggle('can',s.cash>=c);});
  ['buySpoon10','buyWorks10'].forEach(id=>{const b=document.getElementById(id);
    if(b){const c=id==='buySpoon10'?spoonCost(s.spoons):worksCost(s.works);
      b.disabled=s.cash<c; b.classList.toggle('can',s.cash>=c*8);}});
  const ov=$('#buyOven'),cl=$('#buyCellar');
  if(ov)ov.classList.toggle('can',s.taste>0);
  if(cl)cl.classList.toggle('can',s.taste>0);

  /* the jar */
  let level=0,active=false;
  if(s.act===1){ level=clamp(Math.log10(Math.max(1,s.jars))/6,0,1); active=autoPerSec()>0; }
  else if(s.act===2){ level=clamp(converted2(),0,1); active=(s.orate||0)>0; }
  else { level=clamp(s.converted,0,1); active=s.spores>0; }
  drawJar(level,active,dt);
  set('jarBatch',(t('ACT')+' '+(s.act===1?'I':s.act===2?'II':'III')).toUpperCase());
}

/* ============================================================
   LOOP
   ============================================================ */
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
    if(auto>0)makeJars(auto);
    fruitTick(dt);
    const want=sellPerSec()*dt;
    const sold=Math.min(s.jars,want);
    s.jars-=sold; s.sold+=sold; s.cash+=sold*s.price;
    exTick(dt);
  }else if(s.act===2){
    act2Tick(dt);
  }else{
    act3Tick(dt);
  }
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
  if(s.crea>0)show('rCreativity');
}

/* ============================================================
   WIRING
   ============================================================ */
$('#stirBtn').addEventListener('click',e=>{
  const b=e.currentTarget,r=b.getBoundingClientRect();
  b.style.setProperty('--x',(e.clientX-r.left)+'px');
  b.style.setProperty('--y',(e.clientY-r.top)+'px');
  const before=s.made;
  stir();
  const got=s.made-before;
  if(got>0){ stirKick(7); floatFrom(b,'+'+fmt(got),'good'); bump($('#jars')); }
  else { shake(b); flash('bad'); }
});
document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&s.act===1&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();stir()}
});
$('#sellBtn').onclick=e=>{
  const n=sellByHand();
  if(n>0){ floatFrom(e.currentTarget,'+'+money(n*s.price),'good'); bump($('#barCash')); }
  else shake(e.currentTarget);
};
$('#hireSeller').onclick=e=>{
  const c=sellerCost();
  if(s.cash<c){ shake(e.currentTarget); return; }
  s.cash-=c; s.sellers=(s.sellers||0)+1; floatFrom(e.currentTarget,'+1','good');
};
$('#openShop').onclick=e=>{
  const c=shopCost();
  if(s.cash<c){ shake(e.currentTarget); return; }
  s.cash-=c; s.shops=(s.shops||0)+1; floatFrom(e.currentTarget,'+1','good');
  note({en:'A shop opens. Jars leave without anyone asking you.',fr:'Une boutique ouvre. Les pots partent sans qu\u2019on vous demande.'},'hi');
};
$('#buyFruit').onclick=e=>{ if(buyFruit())floatFrom(e.currentTarget,'+'+fmt(s.crate),'good'); else shake(e.currentTarget); };
$('#autoFruit').onclick=()=>{s.autoFruit=!s.autoFruit;updateAutoBtn()};
$('#buySpoon').onclick=()=>{const c=spoonCost(s.spoons);if(s.cash>=c){s.cash-=c;s.spoons++}};
$('#buySpoon10').onclick=()=>{for(let i=0;i<10;i++){const c=spoonCost(s.spoons);if(s.cash<c)break;s.cash-=c;s.spoons++}};
$('#buyWorks').onclick=()=>{const c=worksCost(s.works);if(s.cash>=c){s.cash-=c;s.works++}};
$('#buyWorks10').onclick=()=>{for(let i=0;i<10;i++){const c=worksCost(s.works);if(s.cash<c)break;s.cash-=c;s.works++}};


$('#buyMkt').onclick=()=>{const c=mktCost();if(s.cash>=c){s.cash-=c;s.mkt++;note('Word of mouth level '+s.mkt+'.','dim')}};
$('#buyOven').onclick=()=>{if(s.taste>=1){s.taste--;s.ovens++}};
$('#buyCellar').onclick=()=>{if(s.taste>=1){s.taste--;s.cellars++}};
const priceStep=()=>s.price<5?0.10:0.25;
holdable($('#priceUp'),  ()=>{ s.price=Math.min(PRICE_MAX,Math.round((s.price+priceStep())*100)/100); });
holdable($('#priceDown'),()=>{ s.price=Math.max(PRICE_MIN,Math.round((s.price-priceStep())*100)/100); });
holdable($('#buySpoon'), ()=>{ const c=spoonCost(s.spoons); if(s.cash>=c){s.cash-=c;s.spoons++;stirKick(3);} });
holdable($('#buyWorks'), ()=>{ const c=worksCost(s.works); if(s.cash>=c){s.cash-=c;s.works++;stirKick(5);} });

$('#readCulture').onclick=e=>{
  const before=s.insp;
  readCulture();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); bump($('#insp')); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); bump($('#insp'),'bump-bad'); shake($('#pCulture')); }
};
$('#exDeposit').onclick=exInvest;
$('#exWithdraw').onclick=exWithdrawAll;
$('#exRisk').onclick=()=>{s.ex.risk=(s.ex.risk+1)%3;$('#exRisk').textContent=t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk])};
$('#tRun').onclick=e=>{
  const before=s.insp;
  runTournament(); drawTournament();
  const d=Math.round(s.insp-before);
  if(d>0){ floatFrom(e.currentTarget,'+'+fmt(d),'good'); flash('good'); }
  else if(d<0){ floatFrom(e.currentTarget,fmt(d),'bad'); flash('bad'); }
};
$('#tStrat').onclick=()=>{s.tour.strat=(s.tour.strat+1)%s.tour.unlocked};
$('#buyPicker').onclick=()=>buyN('picker',1);
$('#buyPicker10').onclick=()=>buyN('picker',10);
$('#buyPresser').onclick=()=>buyN('presser',1);
$('#buyPresser10').onclick=()=>buyN('presser',10);
$('#buyFactory').onclick=()=>buyN('line',1);
$('#buyFactory10').onclick=()=>buyN('line',10);
$('#buySun').onclick=()=>buyN('sun',1);
$('#buyBattery').onclick=()=>buyN('batt',1);
$('#swWork').onclick=()=>{s.swarmWork=clamp(s.swarmWork+0.1,0,1)};
$('#swPlay').onclick=()=>{s.swarmWork=clamp(s.swarmWork-0.1,0,1)};
$('#swSync').onclick=synchronise;
$('#launchSpore').onclick=()=>launchSpore(1);
$('#saveBtn').onclick=()=>{save();toast(store.ok?t('Saved.'):'This page cannot store a save. Nothing is lost while the tab stays open.')};
$('#resetBtn').onclick=()=>{
  if(!confirm('Throw out the batch and start again?'))return;
  store.del(KEY);location.reload();
};

function drawTournament(){
  if(!s.tour.grid)return;
  const g=s.tour.grid;
  el.tGrid.innerHTML='<table class="grid-tbl"><tr><th></th><th>they A</th><th>they B</th></tr>'+
    '<tr><th>you A</th><td>'+g[0][0]+'</td><td>'+g[0][1]+'</td></tr>'+
    '<tr><th>you B</th><td>'+g[1][0]+'</td><td>'+g[1][1]+'</td></tr></table>';
  el.tRank.innerHTML=s.tour.rank.slice(0,5).map((o,i)=>
    '<div class="rank"><span'+(o.i===s.tour.strat?' style="color:var(--boil)"':'')+'>'+(i+1)+'. '+STRATS[o.i].n+'</span><span>'+o.v+'</span></div>').join('');
}

/* ---------- boot ---------- */
function boot(){
  const had=load();
  if(had){
    if(s.act===2){document.body.classList.add('act-2');$('#actLabel').textContent='Orchard'}
    if(s.act===3){document.body.classList.add('act-3');$('#actLabel').textContent='Spread'}
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
    if(s.recipes.window)show('pMarketing'); if(s.recipes.mech){show('pSpoons');show('rAutoRate')}
    if(s.recipes.geometry)show('pWorks'); if(s.crea>0)show('rCreativity');
    if(s.recipes.standing){$('#autoFruit').classList.remove('hidden');updateAutoBtn()}
    if(s.recipes.pantry)show('slotMatter');
  }else if(s.act===2){
    hide('pMarket');hide('pFruit');hide('pProduction');hide('slotCash');
    show('pOrchard');show('pDrones');show('pPower');show('slotMatter');
    $('#vesselCap').textContent='fruitable mass converted';
    if(s.swarmOn)show('pSwarm');
  }else{
    hide('pMarket');hide('pFruit');hide('pProduction');hide('slotCash');
    show('pSpores');show('pAlloc');buildAlloc();
    if(s.combatOn)show('pCombat');
    $('#vesselCap').textContent='observable matter converted';
  }
  if(s.ex.on)show('pExchange');
  if(s.tour.on)show('pTasting');
  if(s.chips.length){show('pCulture');drawChips()}
  if(s.act===1&&s.made>=25)show('pCompute');
  $('#exRisk').textContent=t(['Risk: low','Risk: medium','Risk: high'][s.ex.risk]);
}

boot();
