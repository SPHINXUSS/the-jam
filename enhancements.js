(function(){
  'use strict';
  if(window.__JAM_SYSTEMS_POLISH__) return;
  window.__JAM_SYSTEMS_POLISH__=true;

  const style=document.createElement('style');
  style.textContent=`
    #jamStoryAlert{position:fixed;left:50%;top:82px;z-index:120;width:min(680px,calc(100vw - 28px));transform:translate(-50%,-12px);opacity:0;pointer-events:none;background:var(--ink);color:var(--card);border:1px solid var(--ink);box-shadow:0 12px 30px rgba(0,0,0,.18);padding:10px 13px 11px;cursor:pointer;transition:opacity .22s ease,transform .22s ease}
    #jamStoryAlert.show{opacity:1;transform:translate(-50%,0);pointer-events:auto}
    #jamStoryAlert.ready{background:var(--boil);border-color:var(--boil);color:#fff}
    #jamStoryAlert .k{font:9px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.58;margin-bottom:5px}
    #jamStoryAlert .t{font:13px/1.45 "IBM Plex Sans",sans-serif}
    #jamDirection .jam-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}
    #jamDirection .jam-choice{display:block;width:100%;text-align:left;text-transform:none;letter-spacing:0;padding:10px 11px;background:var(--card-2);border:1px solid var(--rule);color:var(--ink)}
    #jamDirection .jam-choice:hover:not(:disabled){background:var(--ink);color:var(--card)}
    #jamDirection .jam-choice strong{display:block;font:600 14px/1.15 "Bodoni Moda",serif}
    #jamDirection .jam-choice span{display:block;margin-top:4px;color:var(--steel);font:11px/1.4 "IBM Plex Sans",sans-serif}
    #jamDirection .jam-choice small{display:block;margin-top:7px;color:var(--boil);font:9px "IBM Plex Mono",monospace;letter-spacing:.04em;text-transform:uppercase}
    #pLog.jam-log-pulse{animation:jamLogPulse 1.45s ease}
    @keyframes jamLogPulse{0%,100%{box-shadow:var(--shadow)}35%{box-shadow:0 0 0 2px var(--boil),0 8px 22px rgba(0,0,0,.10)}}
    #jamSoundToggle{margin-left:0}
    @media(max-width:760px){#jamDirection .jam-choice-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const alert=document.createElement('div');
  alert.id='jamStoryAlert';
  alert.innerHTML='<div class="k">Logbook</div><div class="t"></div>';
  document.body.appendChild(alert);
  let alertTimer=0;
  const plain=t=>String(t).replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  function story(text,tone){
    alert.classList.toggle('ready',tone==='ready');
    alert.querySelector('.t').textContent=plain(text);
    alert.classList.add('show');
    document.getElementById('pLog')?.classList.add('jam-log-pulse');
    clearTimeout(alertTimer);
    alertTimer=setTimeout(()=>{alert.classList.remove('show','ready');document.getElementById('pLog')?.classList.remove('jam-log-pulse')},5200);
  }
  alert.onclick=()=>{alert.classList.remove('show','ready');document.getElementById('pLog')?.scrollIntoView({behavior:'smooth',block:'center'})};

  const _note=note;
  note=function(text,kind){
    _note(text,kind);
    const msg=plain(text);
    if(kind==='hi'||/available|open|arrives|earned|quiet|left|ready|warning|recalled|changed/i.test(msg))story(msg,kind==='hi'?'hi':undefined);
  };

  let audioCtx=null,audioUnlocked=false,audioOn=true;
  function unlockAudio(){
    if(!audioOn)return;
    try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();audioUnlocked=true}catch(e){}
  }
  function tone(f,when,dur,vol,type){
    if(!audioOn||!audioUnlocked||!audioCtx)return;
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type||'sine';o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);
    const now=audioCtx.currentTime+when;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(vol||.02,now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.start(now);o.stop(now+dur+.02);
  }
  function cue(kind){
    unlockAudio();if(!audioUnlocked)return;
    if(kind==='ready'){tone(523,0,.16,.026);tone(784,.08,.22,.022)}
    else if(kind==='success'){tone(392,0,.13,.02);tone(523,.07,.16,.021);tone(659,.15,.24,.024)}
    else {tone(330,0,.13,.018);tone(495,.09,.18,.016)}
  }
  document.addEventListener('pointerdown',unlockAudio,{once:true,capture:true});
  document.addEventListener('keydown',unlockAudio,{once:true,capture:true});
  const barRight=document.querySelector('.bar-right');
  if(barRight){
    const sound=document.createElement('button');sound.id='jamSoundToggle';sound.className='ghost';sound.type='button';sound.textContent='Sound: on';
    sound.onclick=()=>{audioOn=!audioOn;sound.textContent='Sound: '+(audioOn?'on':'off');if(audioOn){unlockAudio();cue('success')}};
    barRight.insertBefore(sound,barRight.firstChild);
  }

  s.style=s.style||null;
  s.style2=s.style2||null;
  s._stirs=s._stirs||[];
  const savedRaw=store.get(KEY);
  const saved=(()=>{try{return savedRaw?JSON.parse(savedRaw):null}catch(e){return null}})();

  demand=function(){
    const p=Math.max(1.8,s.price);
    const base=s.style==='maker'?0.82:(s.style==='store'?1:0.72);
    const elasticity=s.style==='maker'?0.95:(s.style==='store'?1.65:1.35);
    let wanted=base*s.mkt*s.mktEff*Math.pow(3.2/p,elasticity);
    if(p>6.5)wanted*=0.72;
    return clamp(wanted,0.03,14);
  };
  sellPerSec=function(){return demand()};

  const _stir=stir;
  stir=function(){const before=s.made;_stir();const n=s.made-before;if(n>0){s._stirs.push({t:performance.now(),n});if(s._stirs.length>30)s._stirs.shift()}};
  function manualRate(){const now=performance.now();s._stirs=s._stirs.filter(x=>now-x.t<3500);return s._stirs.reduce((a,x)=>a+x.n,0)/3.5}

  function marketUI(){
    const market=document.getElementById('pMarket');if(!market)return;
    const labels=[...market.querySelectorAll('.readout span')];
    const appetite=labels.find(x=>x.textContent.trim()==='Public appetite');if(appetite)appetite.textContent='Wanted';
    const selling=labels.find(x=>x.textContent.trim()==='Selling');
    if(selling&&!document.getElementById('jamMadeRate')){const row=selling.closest('.readout');const made=document.createElement('div');made.className='readout';made.id='jamMadeRate';made.innerHTML='<span>Made</span><b id="jamMadeRateValue">0.0 /sec</b>';row.parentElement.insertBefore(made,row)}
    if(selling&&!document.getElementById('jamBacklog')){const row=selling.closest('.readout');const back=document.createElement('div');back.className='readout';back.id='jamBacklog';back.innerHTML='<span>Backlog</span><b id="jamBacklogValue">0 jars</b>';row.parentElement.insertBefore(back,row)}
    if(!document.getElementById('jamMarketHint')){const h=document.createElement('div');h.className='r-desc';h.id='jamMarketHint';h.style.marginTop='7px';market.appendChild(h)}
  }

  const _render=render;
  render=function(dt){
    _render(dt);
    if(s.act===1){
      marketUI();
      const wanted=demand(),made=autoPerSec()+manualRate(),backlog=Math.floor(s.jars);
      el.demand.textContent=rate(wanted)+' /sec';
      el.demandBar.style.width=clamp((wanted/Math.max(.4,made+.15))*62,4,100)+'%';
      const mv=document.getElementById('jamMadeRateValue');if(mv)mv.textContent=rate(made)+' /sec';
      const bv=document.getElementById('jamBacklogValue');if(bv)bv.textContent=fmt(backlog)+' jars';
      const h=document.getElementById('jamMarketHint');if(h){if(wanted>made*1.28)h.textContent='Customers are waiting. More people want jars than you are making.';else if(wanted<Math.max(.25,made*.62))h.textContent='The shelf is filling. You are making faster than the market clears.';else h.textContent='The shelf is balanced. Small price moves can change the shape of the queue.'}
      const down=document.getElementById('priceDown'),up=document.getElementById('priceUp');if(down)down.disabled=s.price<=1.8;if(up)up.disabled=s.price>=12;
    }
  };
  const step=()=>s.price<5?.1:.25;
  $('#priceUp').onclick=()=>{s.price=Math.min(12,Math.round((s.price+step())*100)/100)};
  $('#priceDown').onclick=()=>{s.price=Math.max(1.8,Math.round((s.price-step())*100)/100)};

  function ensureDirection(){let p=document.getElementById('jamDirection');if(p)return p;p=document.createElement('div');p.className='panel hidden';p.id='jamDirection';const right=document.querySelector('.col-right');if(!right)return null;right.insertBefore(p,document.getElementById('pRecipes'));return p}
  function chooseStyle(style){s.style=style;document.getElementById('jamDirection')?.classList.add('hidden');note('<b>'+(style==='maker'?'Maker’s Table':'Corner Store')+'</b> is your house style now. The market will remember.','hi');cue('success');save()}
  function showStyle1(){if(s.act!==1||s.made<800||s.style)return;const p=ensureDirection();if(!p)return;p.classList.remove('hidden');p.classList.add('reveal');p.innerHTML='<div class="kicker">House style</div><div class="r-desc" style="margin-top:4px">There is no best answer. You are choosing the problem you would rather solve.</div><div class="jam-choice-grid"><button class="jam-choice" id="jamMaker"><strong>Maker’s Table</strong><span>Steadier customers and more room to charge a little more. Your shelf grows slowly.</span><small>Lower demand · calmer pricing</small></button><button class="jam-choice" id="jamStore"><strong>Corner Store</strong><span>More people want the jar, but they are much more sensitive to price. Volume rewards attention.</span><small>Higher demand · sharper price swings</small></button></div>';$('#jamMaker').onclick=()=>chooseStyle('maker');$('#jamStore').onclick=()=>chooseStyle('store');if(!s.seen.stylePrompt){s.seen.stylePrompt=true;note('Two ways to grow have appeared. Neither is wrong.','hi')}}
  function chooseStyle2(style){s.style2=style;if(style==='hedge'){s.pickMult*=.85;s.pressMult*=.85;s.lineMult*=.85}else{s.pickMult*=1.18;s.pressMult*=1.18;s.lineMult*=1.18}if(!powDraw.__jamWrapped){const base=powDraw;const wrapped=function(){const v=base();return s.style2==='hedge'?v*.65:s.style2==='factory'?v*1.28:v};wrapped.__jamWrapped=true;powDraw=wrapped}document.getElementById('jamDirection')?.classList.add('hidden');note('<b>'+(style==='hedge'?'Hedgerow':'Factory Floor')+'</b> is now the bias of the orchard. You will learn to work with it.','hi');cue('success');save()}
  function showStyle2(){if(s.act!==2||converted2()<.08||s.style2)return;const p=ensureDirection();if(!p)return;p.classList.remove('hidden');p.classList.add('reveal');p.innerHTML='<div class="kicker">Orchard philosophy</div><div class="r-desc" style="margin-top:4px">The orchard can be forgiving or fast. You can change equipment later; this sets the bias of the operation.</div><div class="jam-choice-grid"><button class="jam-choice" id="jamHedge"><strong>Hedgerow</strong><span>Machines run quieter and sip less power. Output is lower, but a weak grid hurts much less.</span><small>−15% output · −35% power draw</small></button><button class="jam-choice" id="jamFactory"><strong>Factory Floor</strong><span>Push the machinery hard. You make more when the grid is healthy, and power shortages bite harder.</span><small>+18% output · +28% power draw</small></button></div>';$('#jamHedge').onclick=()=>chooseStyle2('hedge');$('#jamFactory').onclick=()=>chooseStyle2('factory');if(!s.seen.style2Prompt){s.seen.style2Prompt=true;note('The orchard asks a different question: forgiving or fast?','hi')}}

  const READY={buyFruit:'A crate is affordable',buySpoon:'An autospoon is affordable',buyWorks:'Jamworks can be built',buyMkt:'Marketing can be upgraded',buyOven:'An oven upgrade is affordable',buyCellar:'A notebook upgrade is affordable',exDeposit:'The exchange is open to you',tRun:'The tasting panel is ready',buyPicker:'A picker can be built',buyPresser:'A presser can be built',buyFactory:'A bottling line can be built',buySun:'A sun trap can be built',buyBattery:'A cellar can be built',launchSpore:'A spore is affordable'};
  const ready={};let armed=false;
  function scanReady(seed){const just=[];Object.keys(READY).forEach(id=>{const b=document.getElementById(id);if(!b||b.classList.contains('hidden'))return;const now=!b.disabled;if(seed||ready[id]===undefined){ready[id]=now;return}if(now&&!ready[id])just.push(READY[id]);ready[id]=now});document.querySelectorAll('#recipeList .recipe').forEach(b=>{const id='r_'+b.dataset.id,now=!b.disabled;if(seed||ready[id]===undefined){ready[id]=now;return}if(now&&!ready[id])just.push('A recipe is ready to buy');ready[id]=now});if(just.length&&armed){story(just.length===1?just[0]:just.length+' new choices are ready','ready');cue('ready')}}

  const _boot=boot;
  boot=function(){
    let away=0;if(saved&&saved.last)away=Math.max(0,(Date.now()-saved.last)/1000);
    _boot();
    if(!savedRaw)s.price=3.2;else if(s.act===1&&s.made<1000&&s.price<1){s.price=3.2;note('The shelf was priced like a novelty shop. The market has been reset to something resembling jam.','hi')}
    marketUI();
    if(away>45){story('While you were away, the kitchen kept working. Come back when something is ready.','ready');cue('ready')}
    setTimeout(()=>{armed=true;scanReady(true)},650);
    setInterval(()=>{if(s.act===1)showStyle1();if(s.act===2)showStyle2();scanReady(false)},650);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)scanReady(false)});
    render(0);save();
  };

  const _render2=render;
  render=function(dt){_render2(dt);const slot=document.getElementById('jamStrategySlot')||(()=>{const x=document.createElement('div');x.className='bar-slot';x.id='jamStrategySlot';x.innerHTML='<small>House</small><b>—</b>';const t=document.getElementById('slotTaste');t?.parentNode?.insertBefore(x,t);return x})();slot.querySelector('b').textContent=s.style2||s.style||'—'};
})();
