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
function potChurn(){ return Math.min(1,stirSpin/14); }
/* the press has to land on the object, not only on a number */
function potHit(){
  const p=document.getElementById('potCanvas'); if(!p)return;
  p.classList.remove('hit'); void p.offsetWidth; p.classList.add('hit');
}

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
  /* an empty larder stops the pot: it should look stopped, not busy */
  const fed=(typeof s!=='object'||s.act!==1)||s.fruit>0.5;
  const target=(auto>0&&fed)?Math.min(9,1.8*Math.log10(1+auto)*3):0;
  stirSpin+=(target-stirSpin)*Math.min(1,dt*1.6);
  stirSpin=Math.max(0,stirSpin-dt*3.2);
  stirAngle=(stirAngle+stirSpin*dt*60)%360;

}

/* ============================================================
   SOUND
   The previous build had audio; the rewrite dropped it and nobody
   noticed until the PO did. It is back, synthesised in the browser —
   no files, no dependencies, nothing to load.

   Rules: quiet by default, never the only channel for information
   (everything here also flashes, floats or shakes), off in one click,
   and silent until the player has touched the page, because browsers
   refuse to start audio before a gesture anyway.
   ============================================================ */
const SOUND_KEY='the-jam-sound';
const sfx=(function(){
  let ctx=null,master=null,noise=null,ready=false;
  let on=true;
  try{ on=localStorage.getItem(SOUND_KEY)!=='off'; }catch(e){}

  function build(){
    if(ctx||!on)return;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      ctx=new AC();
      master=ctx.createGain(); master.gain.value=0.34; master.connect(ctx.destination);
      /* one second of white noise, reused for every stir */
      noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
      const d=noise.getChannelData(0);
      for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      ready=true;
    }catch(e){ ctx=null; ready=false; }
  }
  function wake(){
    build();
    if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});
  }
  function live(){ return on&&ready&&ctx&&ctx.state==='running'; }

  /* one enveloped oscillator */
  function tone(f,o){
    if(!live())return;
    o=o||{};
    const t0=ctx.currentTime+(o.at||0), dur=o.dur||0.12;
    const osc=ctx.createOscillator(), g=ctx.createGain();
    osc.type=o.type||'sine';
    osc.frequency.setValueAtTime(f,t0);
    if(o.to)osc.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002,o.gain||0.05),t0+Math.min(0.02,dur*0.3));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0+dur+0.03);
  }
  /* a burst of filtered noise — the sound of a spoon in thick jam */
  function hiss(o){
    if(!live())return;
    o=o||{};
    const t0=ctx.currentTime+(o.at||0), dur=o.dur||0.16;
    const src=ctx.createBufferSource(); src.buffer=noise;
    src.playbackRate.value=0.7+Math.random()*0.5;
    const bp=ctx.createBiquadFilter();
    bp.type='bandpass'; bp.frequency.value=o.f||620; bp.Q.value=o.q||1.1;
    const g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(o.gain||0.05,t0+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0,Math.random()*0.5); src.stop(t0+dur+0.02);
  }

  /* clicking fast must not stack into a wall of noise */
  const last={};
  function gate(k,ms){
    const n=performance.now();
    if(last[k]&&n-last[k]<ms)return false;
    last[k]=n; return true;
  }

  const api={
    get on(){ return on; },
    wake,
    toggle(){
      on=!on;
      try{ localStorage.setItem(SOUND_KEY,on?'on':'off'); }catch(e){}
      if(on){ wake(); api.buy(); }
      return on;
    },
    /* the spoon going round */
    stir(){ if(!gate('stir',55))return; hiss({f:520+Math.random()*220,gain:0.05,dur:0.15});
            tone(84+Math.random()*14,{type:'sine',dur:0.11,gain:0.045}); },
    /* a jar leaves, money arrives */
    sell(){ if(!gate('sell',60))return; tone(660,{dur:0.07,gain:0.035});
            tone(988,{at:0.055,dur:0.1,gain:0.03}); },
    /* something was bought */
    buy(){ if(!gate('buy',50))return; tone(392,{type:'triangle',dur:0.05,gain:0.04});
           tone(587,{type:'triangle',at:0.045,dur:0.08,gain:0.032}); },
    /* a recipe was learned — the one cue worth interrupting for */
    recipe(){ tone(523,{dur:0.13,gain:0.038}); tone(659,{at:0.09,dur:0.15,gain:0.034});
              tone(784,{at:0.18,dur:0.22,gain:0.03}); },
    /* refused, or a bad reading */
    bad(){ if(!gate('bad',90))return; tone(190,{type:'sawtooth',to:120,dur:0.19,gain:0.035}); },
    /* the larder is empty and the pot has stopped */
    warn(){ if(!gate('warn',900))return; tone(330,{type:'triangle',dur:0.1,gain:0.04});
            tone(330,{type:'triangle',at:0.16,dur:0.1,gain:0.04}); },
    /* the ground shifts under the whole game */
    act(){ tone(131,{dur:2.6,gain:0.05}); tone(196,{at:0.3,dur:2.3,gain:0.038});
           tone(262,{at:0.7,dur:2.0,gain:0.03}); }
  };
  return api;
})();

