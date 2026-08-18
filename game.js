const $ = (s) => document.querySelector(s);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const money = (n) => '$' + n.toFixed(2);
const fmt = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return Math.floor(n).toLocaleString();
};
const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

const SAVE_KEY = 'the-jam-save-v4';
const OLD_KEY = 'the-jam-save-v2';

const projects = [
  { id:'spoon', name:'A Good Spoon', need:15, cost:12, desc:'A proper spoon. Not glamorous. Absolutely essential.', once:s=>{s.manual+=1} },
  { id:'recipe', name:'Secret Recipe', need:30, cost:28, desc:'Dial in the fruit. Manual jars become richer and more valuable.', once:s=>{s.quality+=.05;s.manualValue+=.02} },
  { id:'glass', name:'Glass Workshop', need:75, cost:75, desc:'End the eternal glass shortage. +20 storage and faster glass return.', once:s=>{s.capacity+=20;s.glassRate*=1.7} },
  { id:'sealer', name:'Copper Sealer', need:180, cost:165, desc:'Machines finally stop making a mess. +1.7 jars/sec.', once:s=>{s.auto+=1.7} },
  { id:'label', name:'Hand-Drawn Labels', need:420, cost:350, desc:'People buy with their eyes. +$0.07 sale value and demand recovers faster.', once:s=>{s.priceBonus+=.07;s.demandRecovery*=1.8} },
  { id:'orchard', name:'The Tiny Orchard', need:900, cost:800, desc:'Bring the fruit closer. +2.8 jars/sec and more berries.', once:s=>{s.auto+=2.8;s.berryRate*=1.5;s.capacity+=15} },
  { id:'courier', name:'Red Bicycle Courier', need:2200, cost:1900, desc:'Orders travel. So do you. Unlock richer contracts.', once:s=>{s.orderBoost+=.18;s.auto+=4.2} },
  { id:'brand', name:'Cult Following', need:6500, cost:6500, desc:'A small fanbase becomes a weirdly efficient sales department.', once:s=>{s.priceBonus+=.15;s.demandMax=.99} },
  { id:'factory', name:'Midnight Factory', need:18000, cost:18000, desc:'The kitchen never sleeps. +18 jars/sec and bigger orders.', once:s=>{s.auto+=18;s.capacity+=80;s.orderBoost+=.28} },
  { id:'moon', name:'Moon Pantry', need:50000, cost:50000, desc:'A low-gravity pantry. The jam has escaped the kitchen.', once:s=>{s.auto+=65;s.capacity+=250;s.priceBonus+=.35} }
];

const achievements = [
  ['first','First Spread','Make your first jar.'],
  ['groove','Find the Groove','Hit a 10-stir groove.'],
  ['fever','Jam Fever','Trigger Jam Fever.'],
  ['cafe','Good Customer','Complete your first order.'],
  ['hundred','Tiny Business','Make 100 total jars.'],
  ['thousand','Neighborhood Hero','Make 1,000 total jars.'],
  ['quality','Actually Delicious','Reach 90% quality.'],
  ['premium','Fancy Jar','Set the shelf price above $0.30.'],
  ['builder','Renovator','Build 5 projects.'],
  ['million','Jamillionaire','Make 1,000,000 total jars.'],
  ['cosmic','Spread Too Far','Reach the Moon Pantry.'],
  ['legend','Legendary Batch','Complete a batch after prestiging.']
];

const eras = [
  {at:0, name:'KITCHEN', story:'Start with a spoon, a little fruit, and an unreasonable amount of confidence.', market:'The kitchen is warming up.', flavor:'No one knows about you yet. Perfect.'},
  {at:420, name:'NEIGHBORHOOD', story:'The café next door has started asking for the good jars.', market:'People are beginning to talk.', flavor:'Word of mouth is doing its tiny, sticky job.'},
  {at:6500, name:'CITY', story:'The city has developed a taste for what you make.', market:'Your jam has a scene now.', flavor:'Expect queues. Expect opinions. Expect labels.'},
  {at:18000, name:'NATIONAL', story:'You have become a charmingly serious operation.', market:'The shelves are looking suspiciously empty.', flavor:'Someone on the internet called it “the future of breakfast.”'},
  {at:50000, name:'MOON', story:'The preserve program has gone off-world.', market:'Zero gravity. Full flavor.', flavor:'There is no sensible explanation for any of this.'}
];

