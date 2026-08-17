const $=s=>document.querySelector(s);
const fmt=n=>n>=1000?(n/1000).toFixed(1)+'k':Math.floor(n).toLocaleString();
const saveKey='the-jam-save-v1';
const baseProjects=[
 {id:'recipe',name:'Secret Recipe',desc:'Find the perfect fruit-to-sugar ratio. Every 10% efficiency makes batches faster.',cost:15,currency:'funds',unlock:5,rate:.15,kind:'efficiency'},
 {id:'squeezer',name:'The Squeezer',desc:'A suspiciously effective machine. +0.6 jars/sec.',cost:35,currency:'funds',unlock:25,rate:.6},
 {id:'label',name:'Tiny Labels',desc:'Make each jar feel like a collector’s item. +$0.03 price.',cost:65,currency:'funds',unlock:55,price:.03},
 {id:'stand',name:'Sunday Stand',desc:'Sell beyond the kitchen. Doubles demand recovery.',cost:110,currency:'funds',unlock:100,mult:2},
 {id:'orbital',name:'Orbital Orchard',desc:'Why grow berries on Earth? +4 jars/sec.',cost:400,currency:'funds',unlock:250,rate:4},
 {id:'jamAI',name:'JAM·AI',desc:'It has one job. It takes it very seriously. +10 jars/sec.',cost:1500,currency:'funds',unlock:800,rate:10},
 {id:'quantum',name:'Quantum Toast',desc:'The jam is everywhere until observed. +40 jars/sec.',cost:9000,currency:'funds',unlock:5000,rate:40}
];
let s={jars:0,berries:12,jarsStock:5,funds:8,spark:0,price:.12,demand:1,eff:1,mult:1,auto:0,priceBonus:0,purchased:{},logs:[],last:Date.now(),version:1};
try{Object.assign(s,JSON.parse(localStorage.getItem(saveKey)||'{}'))}catch(e){}
function log(t,good=false){s.logs.unshift({t,good});s.logs=s.logs.slice(0,7);renderLog();}
function money(){return '$'+s.funds.toFixed(2)}
function can(p){return s.funds>=p.cost && s.jars>=p.unlock}
function buy(p){if(!can(p)||s.purchased[p.id])return;s.funds-=p.cost;s.purchased[p.id]=1;s.auto+=p.rate||0;s.eff*=p.kind==='efficiency'?1.15:1;s.priceBonus+=p.price||0;s.mult*=p.mult||1;s.spark+=Math.ceil(p.cost/20);log(`Unlocked <b>${p.name}</b> — the kitchen hums.` ,true);toast(p.name+' unlocked');render();save()}
function stir(){if(s.berries<1||s.jarsStock<1){toast('You need berries and an empty jar.');return}s.berries--;s.jarsStock--;s.jars++;s.spark++;s.funds+=Math.max(.01,s.price+s.priceBonus)*s.demand;s.demand=Math.max(.25,s.demand-.012);log(`Hand-stirred a jar. <b>+${money()}</b>`);render();save()}
function tick(dt){let made=s.auto*dt;if(made>0){let possible=Math.min(made,s.berries,s.jarsStock);if(possible>0){s.berries-=possible;s.jarsStock-=possible;s.jars+=possible;s.funds+=possible*Math.max(.01,s.price+s.priceBonus)*s.demand;s.demand=Math.min(1,s.demand+dt*.003*s.mult)}}s.berries=Math.min(100,s.berries+dt*.18*s.mult);s.jarsStock=Math.min(100,s.jarsStock+dt*.08*s.mult);s.demand=Math.min(1,s.demand+dt*.004*s.mult);}
function renderProjects(){let unlocked=s.jars>=5;$('#projects').innerHTML=baseProjects.map(p=>{let owned=s.purchased[p.id],ok=can(p);return `<article class="project ${!owned&&!ok?'locked':''}"><div><h3>${owned?'✓ ':''}${p.name}</h3><p>${p.desc}</p></div><button class="buy" ${owned||!ok?'disabled':''} data-id="${p.id}">${owned?'OWNED':'BUILD'}<span class="cost">${owned?'':('$'+p.cost+' + '+p.unlock+' jars')}</span></button></article>`}).join('');document.querySelectorAll('.buy').forEach(b=>b.onclick=()=>buy(baseProjects.find(p=>p.id===b.dataset.id)));$('#unlockHint').textContent=s.jars<5?'5 jars to unlock':baseProjects.filter(p=>!s.purchased[p.id]&&can(p)).length+' ideas ready';}
function renderLog(){$('#logLines').innerHTML=s.logs.map(x=>`<div class="log-line">${x.good?'✦':'·'} ${x.t}</div>`).join('')||'<div class="log-line">· The journal is blank. Start stirring.</div>';$('#logCount').textContent=s.logs.length+' entries'}
function render(){
 $('#jars').textContent=fmt(s.jars);$('#rate').textContent=s.auto.toFixed(1);$('#berries').textContent=Math.floor(s.berries);$('#jarStock').textContent=Math.floor(s.jarsStock);$('#funds').textContent=money();$('#spark').textContent=fmt(s.spark);$('#demand').textContent=Math.round(s.demand*100)+'%';$('#statDemand').textContent=Math.round(s.demand*100)+'%';$('#efficiency').textContent=s.eff.toFixed(1)+'×';$('#price').textContent='$'+(s.price+s.priceBonus).toFixed(2);$('#priceRange').value=Math.round(s.price*100);$('#demandBar').style.width=(s.demand*100)+'%';let milestone=baseProjects.find(p=>!s.purchased[p.id]);let target=milestone?milestone.unlock:10000;$('#milestoneTitle').textContent=milestone?milestone.name:'The Infinite Jar';$('#milestoneText').textContent=milestone?milestone.desc:'You made it. Keep going anyway.';$('#milestoneBar').style.width=Math.min(100,s.jars/target*100)+'%';$('#market').textContent=s.jars>1000?'GLOBAL':s.jars>100?'CITY':'LOCAL';$('#phaseName').textContent=s.jars>1000?'Cosmic':'Kitchen';$('#flavor').textContent=s.jars>500?'The preserve has become an institution.':'A tiny kitchen. An enormous destiny.';renderProjects();renderLog();}
function save(){localStorage.setItem(saveKey,JSON.stringify(s))}function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove('show'),1700)}
$('#jamBtn').onclick=stir;$('#priceRange').oninput=e=>{s.price=e.target.value/100;render()};$('#priceRange').onchange=()=>{log('Adjusted the jar price. The market noticed.');save()};$('#resetBtn').onclick=()=>{if(confirm('Reset The Jam?')){localStorage.removeItem(saveKey);location.reload()}};
setInterval(()=>{let now=Date.now(),dt=Math.min(2,(now-s.last)/1000);s.last=now;tick(dt);render();save()},250);
render();log(s.logs.length?'Welcome back, jam maker.':'Welcome to The Jam. Your first jar is waiting.');
