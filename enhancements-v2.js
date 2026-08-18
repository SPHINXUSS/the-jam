(function(){
  'use strict';
  if(window.__JAM_SYSTEMS_V2__) return;
  window.__JAM_SYSTEMS_V2__=true;

  /* ============================================================
     THE JAM — systems polish v2
     Focus: economy pacing, restrained recipe alerts, real choice,
     and a tasting panel that is interesting without becoming an
     inspiration faucet.
     ============================================================ */

  const css=document.createElement('style');
  css.textContent=`
    #jamNotice{
      position:fixed;top:66px;right:18px;z-index:120;width:min(360px,calc(100vw - 30px));
      background:var(--card);color:var(--ink);border:1px solid var(--rule);
      box-shadow:0 8px 24px rgba(0,0,0,.12);padding:9px 12px;
      opacity:0;transform:translateY(-6px);pointer-events:none;
      transition:opacity .22s ease,transform .22s ease;
    }
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
    clearTimeout(noticeTimer);
    noticeTimer=setTimeout(()=>notice.classList.remove('show'),3200);
  }

  /* ------------------------------------------------------------
     Quiet audio: recipe availability / first affordance only.
     ------------------------------------------------------------ */
  let audioCtx=null,audioUnlocked=false,audioOn=true;
  function unlockAudio(){
    if(!audioOn)return;
    try{
      audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended')audioCtx.resume();
      audioUnlocked=true;
    }catch(e){}
  }
  function tone(f,when,dur,vol){
    if(!audioOn||!audioUnlocked||!audioCtx)return;
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type='sine';o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);
    const now=audioCtx.currentTime+when;
    g.gain.setValueAtTime(.0001,now);
    g.gain.exponentialRampToValueAtTime(vol,now+.01);
    g.gain.exponentialRampToValueAtTime(.0001,now+dur);
    o.start(now);o.stop(now+dur+.02);
  }
  function recipeCue(){unlockAudio();if(!audioUnlocked)return;tone(523,0,.12,.021);tone(659,.08,.16,.018)}
  document.addEventListener('pointerdown',unlockAudio,{once:true,capture:true});
  document.addEventListener('keydown',unlockAudio,{once:true,capture:true});

  const barRight=document.querySelector('.bar-right');
  if(barRight){
    const sound=document.createElement('button');
    sound.id='jamSoundToggle';sound.className='ghost';sound.type='button';sound.textContent='Sound: on';
    sound.onclick=()=>{audioOn=!audioOn;sound.textContent='Sound: '+(audioOn?'on':'off');if(audioOn){unlockAudio();recipeCue()}};
    barRight.insertBefore(sound,barRight.firstChild);
  }

  /* ------------------------------------------------------------
     Economy rebalance.
     At the opening price, demand is deliberately below manual
     production. At the floor price, a focused player can almost
     clear the shelf by hand, without turning the economy into a
     money printer.
     ------------------------------------------------------------ */
  s.style=s.style||null;
  s.style2=s.style2||null;
  s._stirs=s._stirs||[];

  demand=function(){
    const p=Math.max(1.8,s.price||3.2);
    const base=s.style==='maker'?0.50:(s.style==='store'?0.62:0.55);
    const elasticity=s.style==='maker'?0.90:(s.style==='store'?1.20:1.05);
    const awareness=Math.max(0.65,Math.min(3.0,s.mktEff||1));
    let wanted=base*(s.mkt||1)*awareness*Math.pow(3.2/p,elasticity);
    if(p>5.8)wanted*=0.82;
    return clamp(wanted,0.03,8);
  };
  sellPerSec=function(){return demand()};

  const baseStir=stir;
  stir=function(){
    const before=s.made;
    baseStir();
    const n=s.made-before;
    if(n>0){
      s._stirs.push({t:performance.now(),n});
      if(s._stirs.length>30)s._stirs.shift();
    }
  };
  function manualRate(){
    const now=performance.now();
    s._stirs=s._stirs.filter(x=>now-x.t<3500);
    return s._stirs.reduce((a,x)=>a+x.n,0)/3.5;
  }

  function marketUI(){
    const market=document.getElementById('pMarket');
    if(!market)return;
    const labels=[...market.querySelectorAll('.readout span')];
    const appetite=labels.find(x=>x.textContent.trim()==='Public appetite');
    if(appetite)appetite.textContent='Wanted';
    const selling=labels.find(x=>x.textContent.trim()==='Selling');
    if(selling&&!document.getElementById('jamMadeRate')){
      const row=selling.closest('.readout');
      const made=document.createElement('div');made.className='readout';made.id='jamMadeRate';
      made.innerHTML='<span>Made</span><b id="jamMadeRateValue">0.0 /sec</b>';
      row.parentElement.insertBefore(made,row);
    }
    if(selling&&!document.getElementById('jamBacklog')){
      const row=selling.closest('.readout');
      const back=document.createElement('div');back.className='readout';back.id='jamBacklog';
      back.innerHTML='<span>Backlog</span><b id="jamBacklogValue">0 jars</b>';
      row.parentElement.insertBefore(back,row);
    }
    if(!document.getElementById('jamMarketHint')){
      const h=document.createElement('div');h.className='r-desc';h.id='jamMarketHint';h.style.marginTop='7px';
      market.appendChild(h);
    }
  }

  const baseRender=render;
  render=function(dt){
    baseRender(dt);
    if(s.act===1){
      marketUI();
      const wanted=demand();
      const made=autoPerSec()+manualRate();
      const backlog=Math.floor(s.jars);
      if(el.demand)el.demand.textContent=rate(wanted)+' /sec';
      if(el.demandBar)el.demandBar.style.width=clamp((wanted/Math.max(.45,made+.1))*62,4,100)+'%';
      const mv=document.getElementById('jamMadeRateValue');if(mv)mv.textContent=rate(made)+' /sec';
      const bv=document.getElementById('jamBacklogValue');if(bv)bv.textContent=fmt(backlog)+' jars';
      const h=document.getElementById('jamMarketHint');
      if(h){
        if(wanted>made*1.25)h.textContent='Customers are waiting. Lowering the price can grow the queue.';
        else if(wanted<Math.max(.35,made*.65))h.textContent='The shelf is filling. Your kitchen is outrunning the market.';
        else h.textContent='The shelf is close to balanced. Small price moves matter.';
      }
      const down=document.getElementById('priceDown'),up=document.getElementById('priceUp');
      if(down)down.disabled=s.price<=1.8;
      if(up)up.disabled=s.price>=12;
    }
    if(s.tour&&s.tour.on){
      const b=document.getElementById('tRun');
      if(b){
        const wait=Math.max(0,(s.tour.nextRun||0)-Date.now());
        b.disabled=wait>0||s.insp<(700+s.tour.runs*180);
        b.textContent=wait>0?'Tasting panel · '+Math.ceil(wait/1000)+'s':'Run tasting · '+fmt(700+s.tour.runs*180)+' insp';
      }
    }
  };

  const step=()=>s.price<5?.1:.25;
  $('#priceUp').onclick=()=>{s.price=Math.min(12,Math.round((s.price+step())*100)/100)};
  $('#priceDown').onclick=()=>{s.price=Math.max(1.8,Math.round((s.price-step())*100)/100)};

  /* ------------------------------------------------------------
     Restrained strategic forks. They are soft commitments, not
     traps: each changes the shape of the problem rather than
     taking content away.
     ------------------------------------------------------------ */
  function ensureDirection(){
    let p=document.getElementById('jamDirection');
    if(p)return p;
    p=document.createElement('div');p.className='panel hidden';p.id='jamDirection';
    const right=document.querySelector('.col-right');if(!right)return null;
    right.insertBefore(p,document.getElementById('pRecipes'));return p;
  }
  function chooseStyle(style){
    s.style=style;
    document.getElementById('jamDirection')?.classList.add('hidden');
    note('<b>'+(style==='maker'?'Maker’s Table':'Corner Store')+'</b> is your house style now. The market will remember.','hi');
    save();
  }
  function showStyle1(){
    if(s.act!==1||s.made<800||s.style)return;
    const p=ensureDirection();if(!p)return;
    p.classList.remove('hidden');p.classList.add('reveal');
    p.innerHTML='<div class="kicker">House style</div><div class="r-desc" style="margin-top:4px">There is no best answer. You are choosing the problem you would rather solve.</div><div class="jam-choice-grid">'+
      '<button class="jam-choice" id="jamMaker"><strong>Maker’s Table</strong><span>Steadier customers and more room to charge a little more. The market stays calmer.</span><small>−10% demand · softer price curve</small></button>'+
      '<button class="jam-choice" id="jamStore"><strong>Corner Store</strong><span>More people want the jar, but they are more sensitive to price. Volume is the reward.</span><small>+12% demand · sharper price curve</small></button></div>';
    $('#jamMaker').onclick=()=>chooseStyle('maker');$('#jamStore').onclick=()=>chooseStyle('store');
    if(!s.seen.stylePrompt){s.seen.stylePrompt=true;note('Two ways to grow have appeared. Neither is wrong.','hi')}
  }
  function chooseStyle2(style){
    s.style2=style;
    if(style==='hedge'){s.pickMult*=.85;s.pressMult*=.85;s.lineMult*=.85}
    else{s.pickMult*=1.18;s.pressMult*=1.18;s.lineMult*=1.18}
    if(!powDraw.__jamWrapped){
      const base=powDraw;
      const wrapped=function(){const v=base();return s.style2==='hedge'?v*.65:s.style2==='factory'?v*1.28:v};
      wrapped.__jamWrapped=true;powDraw=wrapped;
    }
    document.getElementById('jamDirection')?.classList.add('hidden');
    note('<b>'+(style==='hedge'?'Hedgerow':'Factory Floor')+'</b> is now the bias of the orchard. You will learn to work with it.','hi');
    save();
  }
  function showStyle2(){
    if(s.act!==2||converted2()<.08||s.style2)return;
    const p=ensureDirection();if(!p)return;
    p.classList.remove('hidden');p.classList.add('reveal');
    p.innerHTML='<div class="kicker">Orchard philosophy</div><div class="r-desc" style="margin-top:4px">The orchard can be forgiving or fast. You can change equipment later; this sets the bias of the operation.</div><div class="jam-choice-grid">'+
      '<button class="jam-choice" id="jamHedge"><strong>Hedgerow</strong><span>Machines run quieter and sip less power. Output is lower, but shortages hurt less.</span><small>−15% output · −35% power draw</small></button>'+
      '<button class="jam-choice" id="jamFactory"><strong>Factory Floor</strong><span>Push the machinery hard. You make more while the grid is healthy, but outages hurt more.</span><small>+18% output · +28% power draw</small></button></div>';
    $('#jamHedge').onclick=()=>chooseStyle2('hedge');$('#jamFactory').onclick=()=>chooseStyle2('factory');
    if(!s.seen.style2Prompt){s.seen.style2Prompt=true;note('The orchard asks a different question: forgiving or fast?','hi')}
  }

  /* ------------------------------------------------------------
     Recipe-only notification system.
     - New recipe discovered: once.
     - First time affordable: once.
     - Never fires for routine upgrades or a recipe the player
       deliberately ignored and later can afford again.
     ------------------------------------------------------------ */
  const recipeSeen=s.jamRecipeNotice||{available:{},affordable:{}};
  s.jamRecipeNotice=recipeSeen;
  let noticeArmed=false;
  let lastNotice=0;
  let pending=[];
  function queueRecipeMessage(msg){
    pending.push(msg);
    if(!noticeArmed||Date.now()-lastNotice<4500)return;
    const text=pending.length===1?pending[0]:pending.length+' recipes are ready';
    pending=[];lastNotice=Date.now();showNotice('Recipes',text,'ready');recipeCue();
  }
  function scanRecipes(initial){
    if(!R||!Array.isArray(R)||s.ended)return;
    const avail=[],afford=[];
    for(const r of R){
      if(r.act!==s.act||!r.when())continue;
      const id=String(r.id);
      if(!recipeSeen.available[id]){
        recipeSeen.available[id]=true;
        if(canAfford(r)){
          recipeSeen.affordable[id]=true;
          if(!initial)afford.push(r.name);
        }else if(!initial)avail.push(r.name);
      }else if(canAfford(r)&&!recipeSeen.affordable[id]){
        recipeSeen.affordable[id]=true;
        if(!initial)afford.push(r.name);
      }
    }
    if(!initial){
      if(avail.length)queueRecipeMessage(avail.length===1?avail[0]+' is now available':'New recipes are available');
      if(afford.length)queueRecipeMessage(afford.length===1?afford[0]+' can be bought now':'A recipe is ready to buy');
    }
  }

  /* ------------------------------------------------------------
     Tasting panel rebalance.
     It becomes a useful optional side-game, not a renewable money
     machine: escalating cost, cooldown, bounded reward, noisy panel.
     ------------------------------------------------------------ */
  runTournament=function(){
    const cost=700+s.tour.runs*180;
    if(Date.now()<(s.tour.nextRun||0)){toast('The panel is still tasting.');return}
    if(s.insp<cost){toast('Needs '+fmt(cost)+' inspiration.');return}

    s.insp-=cost;
    const n=s.tour.unlocked;
    const pay=[[Math.floor(Math.random()*7),Math.floor(Math.random()*7)],
               [Math.floor(Math.random()*7),Math.floor(Math.random()*7)]];
    const score=new Array(n).fill(0);
    for(let a=0;a<n;a++)for(let b=0;b<n;b++){
      if(a===b)continue;
      const ha=[],hb=[];
      for(let r=0;r<12;r++){
        const ma=STRATS[a].f(hb,r,pay),mb=STRATS[b].f(ha,r,[[pay[0][0],pay[1][0]],[pay[0][1],pay[1][1]]]);
        score[a]+=pay[ma][mb];score[b]+=pay[mb][ma];
        ha.push(ma);hb.push(mb);
      }
    }

    /* The panel is not deterministic: mood, bias and blind tasters
       create enough variance that a preferred strategy can still lose. */
    const fav=Math.floor(Math.random()*n);
    for(let i=0;i<n;i++){
      score[i]*=(.84+Math.random()*.32);
      if(i===fav)score[i]+=14+Math.random()*18;
    }

    const order=score.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);
    s.tour.grid=pay;s.tour.rank=order;s.tour.runs++;
    const mine=s.tour.strat;
    const place=order.findIndex(o=>o.i===mine);
    let gain=Math.round(score[mine]*1.65);
    const mult=place===0?1.55:place===1?1.05:.55;
    gain=Math.round(gain*mult);
    gain=clamp(gain,80,1100);
    s.insp=clamp(s.insp+gain,0,inspMax());
    if(place===0){s.crea+=1;note('Your palate took the panel. +'+fmt(gain)+' inspiration, +1 creativity.','hi')}
    else note('Panel '+s.tour.runs+': you placed '+(place+1)+'. +'+fmt(gain)+' inspiration.','dim');
    s.tour.nextRun=Date.now()+18000;
  };

  /* ------------------------------------------------------------
     Boot: normalize only broken opening values; keep existing saves.
     ------------------------------------------------------------ */
  const baseBoot=boot;
  boot=function(){
    baseBoot();
    if(!s._jamBalanceVersion||s._jamBalanceVersion<2){
      if(s.act===1&&s.made<1000){s.price=3.2;s.mktEff=1}
      s.price=Math.max(1.8,s.price||3.2);
      s.mktEff=Math.max(1,s.mktEff||1);
      s._jamBalanceVersion=2;
      save();
    }
    marketUI();
    setTimeout(()=>{noticeArmed=true;scanRecipes(true)},700);
    setInterval(()=>{
      if(s.act===1)showStyle1();
      if(s.act===2)showStyle2();
      scanRecipes(false);
      if(pending.length&&Date.now()-lastNotice>=4500){
        const text=pending.length===1?pending.shift():pending.length+' recipes are ready';
        pending=[];lastNotice=Date.now();showNotice('Recipes',text,'ready');recipeCue();
      }
    },700);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)scanRecipes(false)});
    render(0);
  };

  const originalNote=note;
  note=function(text,kind){
    originalNote(text,kind);
    const msg=plain(text);
    /* Only genuinely story-scale events get a banner. Purchases,
       resource gains and ordinary unlocks remain in the log. */
    if(kind==='hi' && /(The shelf is open|The exchange is open|The culture is alive|The kitchen is closed|There is no unpicked mass|Everything changes|The orchard is quiet|Every jar in the catchment|A pot, a spoon|The last jar)/i.test(msg)){
      showNotice('Logbook',msg,'story');
    }
  };

})();