let audioOn = true;
let audioCtx = null;
let lastSave = 0;
let lastRender = 0;
let lastInput = 0;
let feverEnds = 0;
let eventTimer = 16;
let grooveTimer = 0;
let messageTimer = 0;

const baseState = () => ({
  version:4,
  jars:0,total:0,berries:18,glass:10,cash:8,spark:0,
  price:.12,priceBonus:0,demand:1,demandMax:1,
  quality:.72,heat:0,
  manual:1,manualValue:.01,auto:0,capacity:12,
  berryRate:.25,glassRate:.14,demandRecovery:.006,
  orderBoost:0,ordersDone:0,ordersFailed:0,
  groove:0,grooveBest:0,
  level:1,xp:0,
  purchased:{},ach:{},logs:[],
  prestige:0,prestigeBonus:1,
  order:null,orderProgress:0,orderTimer:0,
  event:null,day:1,startedAt:Date.now(),last:Date.now()
});

let s = baseState();

function load(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw){ Object.assign(s, JSON.parse(raw)); return; }
    const old = localStorage.getItem(OLD_KEY);
    if(old){
      const o = JSON.parse(old);
      s.total = o.total || 0; s.jars = Math.min(o.jars || 0, o.jars || 0); s.berries = o.berries || 18;
      s.glass = o.jarsStock || 10; s.cash = o.funds || 8; s.spark = o.spark || 0;
      s.price = o.price || .12; s.prestige = o.prestige || 0; s.prestigeBonus = o.prestigeBonus || 1;
      s.level = o.level || 1; s.xp = o.xp || 0; s.last = Date.now();
      log('Your old kitchen was carefully moved into the new one.', true);
      save(true);
    }
  }catch(e){ console.warn('Save load failed', e); }
}
function save(force=false){
  const now = Date.now(); if(!force && now-lastSave<1800) return;
  lastSave = now; s.last=now; localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

function era(){
  let x=eras[0]; for(const e of eras) if(s.total>=e.at) x=e; return x;
}
function xpFor(lvl){ return Math.floor(45*Math.pow(lvl,1.52)); }
function effectivePrice(){ return Math.max(.06, s.price+s.priceBonus); }
function fever(){ return Date.now()<feverEnds; }
function productionMult(){ return s.prestigeBonus * (1 + s.groove*.018) * (fever()?1.45:1) * (s.event?.prod||1); }
function saleValue(){ return effectivePrice()*s.demand*s.quality*productionMult(); }
function freeJarSpace(){ return Math.max(0, s.capacity-s.jars); }

function log(text, good=false){
  s.logs.unshift({text,good}); s.logs=s.logs.slice(0,8); renderLog();
}
function toast(text){
  const el=$('#toast'); el.textContent=text; el.classList.add('show');
  clearTimeout(messageTimer); messageTimer=setTimeout(()=>el.classList.remove('show'),1700);
}
function floatText(text, good=true){
  const root=$('#floaters'); const el=document.createElement('div'); el.className='floater'+(good?'':' dim');
  el.textContent=text; el.style.left=(38+Math.random()*24)+'%'; el.style.top=(52+Math.random()*7)+'%'; root.appendChild(el); setTimeout(()=>el.remove(),950);
}
function blip(type='soft'){
  if(!audioOn) return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g);g.connect(audioCtx.destination);
    const now=audioCtx.currentTime; o.type=type==='hit'?'square':'sine'; o.frequency.value=type==='hit'?310:220;
    o.frequency.exponentialRampToValueAtTime(type==='hit'?620:330, now+.08); g.gain.setValueAtTime(.035,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.start(now);o.stop(now+.13);
  }catch(e){}
}

