/* ============================================================
   THE JAM — feedback
   Every action has to land visibly. Numbers fly, the pot turns,
   good news is warm, bad news is red and brief.
   ============================================================ */
'use strict';

/* ---------- floating numbers -----------------------------------------
   Reported 2026-08-20: "the numbers popping over something else is not
   looking good for exemple the +x on top of jars unsold number, the +x
   when clicking the pot that is almost not visible."

   Both complaints are the same defect seen twice. A floater spawned in
   the MIDDLE of the node it came from, in a dark ink with no separation
   from whatever was behind it. So it covered the readout the player was
   trying to read, and over the pot — which is nearly black — it was one
   dark thing on another.

   Three rules, which is how scrolling combat text is done in games that
   ship it:

     1. Never occlude the source. A floater leaves from the OUTSIDE edge
        of its node and travels away, so the number underneath stays
        legible for the whole flight.
     2. Never stack. Simultaneous floaters are spaced in time and stepped
        in space, so eight arrivals read as eight arrivals instead of one
        bold smear. Random jitter alone does not do this; a queue does.
     3. Readable on anything. The glyphs carry a ring of page-coloured
        halo, so the same floater reads over cream panels and over the
        black inside of the pot.

   And there are tiers, because po-rule 11 asks that a good decision feel
   DIFFERENT from a busy one rather than louder: dim for the automated
   trickle nobody chose, plain for an action, big for a moment that
   rewarded judgement. */
const FLOAT_GAP=90;                    /* ms between releases */
/* Lanes step UPWARD, away from the source and along the direction of
   travel. Stepping down put the third floater of a run straight back on
   top of the readout it came from, which is the original complaint. The
   spacing has to beat a floater's own height plus the ~4px a neighbour
   has risen in the 90ms between releases. */
const FLOAT_LANES=5, FLOAT_LANE_PX=32;
let floatQ=[], floatLast=0, floatLane=0, floatLaneAt=0, floatTimer=0;

function floatText(text,x,y,kind){
  if(floatQ.length>14)floatQ.shift();   /* never build a backlog nobody can read */
  floatQ.push({text:text,x:x,y:y,kind:kind||'',at:'point'});
  drainFloats();
}
/* leave from the edge of the node rather than from the middle of it */
function floatFrom(node,text,kind){
  if(!node)return;
  const r=node.getBoundingClientRect();
  if(!r.width&&!r.height)return;
  if(floatQ.length>14)floatQ.shift();
  floatQ.push({text:text,x:r.right,y:r.top-9,kind:kind||'',at:'edge'});
  drainFloats();
}
function drainFloats(){
  if(floatTimer)return;
  const now=performance.now(), since=now-floatLast;
  if(since<FLOAT_GAP){
    floatTimer=setTimeout(function(){ floatTimer=0; drainFloats(); },FLOAT_GAP-since+2);
    return;
  }
  const f=floatQ.shift();
  if(!f)return;
  floatLast=now;
  /* a run of arrivals walks down its own ladder; a lone one starts at the top */
  floatLane=(now-floatLaneAt>800)?0:(floatLane+1)%FLOAT_LANES;
  floatLaneAt=now;
  spawnFloat(f);
  if(floatQ.length)floatTimer=setTimeout(function(){ floatTimer=0; drainFloats(); },FLOAT_GAP);
}
/* Live reservations. The lane ladder alone is not enough once automated
   pulses and player clicks interleave — two floaters from different runs
   can still land 13px apart. So each one reserves the box it spawned in
   for half a second, and a new one steps up out of the way until it is
   clear. This is the cross-repulsion trick scrolling-combat-text systems
   use; without it "eight arrivals" reads as one bold smear, which is the
   original complaint. */