/* browsers will not start audio before a gesture, so the first one arms it */
['pointerdown','keydown'].forEach(ev=>
  document.addEventListener(ev,()=>sfx.wake(),{once:true,capture:true}));

function updateSoundBtn(){
  const b=document.getElementById('soundBtn');
  if(b)b.textContent=t(sfx.on?'Sound: on':'Sound: off');
}
(function(){
  const b=document.getElementById('soundBtn');
  if(!b)return;
  b.onclick=()=>{ sfx.toggle(); updateSoundBtn(); };
  updateSoundBtn();
})();

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
  buyOven:'Ovens make inspiration over time. Inspiration buys recipes.',
  buyCellar:'Notebooks decide how much inspiration you can hold. What spills over becomes creativity.',
  buyFruit:'Fruit is bought by the crate. The price moves on its own — buy when it is cheap.',
  sellBtn:'Serve whoever is standing at the door. You can only sell to somebody who is actually there, so the asking price decides how often that happens.',
  doorCount:'People your sellers cannot reach walk up to the house instead. A lower price brings more of them, and none of them wait very long.',
  sugarUp:'More sugar. What the crowd wants depends on what you charge — the band below is their tolerance, the line is where you are.',
  sugarDown:'Less sugar. Cheaper per jar, and dearer jam sells to people who would rather taste fruit.',
  hireSeller:'A seller moves jars without you clicking. Each one costs more than the last.',
  readCulture:'Test whether the jam has set. Test as often as you like: read the swing right and you gain, read it wrong and you lose the same amount.',
  tRun:'A tasting panel. Read the payoff grid, pick the palate you think wins, and you are paid on how well it places.',
  exDeposit:'Put a share of your cash on the desk. It drifts up on average, but not every week.',
  exWithdraw:'Sell everything and take the cash back, whatever it is worth right now.',
  exRisk:'Higher risk swings harder in both directions and drifts up faster over time.',
  buyPicker:'Pickers bring the standing orchard in as fruit. They cost jars, like everything here does now, and each one costs more than the last.',
  buyPresser:'Setting pans cook picked fruit into jam. Fruit that waits too long turns before it gets there.',
  buyFactory:'Bottling lines put jam into jars. Jars are what everything else here is built out of.',
  oCatch:'The orchard is finished in stages. Each one is far bigger than the last, and your machinery grows at about the same pace, so the bar keeps moving. Emptying the last one ends the act.',
  buyVat:'A vat is room to be out of step: it holds far more between two stages before what is waiting spoils.',
  buySun:'A sun trap makes power, but only while the sun is up.',
  buyBattery:'A cellar stores power made in daylight so the machines keep running at night.',
  treatBlight:'Spend inspiration to clear the blight now, or let it run its course and pick less.',
  swWork:'Ask more of the bees. More output, and they tire of it.',
  swPlay:'Ask less of the bees. They stay longer, and give less.',
  swSync:'Spend inspiration to bring the swarm back into humour and back up to strength.',
  launchSpore:'A spore costs jars and carries the recipe outward. Some of them stop answering.',
  buySpoon10:'Ten autospoons at once, if you can pay for ten.',
  buyWorks10:'Ten jamworks at once, if you can pay for ten.',
  buyPicker10:'Ten at once. Buying stops as soon as the jars run out.',
  buyPresser10:'Ten at once. Buying stops as soon as the jars run out.',
  buyFactory10:'Ten at once. Buying stops as soon as the jars run out.'
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
  /* measured after the text is in, or the decision is made on the last
     tooltip's height and the box hangs off the bottom of the window */
  const w=box.offsetWidth,h=box.offsetHeight;
  const below=r.bottom+8, above=r.top-h-8;
  box.style.left=Math.max(10,Math.min(window.innerWidth-w-10,r.left))+'px';
  box.style.top=((below+h<=window.innerHeight-10||above<10)?below:above)+'px';
}
function hideTip(){ const b=document.getElementById('tip'); if(b)b.classList.remove('show'); }