function addXp(amount){
  s.xp += amount;
  while(s.xp>=xpFor(s.level)){
    s.xp-=xpFor(s.level); s.level++; s.spark += 3+s.level;
    s.berries = Math.min(s.capacity*2, s.berries+4+s.level); s.glass=Math.min(s.capacity,s.glass+2);
    log(`Level up — <b>Kitchen ${s.level}</b> gets a little smarter.`,true); toast('Kitchen level '+s.level); blip('hit');
  }
}

function stir(count=1){
  let made=0;
  for(let i=0;i<count;i++){
    if(s.berries<1 || s.glass<1 || freeJarSpace()<1){
      if(count===1) toast(freeJarSpace()<1?'Make room first.':'You need fruit and glass.');
      break;
    }
    s.berries-=1;s.glass-=1;s.jars+=1;s.total+=1;made+=1;
    s.cash += saleValue() + s.manualValue;
    s.spark += fever()?2:1;
    s.heat=clamp(s.heat+.035,0,1);
    s.quality=clamp(s.quality+.002,0,1);
    const now=Date.now();
    if(now-lastInput<1500) s.groove=clamp(s.groove+1,0,10); else s.groove=1;
    s.grooveBest=Math.max(s.grooveBest,s.groove);
    lastInput=now;grooveTimer=1.5;
    addXp(2);
  }
  if(made){
    if(s.groove>=10 && !fever()){
      feverEnds=Date.now()+12000; s.quality=clamp(s.quality+.05,0,1);
      s.spark+=12; log('JAM FEVER — the spoon becomes a weapon.',true); toast('JAM FEVER!'); blip('hit');
    }
    achievementCheck(); floatText('+'+made+' jar'+(made>1?'s':'')); blip(); render(); save();
  }
}
function batch(){ stir(5); }

function buy(p){
  if(s.purchased[p.id]) return;
  if(s.total<p.need || s.cash<p.cost) return;
  s.cash-=p.cost;s.purchased[p.id]=true;p.once(s);s.spark+=Math.max(2,Math.ceil(p.cost/90));addXp(Math.ceil(p.cost*.32));
  log(`Built <b>${p.name}</b>. The kitchen just got stranger.`,true); toast(p.name+' built'); blip('hit'); render(); save(true);
}

function createOrder(){
  const scale=Math.min(6, Math.floor(s.level/2));
  const names=[
    ['The Corner Café','small case before lunch'],['The Bookshop Bar','breakfast for a launch'],['Hotel Marigold','room-service jars'],['The Sunday Market','a very confident stall'],['The Grand Hotel','enough jam for a conference'],['The Orbital Pantry','zero-gravity toast service'],
  ];
  const [title,needText]=names[Math.min(scale,names.length-1)];
  const target=Math.round((18+scale*13)*(1+s.orderBoost));
  s.order={title,target,reward:target*(.34+.05*scale)+10};
  s.orderProgress=0;s.orderTimer=42+scale*6;
}
function packOrder(){
  if(!s.order) createOrder();
  const need=s.order.target-s.orderProgress;
  const used=Math.min(need,s.jars);
  if(used<need){ toast('You need '+fmt(need-used)+' more jars.'); return; }
  s.jars-=need;s.orderProgress+=need;
  const reward=s.order.reward*(1+s.quality*.25);s.cash+=reward;s.spark+=10+Math.ceil(need/10);s.ordersDone++;addXp(need*.55);
  log(`ORDER COMPLETE — <b>${s.order.title}</b> paid ${money(reward)}.`,true); toast('Order packed!'); blip('hit'); createOrder(); achievementCheck(); render(); save(true);
}
function orderTick(dt){
  if(!s.order) createOrder();
  s.orderProgress=clamp(s.orderProgress + s.auto*dt*productionMult(),0,s.order.target);
  s.orderTimer-=dt;
  if(s.orderProgress>=s.order.target){
    const reward=s.order.reward*(1+s.quality*.18);s.cash+=reward;s.spark+=8;s.ordersDone++;addXp(s.order.target*.35);
    log(`Courier picked up <b>${s.order.title}</b> for ${money(reward)}.`,true);toast('Courier away!');blip();createOrder();
  } else if(s.orderTimer<=0){
    s.ordersFailed++;s.demand=clamp(s.demand-.12,0,s.demandMax);log(`Missed order — <b>${s.order.title}</b> went elsewhere.`);toast('Order missed');createOrder();
  }
}