const floatHeld=[];
function floatClear(x,y,w,h){
  for(let i=0;i<floatHeld.length;i++){
    const r=floatHeld[i];
    if(Math.min(x+w,r.x+r.w)-Math.max(x,r.x)>4 && Math.min(y+h,r.y+r.h)-Math.max(y,r.y)>4)return false;
  }
  return true;
}
function spawnFloat(f){
  const el=document.createElement('div');
  el.className='floater'+(f.kind?' '+f.kind:'');
  el.textContent=f.text;
  el.style.top=(f.y-floatLane*FLOAT_LANE_PX)+'px';
  el.style.setProperty('--drift',((Math.random()*2-1)*13).toFixed(1)+'px');
  document.body.appendChild(el);
  const w=el.offsetWidth, h=el.offsetHeight;
  let x;
  if(f.at==='edge'){
    /* Right-aligned to the source and lifted clear ABOVE it, then it rises.
       Spawning beside the source instead put the number over whatever sat
       in the next column — visible in a 1760px screenshot, where the sugar
       panel's floater landed on the notebook button two columns over.
       Above keeps the source readable AND stays inside its own column. */
    x=Math.max(8,Math.min(f.x-w,window.innerWidth-w-8));
  }else{
    el.classList.add('at-point');       /* centred on the cursor instead */
    x=f.x-w/2;
  }
  let y=parseFloat(el.style.top);
  for(let i=0;i<7&&!floatClear(x,y,w,h);i++)y-=FLOAT_LANE_PX;
  el.style.top=y+'px';
  el.style.left=(f.at==='edge'?x:f.x)+'px';
  const held={x:x,y:y,w:w,h:h};
  floatHeld.push(held);
  setTimeout(function(){ const i=floatHeld.indexOf(held); if(i>=0)floatHeld.splice(i,1); },520);
  setTimeout(function(){ el.remove(); },1450);
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

/* A choice was made. Every control that *sets* a value routes through
   here, because until now only the ones that *spent money* said anything
   -- the game answered a purchase and ignored a decision.
   Quiet on purpose: the number moves, a tick sounds. The loud tier is
   `landed()`, and it is spent only where judgement is rewarded. */
function chose(valueNode){
  if(valueNode)bump(valueNode);
  sfx.tick();
}
/* The decision crossed into the band that pays. This is the loudest
   non-purchase cue in the game and it has exactly one owner at a time. */
function landed(valueNode,text){
  if(valueNode){ bump(valueNode); if(text)floatFrom(valueNode,text,'good big'); }
  sfx.settle();
  stirKick(4);                     /* the kitchen answers, faintly */
}
function slipped(valueNode){
  if(valueNode)bump(valueNode,'bump-bad');
  sfx.unsettle();
}

/* ---------- hints ----------------------------------------------------
   The PO, 2026-08-20: "lets not make those visible by default, lets add a
   'hint on/off' that enable these explanations, spoils the fun for most
   people and add a lot of text overall."

   The division that makes this safe: a line that TEACHES a rule is a hint
   and goes behind the switch. A line that reports what is happening right
   now, or says why a control will not respond, is NOT a hint and always
   shows. Hiding the first kind would break po-rule 4 — the player must
   always be able to say what is happening — and hiding the second would
   make the game refuse in silence, which the feel bar forbids outright.

   Off by default, as asked. Nothing is actually lost by turning it off:
   every control still explains itself on hover, and a panel still says
   what it is in the logbook the first time it appears. */
const HINT_KEY='the-jam-hints';
let HINTS=false;
try{ HINTS=localStorage.getItem(HINT_KEY)==='on'; }catch(e){}
function applyHints(){
  document.body.classList.toggle('hints',HINTS);
  const b=document.getElementById('hintBtn');
  if(b)b.textContent=t(HINTS?'Hints: on':'Hints: off');
}
function toggleHints(){
  HINTS=!HINTS;
  try{ localStorage.setItem(HINT_KEY,HINTS?'on':'off'); }catch(e){}
  applyHints();
  if(typeof render==='function')render(0);
  return HINTS;
}
/* the single writer for every explainer line in the game, so a new one
   cannot quietly go without a tier */
function why(node,text,hint){
  if(!node)return;
  const hide=!!hint&&!HINTS;
  node.classList.toggle('hidden',hide);
  if(!hide)node.textContent=text?t(text):'';
}

/* ---------- the pot ---------- */
let stirAngle=0, stirSpin=0, potFreeze=0;
function stirKick(power){ stirSpin=Math.min(34,stirSpin+(power||6)); }
function potChurn(){ return Math.min(1,stirSpin/14); }
/* the press has to land on the object, not only on a number */
function potHit(){
  const p=document.getElementById('potCanvas'); if(!p)return;
  p.classList.remove('hit'); void p.offsetWidth; p.classList.add('hit');
  /* hit-stop: three or four frames in which nothing in the pot moves, so
     the eye has time to register that something was struck. It is standard
     practice in games built around a single repeated press, it costs fifty
     milliseconds, and it is most of the difference between a click that
     landed and a click that was absorbed. */
  if(typeof REDUCED==='undefined'||!REDUCED)potFreeze=0.055;
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
  if(potFreeze>0){ potFreeze-=dt; return; }
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
    /* a settable attack, because a slow fade-in is a drag and a fast one
       is a hit, and the stir needs the first of those */
    const atk=Math.min(o.attack||0.02,dur*0.5);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002,o.gain||0.05),t0+atk);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0+dur+0.03);
  }
  /* a burst of filtered noise. The band can SWEEP and the attack can be
     slowed, which is the difference between a hit and a drag: a sharp
     attack on a fixed band is a percussion instrument, and that is
     exactly what the stir sounded like. */
  function hiss(o){
    if(!live())return;
    o=o||{};
    const t0=ctx.currentTime+(o.at||0), dur=o.dur||0.16;
    const src=ctx.createBufferSource(); src.buffer=noise;
    src.playbackRate.value=0.7+Math.random()*0.5;
    const bp=ctx.createBiquadFilter();
    bp.type='bandpass'; bp.frequency.setValueAtTime(o.f||620,t0); bp.Q.value=o.q||1.1;
    if(o.to)bp.frequency.exponentialRampToValueAtTime(Math.max(40,o.to),t0+dur);
    const g=ctx.createGain();
    const atk=Math.min(o.attack||0.012,dur*0.6);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(o.gain||0.05,t0+atk);
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
    /* The spoon going round. Reported 2026-08-20: "The manual pot
       steering sound is not satisfying I don't feel like I'm making jam
       at all, more like hitting a drum." It was a sharp-attack sine at
       84 Hz, which is a kick drum with extra steps, plus a fixed band of
       noise. Nothing about jam is percussive: it is heavy, wet, and
       nothing in it starts instantly.

       So: a slow-attack band of noise sweeping DOWNWARD, which is the
       drag of a spoon through something thick; a low body that fades in
       under it rather than hitting; and, about half the time, one bubble
       coming up through the surface and collapsing. Every stroke is
       slightly different, so a run of them does not machine-gun. */
    stir(){
      if(!gate('stir',55))return;
      const v=0.86+Math.random()*0.3;
      hiss({f:(880+Math.random()*300)*v,to:(250+Math.random()*90)*v,
            gain:0.052,dur:0.30,q:0.75,attack:0.05});
      tone(150+Math.random()*26,{type:'sine',to:96,dur:0.26,gain:0.028,attack:0.075});
      if(Math.random()<0.45)
        tone(300+Math.random()*150,{type:'sine',to:118,dur:0.13,gain:0.03,
                                    at:0.07+Math.random()*0.08});
    },
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
    /* a decision was registered — the quietest voice in the game.
       It fires on every nudge of a dial, so it has to sit under the
       music rather than on top of it. */
    tick(){ if(!gate('tick',70))return; tone(1240,{type:'square',dur:0.018,gain:0.011}); },
    /* the decision landed where it pays. Reserved: nothing else uses it,
       which is the whole point -- a good choice must sound different from
       a busy one, not louder. */
    settle(){ if(!gate('settle',260))return;
              tone(587,{dur:0.10,gain:0.034});
              tone(880,{at:0.07,dur:0.17,gain:0.028}); },
    /* and drifting back out of it: small, low, not a failure */
    unsettle(){ if(!gate('settle',260))return;
                tone(392,{type:'sine',to:294,dur:0.13,gain:0.022}); },
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

/* a purchase has to land on the thing that was pressed */
function pop(node){
  if(!node)return;
  node.classList.remove('bought'); void node.offsetWidth; node.classList.add('bought');
}

/* ============================================================
   DOUBLE-TAP ZOOM — the phone fix that CSS could not make

   Reported on a real phone: spam-tapping any button zooms the page in
   and out. `touch-action:manipulation` is the correct CSS answer and it
   is in style.css, but iOS Safari does not honour it for double-tap
   zoom — and it has deliberately ignored `user-scalable=no` since iOS 10
   so that people can always enlarge text. So the second tap has to be
   cancelled in script.

   The catch: cancelling a touchend also cancels the click the browser
   would have synthesised from it, so a naive version silently kills
   every other tap — spamming would half-register. We therefore deliver
   that click by hand.

   Anything built by holdable() is skipped: it already calls
   preventDefault on its own touchstart, so no click is coming, and
   dispatching one would fire the separate onclick some of those buttons
   also carry (buySpoon buys once by click and once by hold).

   Pinch-to-zoom is untouched — the guard bails out while more than one
   finger is down, and single-tap zoom is not a gesture.
   ============================================================ */
(function(){
  let last=0,lastPt=null;
  document.addEventListener('touchend',e=>{
    const now=Date.now(), gap=now-last;
    last=now;
    if(gap<=0||gap>320)return;                        /* not a double tap */
    if(e.touches&&e.touches.length)return;            /* a finger remains: pinch */
    /* A real double-tap zoom lands twice in the same place. Requiring
       that stops the guard from treating two quick taps on two different
       controls -- or a clumsy finger producing two touchends -- as one
       gesture, which was handing out an extra synthetic click. */
    const pt=(e.changedTouches&&e.changedTouches[0])||null;
    const near=pt&&lastPt&&Math.abs(pt.clientX-lastPt.x)<44&&Math.abs(pt.clientY-lastPt.y)<44;
    if(pt)lastPt={x:pt.clientX,y:pt.clientY};
    if(!near)return;
    const t=e.target;
    if(t&&t.closest&&t.closest('[data-hold]'))return; /* holdable owns its own taps */
    e.preventDefault();                               /* this is what stops the zoom */
    if(t&&typeof t.click==='function')t.click();      /* ...so hand back the tap */
  },{passive:false,capture:true});
})();

/* ---------- press-and-hold ---------- */
function holdable(btn,fn){
  if(!btn)return;
  btn.dataset.hold='1';   /* the double-tap guard above must leave these alone */
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
  /* Keyboard. These are <button>s, so Enter and Space fire a click — and
     nothing here listened for one, which left every dial in the game
     (price, sugar, stake) mouse-only. Holding the key repeats at the same
     accelerating rate as holding the mouse; the browser's own key repeat
     is ignored so both paths speed up identically. */
  btn.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' '&&e.key!=='Spacebar')return;
    e.preventDefault();
    if(e.repeat)return;
    start(e);
  });
  btn.addEventListener('keyup',e=>{
    if(e.key==='Enter'||e.key===' '||e.key==='Spacebar')stop();
  });
}

