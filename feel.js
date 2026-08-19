/* ============================================================
   THE JAM — feedback
   Every action has to land visibly. Numbers fly, the pot turns,
   good news is warm, bad news is red and brief.
   ============================================================ */
'use strict';

/* ---------- floating numbers ---------- */
function floatText(text,x,y,kind){
  const el=document.createElement('div');
  el.className='floater'+(kind?' '+kind:'');
  el.textContent=text;
  el.style.left=x+'px'; el.style.top=y+'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1250);
}
function floatFrom(node,text,kind){
  if(!node)return;
  const r=node.getBoundingClientRect();
  floatText(text,r.left+r.width*(0.35+Math.random()*0.3),r.top+r.height*0.35,kind);
}

/* ---------- reactions ---------- */
function flash(kind){
  const el=document.getElementById('flash');
  if(!el)return;
  el.className='';                       /* restart the animation */
  void el.offsetWidth;
  el.className='on '+(kind||'');
}
function bump(node,cls){
  if(!node)return;
  node.classList.remove('bump','bump-bad');
  void node.offsetWidth;
  node.classList.add(cls||'bump');
}
function shake(node){
  if(!node)return;
  node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake');
}

/* ---------- the pot ---------- */
let stirAngle=0, stirSpin=0;
function stirKick(power){ stirSpin=Math.min(34,stirSpin+(power||6)); }

/* a splash of jam where the player actually clicked */
function splash(x,y,n){
  for(let i=0;i<(n||6);i++){
    const d=document.createElement('div');
    d.className='splat';
    const a=Math.random()*Math.PI*2, r=14+Math.random()*30;
    d.style.left=x+'px'; d.style.top=y+'px';
    d.style.setProperty('--dx',(Math.cos(a)*r).toFixed(1)+'px');
    d.style.setProperty('--dy',(Math.sin(a)*r-14).toFixed(1)+'px');
    d.style.setProperty('--s',(0.5+Math.random()).toFixed(2));
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),620);
  }
}
function stirTick(dt){
  /* Automation keeps the pot at a simmer so the kitchen never looks dead,
     but the player's own stirring has to be the faster, louder motion —
     otherwise clicking feels like it did nothing. */
  const auto=(typeof autoPerSec==='function')?autoPerSec():0;
  const target=auto>0?Math.min(9,1.8*Math.log10(1+auto)*3):0;
  stirSpin+=(target-stirSpin)*Math.min(1,dt*1.6);
  stirSpin=Math.max(0,stirSpin-dt*3.2);
  stirAngle=(stirAngle+stirSpin*dt*60)%360;
  const sp=document.getElementById('spoon');
  if(sp){
    /* A stir is the bowl travelling round the inside of the pot while the
       handle leans into it — not the whole stick pivoting on its own tip,
       which swings the handle clean out of the frame. */
    const r=stirAngle*Math.PI/180, reach=Math.min(1,stirSpin/12);
    const dx=Math.cos(r)*17*reach, dy=Math.sin(r)*6*reach, tilt=Math.cos(r)*12*reach;
    sp.setAttribute('transform','translate('+dx.toFixed(1)+','+dy.toFixed(1)+') rotate('+tilt.toFixed(1)+' 75 122)');
  }
  const pot=document.getElementById('potSvg');
  if(pot)pot.style.setProperty('--churn',(Math.min(1,stirSpin/14)).toFixed(2));
}

/* ---------- press-and-hold ---------- */
function holdable(btn,fn){
  if(!btn)return;
  let timer=null,held=0,raf=null;
  const step=()=>{
    held++;
    /* accelerates: slow at first so single taps stay precise */
    const every=held<6?170:held<16?90:held<40?45:22;
    fn(held);
    timer=setTimeout(step,every);
  };
  const start=e=>{
    if(e.button!==undefined&&e.button!==0)return;
    held=0; fn(0); clearTimeout(timer); timer=setTimeout(step,340);
    btn.classList.add('holding');
  };
  const stop=()=>{ clearTimeout(timer); cancelAnimationFrame(raf); btn.classList.remove('holding'); };
  btn.addEventListener('mousedown',start);
  btn.addEventListener('touchstart',e=>{e.preventDefault();start(e)},{passive:false});
  ['mouseup','mouseleave','touchend','touchcancel','blur'].forEach(ev=>btn.addEventListener(ev,stop));
  window.addEventListener('mouseup',stop);
}