function triggerEvent(){
  const events=[
    {icon:'🍓',title:'BERRY BOOM',text:'A truck got lost and chose your driveway.',dur:18,prod:1,berries:22},
    {icon:'📣',title:'FOOD BLOGGER',text:'One very excited paragraph just hit the internet.',dur:16,demand:1.2},
    {icon:'🫙',title:'STICKY LIDS',text:'Everything is harder to open than it should be.',dur:13,prod:.72},
    {icon:'🌞',title:'PERFECT WEATHER',text:'People are outside. People are hungry.',dur:20,demand:1.15},
    {icon:'🧐',title:'SERIOUS CRITIC',text:'Someone wrote “notes of blackberry and audacity.”',dur:17,quality:.06},
    {icon:'🚲',title:'COURIER STRIKE',text:'The bicycle people are taking a little break.',dur:12,prod:.82}
  ];
  const e=events[Math.floor(Math.random()*events.length)];s.event={...e,left:e.dur};
  if(e.berries)s.berries=Math.min(s.capacity*2,s.berries+e.berries);
  if(e.quality)s.quality=clamp(s.quality+e.quality,0,1);
  if(e.demand)s.demand=clamp(s.demand*e.demand,0,s.demandMax);
  s.spark+=4;log(`${e.icon} <b>${e.title}</b> — ${e.text}`,true);toast(e.title);blip('hit');eventTimer=20+Math.random()*18;
}
function eventTick(dt){
  if(s.event){s.event.left-=dt;if(s.event.left<=0){log(`<b>${s.event.title}</b> passed. Back to stirring.`);s.event=null}}
  eventTimer-=dt;if(eventTimer<=0 && s.total>20)triggerEvent();
}

function tick(dt){
  const heatDrag = s.heat>.72 ? (s.heat-.72)*.16 : 0;
  const berryGain=s.berryRate*dt*(1-heatDrag);
  const glassGain=s.glassRate*dt;
  s.berries=clamp(s.berries+berryGain,s.berries> s.capacity*2 ? 0:s.berries,s.capacity*2);
  s.glass=clamp(s.glass+glassGain,0,s.capacity);
  s.heat=clamp(s.heat-dt*.018,0,1);
  s.quality=clamp(s.quality + (s.heat<.4?dt*.0008:-dt*.00025),.55,1);
  if(grooveTimer>0){grooveTimer-=dt;if(grooveTimer<=0)s.groove=0}
  s.demand=clamp(s.demand + dt*s.demandRecovery*(1+s.groove*.03),0,s.demandMax);
  if(s.auto>0 && freeJarSpace()>0 && s.berries>0 && s.glass>0){
    const made=Math.min(s.auto*dt*(s.event?.prod||1)*productionMult(),s.berries,s.glass,freeJarSpace());
    s.berries-=made;s.glass-=made;s.jars+=made;s.total+=made;
    s.cash+=made*saleValue();addXp(made*.16);s.heat=clamp(s.heat+made*.002,0,1);
  }
  orderTick(dt);eventTick(dt);achievementCheck();
}