/* ---------- tooltips ---------- */
const TIPS={
  taste:'Earned by making jam, at milestones of total jars made. Spend it on an oven or a notebook.',
  tasteNext:'The total number of jars made at which you earn your next taste.',
  stirBtn:'Every stir uses one fruit and makes jam. Automation takes over later, but the pot never stops turning.',
  buySpoon:'An autospoon stirs on its own, slowly and forever.',
  buyWorks:'A jamworks is a production line: far more jars per second than a spoon, for far more money.',
  buyMkt:'More people hear about you, so more people want a jar at any given price. How much it is worth depends on your house: it is the Corner Store’s whole game and nearly useless to a Maker’s Table.',
  barHouse:'The house style you chose. It is permanent, and it decides what this crowd will pay, how well word of mouth works, what help costs, and how fast being talked about earns you taste.',
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
  /* only on touch: a mouse user is still hovering and would resent it */
  clearTimeout(tipTimer);
  if(touchUsed)tipTimer=setTimeout(hideTip,TIP_STAY);
}
function hideTip(){ clearTimeout(tipTimer); const b=document.getElementById('tip'); if(b)b.classList.remove('show'); }

/* A phone has no mouseleave, and a tap leaves the button focused, so a
   tooltip opened by touch stayed on screen for ever -- reported on a
   real phone, 2026-08-20. Three ways out, none of which affect a mouse:
   it closes itself, it closes when you touch anything else, and it
   closes if the page scrolls under it. */
let tipTimer=null, touchUsed=false;
const TIP_STAY=5000;
document.addEventListener('touchstart',e=>{
  if(!touchUsed){
    /* the hint said "Click the pot to stir" to somebody holding a phone */
    const h=document.getElementById('potHint');
    if(h&&!h.classList.contains('gone'))h.textContent=t('Tap the pot to stir');
  }
  touchUsed=true;
  const onTip=e.target&&e.target.closest&&e.target.closest('[data-tip]');
  if(!onTip)hideTip();
},{passive:true,capture:true});
window.addEventListener('scroll',()=>{ if(touchUsed)hideTip(); },{passive:true});
