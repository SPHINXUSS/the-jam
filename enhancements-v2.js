(function(){
  'use strict';
  if(window.__JAM_SYSTEMS_V2__) return;
  window.__JAM_SYSTEMS_V2__=true;

  const css=document.createElement('style');
  css.textContent=`
    #jamNotice{position:fixed;top:66px;right:18px;z-index:120;width:min(360px,calc(100vw - 30px));background:var(--card);color:var(--ink);border:1px solid var(--rule);box-shadow:0 8px 24px rgba(0,0,0,.12);padding:9px 12px;opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}
    #jamNotice.show{opacity:1;transform:none}
    #jamNotice.ready{border-left:3px solid var(--boil)}
    #jamNotice .k{font:9px/1 "IBM Plex Mono",monospace;letter-spacing:.15em;text-transform:uppercase;color:var(--steel);margin-bottom:4px}
    #jamNotice .t{font:12px/1.4 "IBM Plex Sans",sans-serif}
    #jamNotice .sub{font:10px/1.3 "IBM Plex Mono",monospace;color:var(--steel);margin-top:3px}
    #jamDirection .jam-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}
    #jamDirection .jam-choice{display:block;width:100%;text-align:left;text-transform:none;letter-spacing:0;padding:10px 11px;background:var(--card-2);border:1px solid var(--rule);color:var(--ink)}
    #jamDirection .jam-choice:hover:not(:disabled){background:var(--ink);color:var(--card)}
    #jamDirection .jam-choice strong{display:block;font:600 14px/1.15 "Bodoni Moda",serif}
    #jamDirection .jam-choice span{display:block;margin-top:4px;color:var(--steel);font:11px/1.4 "IBM Plex Sans",sans-serif}
    #jamDirection .jam-choice small{display:block;margin-top:7px;color:var(--boil);font:9px "IBM Plex Mono",monospace;letter-spacing:.04em;text-transform:uppercase}
    @media(max-width:760px){#jamDirection .jam-choice-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const notice=document.createElement('div');
  notice.id='jamNotice';
  notice.innerHTML='<div class="k"></div><div class="t"></div><div class="sub"></div>';
  document.body.appendChild(notice);
  let noticeTimer=0;
  function plain(v){return String(v).replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")}
  function showNotice(title,text,kind){
    notice.classList.toggle('ready',kind==='ready');
    notice.querySelector('.k').textContent=title;
    notice.querySelector('.t').textContent=plain(text);
    notice.querySelector('.sub').textContent=kind==='ready'?'New recipe / first time ready to buy':'Logbook';
    notice.classList.add('show');
    clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),3200);
  }

  let audioCtx=null,audioUnlocked=false,audioOn=true;
  function unlockAudio(){if(!audioOn)return;try{audioCtx ||= new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();audioUnlocked=true}catch(e){}}
  function tone(f,when,dur,vol){if(!audioOn||!audioUnlocked||!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);const now=audioCtx.currentTime+when;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(vol,now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.start(now);o.stop(now+dur+.02)}
  function recipeCue(){unlockAudio();if(!audioUnlocked)return;tone(523,0,.12,.021);tone(659,.08,.16,.018)}
  document.addEventListener('pointerdown',unlockAudio,{once:true,capture:true});
  document.addEventListener('keydown',unlockAudio,{once:true,capture:true});
  const barRight=document.querySelector('.bar-right');
  if(barRight){const sound=document.createElement('button');sound.id='jamSoundToggle';sound.className='ghost';sound.type='button';sound.textContent='Sound: on';sound.onclick=()=>{audioOn=!audioOn;sound.textContent='Sound: '+(audioOn?'on':'off');if(audioOn){unlockAudio();recipeCue()}};barRight.insertBefore(sound,barRight.firstChild)}

  function ensureDirection(){let p=document.getElementById('jamDirection');if(p)return p;p=document.createElement('div');p.className='panel hidden';p.id='jamDirection';const right=document.querySelector('.col-right');if(!right)return null;right.insertBefore(p,document.getElementById('pRecipes'));return p}
  function chooseStyle(style){s.style=style;document.getElementById('jamDirection')?.classList.add('hidden');note('<b>'+(style==='maker'?'Maker’s Table':'Corner Store')+'</b> is your house style now. The market will remember.','hi');save()}
  function showStyle1(){if(s.act!==1||s.made<800||s.style)return;const p=ensureDirection();if(!p)return;p.classList.remove('hidden');p.classList.add('reveal');p.innerHTML='<div class="kicker">House style</div><div class="r-desc" style="margin-top:4px">There is no best answer. You are choosing the problem you would rather solve.</div><div class="jam-choice-grid"><button class="jam-choice" id="jamMaker"><strong>Maker’s Table</strong><span>Steadier customers and more room to charge a little more. The market stays calmer.</span><small>−10% demand · softer price curve</small></button><button class="jam-choice" id="jamStore"><strong>Corner Store</strong><span>More people want the jar, but they are more sensitive to price. Volume is the reward.</span><small>+12% demand · sharper price curve</small></button></div>';$('#jamMaker').onclick=()=>chooseStyle('maker');$('#jamStore').onclick=()=>chooseStyle('store');if(!s.seen.stylePrompt){s.seen.stylePrompt=true;note('Two ways to grow have appeared. Neither is wrong.','hi')}}
  function chooseStyle2(style){s.style2=style;if(style==='hedge'){s.pickMult*=.85;s.pressMult*=.85;s.lineMult*=.85}else{s.pickMult*=1.18;s.pressMult*=1.18;s.lineMult*=1.18}if(!powDraw.__jamWrapped){const base=powDraw;const wrapped=function(){const v=base();return s.style2==='hedge'?v*.65:s.style2==='factory'?v*1.28:v};wrapped.__jamWrapped=true;powDraw=wrapped}document.getElementById('jamDirection')?.classList.add('hidden');note('<b>'+(style==='hedge'?'Hedgerow':'Factory Floor')+'</b> is now the bias of the orchard. You will learn to work with it.','hi');save()}
  function showStyle2(){if(s.act!==2||converted2()<.08||s.style2)return;const p=ensureDirection();if(!p)return;p.classList.remove('hidden');p.classList.add('reveal');p.innerHTML='<div class="kicker">Orchard philosophy</div><div class="r-desc" style="margin-top:4px">The orchard can be forgiving or fast. You can change equipment later; this sets the bias of the operation.</div><div class="jam-choice-grid"><button class="jam-choice" id="jamHedge"><strong>Hedgerow</strong><span>Machines run quieter and sip less power. Output is lower, but shortages hurt less.</span><small>−15% output · −35% power draw</small></button><button class="jam-choice" id="jamFactory"><strong>Factory Floor</strong><span>Push the machinery hard. You make more while the grid is healthy, but outages hurt more.</span><small>+18% output · +28% power draw</small></button></div>';$('#jamHedge').onclick=()=>chooseStyle2('hedge');$('#jamFactory').onclick=()=>chooseStyle2('factory');if(!s.seen.style2Prompt){s.seen.style2Prompt=true;note('The orchard asks a different question: forgiving or fast?','hi')}}

  const recipeSeen=s.jamRecipeNotice||{available:{},affordable:{}};s.jamRecipeNotice=recipeSeen;
  let noticeArmed=false,lastNotice=0,pending=[];
  function queueRecipeMessage(msg){pending.push(msg);if(!noticeArmed||Date.now()-lastNotice<4500)return;const text=pending.length===1?pending[0]:pending.length+' recipes are ready';pending=[];lastNotice=Date.now();showNotice('Recipes',text,'ready');recipeCue()}
  function scanRecipes(initial){
    if(!R||!Array.isArray(R)||s.ended)return;
    const avail=[],afford=[];
    for(const r of R){
      if(r.act!==s.act||!r.when())continue;
      const id=String(r.id);
      if(!recipeSeen.available[id]){recipeSeen.available[id]=true;if(canAfford(r)){recipeSeen.affordable[id]=true;if(!initial)afford.push(r.name)}else if(!initial)avail.push(r.name)}
      else if(canAfford(r)&&!recipeSeen.affordable[id]){recipeSeen.affordable[id]=true;if(!initial)afford.push(r.name)}
    }
    if(!initial){if(avail.length)queueRecipeMessage(avail.length===1?avail[0]+' is now available':'New recipes are available');if(afford.length)queueRecipeMessage(afford.length===1?afford[0]+' can be bought now':'A recipe is ready to buy')}
  }

  const baseBoot=boot;
  boot=function(){
    baseBoot();
    if(!s._jamBalanceVersion||s._jamBalanceVersion<2){
      if(s.act===1&&s.made<1000){s.price=3.2;s.mktEff=1}
      s.price=Math.max(1.8,s.price||3.2);s.mktEff=Math.max(1,s.mktEff||1);s._jamBalanceVersion=2;save()
    }
    setTimeout(()=>{noticeArmed=true;scanRecipes(true)},700);
    setInterval(()=>{
      if(s.act===1)showStyle1();
      if(s.act===2)showStyle2();
      scanRecipes(false);
      if(pending.length&&Date.now()-lastNotice>=4500){const text=pending.length===1?pending.shift():pending.length+' recipes are ready';pending=[];lastNotice=Date.now();showNotice('Recipes',text,'ready');recipeCue()}
    },700);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)scanRecipes(false)});
  };

  const originalNote=note;
  note=function(text,kind){
    originalNote(text,kind);
    const msg=plain(text);
    if(kind==='hi'&&/(The shelf is open|The exchange is open|The culture is alive|The kitchen is closed|There is no unpicked mass|Everything changes|The orchard is quiet|Every jar in the catchment|A pot, a spoon|The last jar)/i.test(msg))showNotice('Logbook',msg,'story');
  };
})();
