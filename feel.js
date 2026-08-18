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
function stirKick(power){ stirSpin=Math.min(26,stirSpin+(power||6)); }
function stirTick(dt){
  /* automation keeps the spoon turning, so the kitchen never looks idle */
  const auto=(typeof autoPerSec==='function')?autoPerSec():0;
  const target=auto>0?Math.min(14,2.2*Math.log10(1+auto)*3):0;
  stirSpin+=(target-stirSpin)*Math.min(1,dt*1.6);
  stirSpin=Math.max(0,stirSpin-dt*3.2);
  stirAngle=(stirAngle+stirSpin*dt*60)%360;
  const sp=document.getElementById('spoon');
  if(sp)sp.setAttribute('transform','rotate('+stirAngle.toFixed(1)+' 75 150)');
  const pot=document.getElementById('jarSvg');
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
  tRun:'A tasting panel. Read the payoff grid, pick the palate you think wins, and you are paid on how well it places.'
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