/* ---------- tooltips ---------- */
const TIPS={
  taste:'Earned by making jam, at milestones of total jars made. Spend it on an oven or a notebook.',
  tasteNext:'The total number of jars made at which you earn your next taste.',
  stirBtn:'Every stir uses one fruit and makes jam. Automation takes over later, but the pot never stops turning.',
  buySpoon:'An autospoon stirs on its own, slowly and forever.',
  buyWorks:'A jamworks is a production line: far more jars per second than a spoon, for far more money.',
  buyMkt:'More people hear about you, so more people want a jar at any given price.',
  priceUp:'Charge more per jar. Fewer people buy. Hold to move faster.',
  priceDown:'Charge less per jar. More people buy. Hold to move faster.',
  buyOven:'Ovens make inspiration over time. Inspiration buys recipes.',
  buyCellar:'Notebooks decide how much inspiration you can hold. What spills over becomes creativity.',
  buyFruit:'Fruit is bought by the crate. The price moves on its own — buy when it is cheap.',
  sellBtn:'Sell a jar by hand. Slow, but it is money before anyone knows who you are.',
  hireSeller:'A seller moves jars without you clicking. Each one costs more than the last.',
  readCulture:'Test whether the jam has set. Judge it right and you learn something; judge it wrong and you lose part of the pan.',
  tRun:'A tasting panel. Read the payoff grid, pick the palate you think wins, and you are paid on how well it places.',
  exDeposit:'Put a share of your cash on the desk. It drifts up on average, but not every week.',
  exWithdraw:'Sell everything and take the cash back, whatever it is worth right now.',
  exRisk:'Higher risk swings harder in both directions and drifts up faster over time.',
  buyPicker:'Pickers turn standing orchard into pulp. They cost jars, like everything here does now.',
  buyPresser:'Pressers turn pulp into fruit. Pulp that waits too long spoils.',
  buyFactory:'Bottling lines turn fruit back into jars. Jars are what everything else is built from.',
  buySun:'A sun trap makes power, but only while the sun is up.',
  buyBattery:'A cellar stores power made in daylight so the machines keep running at night.',
  treatBlight:'Spend inspiration to clear the blight now, or let it run its course and pick less.',
  swWork:'Ask more of the bees. More output, and they tire of it.',
  swPlay:'Ask less of the bees. They stay longer, and give less.',
  swSync:'Spend inspiration to bring the swarm back into humour and back up to strength.',
  launchSpore:'A spore costs jars and carries the recipe outward. Some of them stop answering.'
};
function installTips(){
  for(const id in TIPS){
    const el=document.getElementById(id);
    if(el&&!el.getAttribute('data-tip')) el.setAttribute('data-tip',TIPS[id]);
  }
  document.querySelectorAll('[data-tip]').forEach(el=>{
    if(el.__tip)return; el.__tip=true;
    el.addEventListener('mouseenter',()=>showTip(el));
    el.addEventListener('mouseleave',hideTip);
    el.addEventListener('focus',()=>showTip(el));
    el.addEventListener('blur',hideTip);
  });
}
function showTip(el){
  const box=document.getElementById('tip'); if(!box)return;
  box.textContent=t(el.getAttribute('data-tip'));
  box.classList.add('show');
  const r=el.getBoundingClientRect();
  box.style.left=Math.max(10,Math.min(window.innerWidth-320,r.left))+'px';
  box.style.top=(r.bottom+8)+'px';
}
function hideTip(){ const b=document.getElementById('tip'); if(b)b.classList.remove('show'); }