function achievementCheck(){
  const checks={
    first:s.total>=1,groove:s.grooveBest>=10,fever:feverEnds>0,cafe:s.ordersDone>=1,hundred:s.total>=100,thousand:s.total>=1000,
    quality:s.quality>=.9,premium:s.price>=.30,builder:Object.keys(s.purchased).length>=5,million:s.total>=1e6,cosmic:!!s.purchased.moon,legend:s.prestige>=1
  };
  for(const a of achievements){if(!s.ach[a[0]] && checks[a[0]]){s.ach[a[0]]=true;s.spark+=18;addXp(20);log(`ACHIEVEMENT — <b>${a[1]}</b>. +18 ✦`,true);toast(a[1]);blip('hit')}}
}

function prestige(){
  if(s.total<50000){toast('50,000 jars make the batch legendary.');return}
  if(!confirm('Start a new batch? You keep Spark and achievements.')) return;
  const p=s.prestige+1; const preserved={ach:s.ach,spark:s.spark+p*40};
  localStorage.removeItem(SAVE_KEY);s=baseState();s.prestige=p;s.prestigeBonus=1+p*.08;s.ach=preserved.ach;s.spark=preserved.spark;
  log(`NEW BATCH — <b>${pad(p)}</b>. The next kitchen starts ${s.prestigeBonus.toFixed(2)}× stronger.` ,true);save(true);toast('New batch!');render();
}

function renderProjects(){
  const next=projects.find(p=>!s.purchased[p.id]);
  const ready=projects.filter(p=>!s.purchased[p.id]&&s.total>=p.need&&s.cash>=p.cost).length;
  $('#projectHint').textContent=ready?ready+' ready to build':next?`next at ${fmt(next.need)}`:'all projects built';
  $('#projects').innerHTML=projects.map(p=>{
    const own=!!s.purchased[p.id],locked=s.total<p.need;
    const afford=s.cash>=p.cost;
    return `<article class="project ${locked&&!own?'locked':''} ${own?'owned':''}">
      <div><div class="project-meta"><span>${own?'BUILT':locked?'LOCKED':afford?'READY':'CASH TIGHT'}</span><small>${fmt(p.need)} jars</small></div><h3>${own?'✓ ':''}${p.name}</h3><p>${p.desc}</p></div>
      <button class="buy" data-id="${p.id}" ${own||locked||!afford?'disabled':''}>${own?'BUILT':'BUILD'}<span class="cost">${own?'':money(p.cost)}</span></button>
    </article>`;
  }).join('');
  document.querySelectorAll('.buy').forEach(b=>b.onclick=()=>buy(projects.find(p=>p.id===b.dataset.id)));
}
function renderLog(){
  $('#logLines').innerHTML=s.logs.map(x=>`<div class="log-line"><span class="${x.good?'good':''}">✦</span> ${x.text}</div>`).join('')||'<div class="log-line">✦ The journal is blank. Give the spoon a job.</div>';
  $('#logCount').textContent=s.logs.length+' notes';
}
function renderAchievements(){
  $('#achCount').textContent=Object.keys(s.ach).length+' / '+achievements.length;
  $('#achievements').innerHTML=achievements.slice(0,6).map(a=>`<div class="achievement ${s.ach[a[0]]?'done':''}"><div class="seal">${s.ach[a[0]]?'✓':'•'}</div><div><strong>${a[1]}</strong><small>${a[2]}</small></div></div>`).join('');
}
function render(){
  const e=era();
  $('#eraName').textContent=e.name;$('#storyLine').textContent=e.story;$('#marketTitle').textContent=s.event?s.event.title.replace(/^[A-Z ]+$/,'')||e.market:e.market;$('#marketText').textContent=s.event?s.event.text:e.flavor;$('#marketIcon').textContent=s.event?s.event.icon:'✿';
  $('#batchNumber').textContent=pad(s.prestige+1);$('#dayNumber').textContent='DAY '+pad(Math.max(1,1+Math.floor((Date.now()-s.startedAt)/86400000)));
  $('#jars').textContent=fmt(s.jars);$('#totalJars').textContent=fmt(s.total);$('#level').textContent=s.level;$('#levelSide').textContent=s.level;$('#spark').textContent=fmt(s.spark);
  $('#berries').textContent=Math.floor(s.berries);$('#glass').textContent=Math.floor(s.glass);$('#cash').textContent=money(s.cash);$('#heat').textContent=Math.round(s.heat*100)+'%';
  $('#autoRate').textContent=(s.auto*productionMult()).toFixed(1)+'/sec';$('#price').textContent=money(effectivePrice());$('#priceRange').value=Math.round(s.price*100);$('#demand').textContent=Math.round(s.demand*100)+'%';
  $('#grooveLabel').textContent=s.groove+' / 10';$('#grooveBar').style.width=(s.groove/10*100)+'%';$('#grooveText').textContent=fever()?'The room is glowing. Keep stirring.':s.groove>=7?'Almost there. Do not stop.':s.groove?'Nice rhythm. The jam likes this.':'Stir a few times in a row to heat up the room.';
  $('#efficiency').textContent=productionMult().toFixed(2)+'×';$('#batchBonus').textContent=s.prestigeBonus.toFixed(2)+'×';$('#quality').textContent=Math.round(s.quality*100)+'%';$('#pulseStatus').textContent=fever()?'JAM FEVER':s.auto?'Machines humming':'Hands on deck';
  const xpMax=xpFor(s.level);$('#xpText').textContent=Math.floor(s.xp)+' / '+xpMax;$('#xpBar').style.width=(s.xp/xpMax*100)+'%';$('#levelPerk').textContent=fever()?'Fever is boosting your production.':`Level ${s.level} makes fruit +${(s.level*.5).toFixed(1)}% richer.`;
  if(s.event && !$('#marketIcon').textContent) $('#marketIcon').textContent=s.event.icon;
  if(s.order){$('#orderTitle').textContent=s.order.title;$('#orderReward').textContent='+'+money(s.order.reward);$('#orderText').textContent=`They need a small case before the timer runs out. Progress can be packed manually or filled by machines.`;$('#orderProgress').textContent=fmt(s.orderProgress)+' / '+fmt(s.order.target);$('#orderBar').style.width=(s.orderProgress/s.order.target*100)+'%';$('#orderTimer').textContent=pad(Math.max(0,s.orderTimer)).replace(/^0/,'')+':'+pad(Math.max(0,Math.floor((s.orderTimer%1)*100))).slice(-2)}
  $('#prestigeBonus').textContent=s.prestigeBonus.toFixed(2)+'×';renderProjects();renderAchievements();renderLog();
}

function offline(){
  const away=Math.max(0,Math.min(7200,(Date.now()-s.last)/1000));
  if(away>20 && s.auto>0){const before=s.total;tick(away);const made=s.total-before; if(made>0){log(`While you were away, the kitchen made <b>${fmt(made)} jars</b>.`,true);toast('Welcome back — '+fmt(made)+' jars')}}
}

$('#jamBtn').onclick=()=>stir(1);$('#batchBtn').onclick=batch;$('#orderBtn').onclick=packOrder;$('#prestigeBtn').onclick=prestige;
$('#priceRange').oninput=e=>{s.price=e.target.value/100;render()};$('#priceRange').onchange=()=>{achievementCheck();save(true)};
$('#resetBtn').onclick=()=>{if(confirm('Reset every jar, lesson, and batch?')){localStorage.removeItem(SAVE_KEY);location.reload()}};
$('#soundBtn').onclick=()=>{audioOn=!audioOn;$('#soundBtn').textContent=audioOn?'◒':'◌'};
window.addEventListener('keydown',e=>{if(e.code==='Space'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();stir(1)}});

load();
if(!s.logs.length) log('Welcome to The Jam. The first spoonful is the hardest.',true);
if(!s.order) createOrder();
offline();
render();
setInterval(()=>{const now=Date.now();const dt=Math.min(2,(now-s.last)/1000);s.last=now;tick(dt);render();save()},250);
setInterval(()=>achievementCheck(),1200);
