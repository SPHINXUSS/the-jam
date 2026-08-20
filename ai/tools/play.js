/* ============================================================
   ai/tools/play.js — play the real game in a real browser

   sim.js measures balance against a stub DOM. It cannot see a dead
   button, a frozen readout, or a control that ignores the keyboard —
   five defects of exactly that class survived every simulated run and
   were found here in one sitting (see ai/wiki/sessions/003).

   How it works: the game's own requestAnimationFrame is queued rather
   than scheduled, and node pumps it frame by frame, so 3h40 of play fits
   in ten minutes of wall time with every tick, render, reveal and save
   happening exactly as written. On top sits a policy that presses real
   buttons in the real DOM. Nothing is stubbed.

   It proves the machine runs. It cannot tell you whether the game is
   fun — only the PO can.

   Needs: Chrome (or set CHROME), and playwright-core somewhere node can
   find it. Neither is a dependency of the game itself, which still runs
   from disk with no build step and no packages.

     npm i playwright-core          # anywhere; set NODE_PATH if needed
     python3 -m http.server 8123    # from the repo root
     node ai/tools/play.js          # or: URL=... node ai/tools/play.js

   Prints the act timings, every page error, and any readout that stayed
   visible without ever changing. Screenshots land in SHOTS.
   ============================================================ */

const path=require('path');
const fs=require('fs');
const CHROME=process.env.CHROME||'/usr/bin/google-chrome';
const URL=process.env.URL||'http://localhost:8123/index.html';
const SHOTS=process.env.SHOTS||path.join(require('os').tmpdir(),'the-jam-play');
let chromium;
try{ ({chromium}=require('playwright-core')); }
catch(e){
  console.error('playwright-core not found. npm i playwright-core, then set NODE_PATH to where it landed.');
  process.exit(1);
}


const WARP_INIT = () => {
  window.__w = { on:false, step:500, v:0, q:[] };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    if(!window.__w.on) return raf(cb);
    window.__w.q.push(cb); return 1;
  };
  window.__warpOn = (step) => { window.__w.v = performance.now(); window.__w.step = step||500; window.__w.on = true; };
  window.__warpOff = () => { window.__w.on = false; const q=window.__w.q.splice(0); q.forEach(cb=>raf(cb)); };
  // run exactly n frames of the game's own loop, synchronously
  window.__pump = (n) => { let i=0; while(i<n && window.__w.q.length){ const cb=window.__w.q.shift(); window.__w.v+=window.__w.step; cb(window.__w.v); i++; } return i; };
};

// a competent-but-not-optimal player, expressed as real DOM clicks
const POLICY = () => {
  const $=id=>document.getElementById(id);
  const vis=id=>{const e=$(id);return e&&!e.classList.contains('hidden')&&e.offsetParent!==null;};
  const press=e=>{ // works for both wirings: onclick handlers and press-and-hold dials
    e.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}));
    e.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0}));
    e.click();
  };
  const hit=id=>{const e=$(id); if(e&&!e.disabled&&e.offsetParent!==null){press(e);return 1;} return 0;};
  const num=id=>{const e=$(id); if(!e)return NaN; return parseFloat((e.textContent||'').replace(/[^0-9.\-]/g,''));};
  let acts=[];
  if(s.act===1){
    for(let i=0;i<8;i++){ if(atTheDoor()<1)break; if(hit('sellBtn'))acts.push('sell'); }
    if((s.spoons||0)<1&&s.fruit>0) for(let i=0;i<8;i++) if(hit('stirBtn'))acts.push('stir');
    if(vis('pFruit')&&s.fruit<600){ if(hit('buyFruit'))acts.push('fruit'); if(hit('autoFruit'))acts.push('autoFruit'); }
    if(hit('buySpoon'))acts.push('spoon');
    if(hit('buyWorks'))acts.push('works');
    if(hit('hireSeller'))acts.push('seller');
    if(hit('openShop'))acts.push('shop');
    if(hit('buyMkt'))acts.push('mkt');
    // spend taste where it is not wasted: a notebook once the palate is full
    if(s.insp>=inspMax()-0.5){ if(hit('buyCellar'))acts.push('cellar'); }
    else if(hit('buyOven'))acts.push('oven');
    // price: follow the game's own advice line
    const make=num('madeRate'), want=num('demand'), back=num('backlog');
    const obj=($('objText')||{}).textContent||'';
    if(/piling up|s\u2019accumulent/.test(obj)) { for(let i=0;i<4;i++) hit('priceDown'); }
    else if(want>make*1.2) hit('priceUp');
    else if(back>60&&want<make*0.9) hit('priceDown');
    // sugar: chase the stated target
    const cur=num('sugarVal'), tgt=num('sugarWant');
    if(vis('pSugar')&&isFinite(cur)&&isFinite(tgt)){ if(cur<tgt-2)hit('sugarUp'); else if(cur>tgt+2)hit('sugarDown'); }
    if(vis('pTasting')) hit('tRun');
    if(vis('pCulture')) hit('readCulture');
    if(vis('pExchange')&&s.cash>5000){ if(hit('exDeposit'))acts.push('invest'); }
  }
  if(s.act===2){
    const b=($('#oBottle')||{}).textContent||'';
    if(/pick/i.test(b)) hit('buyPicker'); else if(/set|press|pan/i.test(b)) hit('buyPresser'); else if(/bottl|line/i.test(b)) hit('buyFactory');
    else { hit('buyPicker'); hit('buyPresser'); hit('buyFactory'); }
    hit('buyVat'); hit('buySun'); hit('buyBattery');
    if(vis('blightBox')) hit('treatBlight');
    if(vis('pSwarm')) hit('swSync');
  }
  if(s.act===3){
    for(let i=0;i<3;i++) hit('launchSpore');
    const minusOf=k=>document.querySelector('#allocRows button[data-t="'+k+'"][data-d="-1"]');
    const plusOf=k=>document.querySelector('#allocRows button[data-t="'+k+'"][data-d="1"]');
    /* A raid is answered by moving points, not by adding them: the act
       arrives fully allocated, so Defence has to be paid for out of
       something else. A policy that only ever pressed + sat at one spore
       for eight hundred game-minutes holding the answer it had bought. */
    if(s.drifters>0&&plusOf('combat')&&(s.alloc.combat||0)<4){
      const donor=['replicate','speed','explore','press'].find(k=>(s.alloc[k]||0)>0);
      if(donor&&minusOf(donor)){ minusOf(donor).click(); plusOf('combat').click(); acts.push('defend'); }
    }else{
      const plus=[...document.querySelectorAll('#allocRows button[data-d="1"]')];
      if(plus.length) plus[Math.floor(Math.random()*plus.length)].click();
    }
  }
  const fork=document.querySelector('#forkSlot button:not([disabled])');
  if(fork){ fork.click(); acts.push('house:'+(fork.textContent||'').trim().slice(0,20)); }
  // recipes: take whatever is affordable
  const rec=document.querySelector('#recipeList .recipe.afford:not([disabled])');
  if(rec){ rec.click(); acts.push('recipe:'+rec.dataset.id); }
  return acts;
};

const SAMPLE = () => {
  const out={act:s.act, insp:Math.floor(s.insp||0), crea:Math.floor(s.crea||0), taste:Math.floor(s.taste||0), house:s.house||'—', made:Math.floor(s.made), cash:+(s.cash||0).toFixed(2), jars:Math.floor(s.jars||0),
             ended:!!s.ended, state:($('#stateText')||{}).textContent, obj:($('#objText')||{}).textContent, read:{}, bad:[]};
  document.querySelectorAll('b[id],div.val[id],#objText,#stateText,#marketWhy,#pipeWhy,#reachWhy,#doorWhy,#spoilWhy,#sugarWhy').forEach(e=>{
    const p=e.closest('.panel');
    const shown = e.offsetParent!==null;
    if(shown) out.read[e.id||e.className]= (e.textContent||'').trim().slice(0,60);
  });
  document.querySelectorAll('body *').forEach(e=>{
    if(e.children.length===0){ const tx=(e.textContent||''); if(/NaN|undefined|Infinity/.test(tx)) out.bad.push((e.id||e.tagName)+': '+tx.slice(0,60)); }
  });
  return out;
};

(async()=>{
  fs.mkdirSync(SHOTS,{recursive:true});
  const b=await chromium.launch({executablePath:CHROME,args:['--no-sandbox']});
  const ctx=await b.newContext({viewport:{width:1400,height:1000}});
  await ctx.addInitScript(WARP_INIT);
  const p=await ctx.newPage();
  const errs=[];
  p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE: '+m.text())});
  p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message+' | '+(e.stack||'').split('\n')[1]));
  await p.goto(URL);
  await p.evaluate(()=>{ try{localStorage.clear()}catch(e){} });
  await p.reload(); await p.waitForTimeout(800);

  const log=[]; const say=(...a)=>{const l=a.join(' ');log.push(l);console.log(l);};

  // ---- phase 1: genuine mouse input, real time ----
  say('== phase 1: real clicks, real time ==');
  for(let i=0;i<8;i++){ await p.click('#potCanvas'); }
  await p.waitForTimeout(300);
  say('after 8 pot clicks:', JSON.stringify(await p.evaluate(()=>({made:s.made,jars:s.jars,fruit:s.fruit,obj:$('#objText').textContent}))));
  for(let i=0;i<6;i++){ await p.click('#stirBtn'); }
  await p.waitForTimeout(400);
  say('after 6 stir clicks:', JSON.stringify(await p.evaluate(()=>({made:s.made,jars:s.jars,fruit:s.fruit,obj:$('#objText').textContent,state:$('#stateText').textContent}))));
  await p.screenshot({path:SHOTS+'/01-act1-early.png'});

  // ---- phase 2: warp + policy ----
  say('== phase 2: warped play ==');
  await p.evaluate(()=>window.__warpOn(500));
  const samples=[]; const acted=[]; const marks={};
  const t0=Date.now();
  let lastAct=1;
  for(let step=0; step<6000; step++){
    await p.evaluate(()=>window.__pump(20));          // 10 game-seconds of the real loop
    const a=await p.evaluate(POLICY); if(a.length)acted.push(a.join(','));
    if(step%6===0 || step<20){
      const smp=await p.evaluate(SAMPLE);
      smp.gt=await p.evaluate(()=>window.__w.v/1000);
      samples.push(smp);
      if(smp.act!==lastAct){
        say('--> ACT '+smp.act+' at game '+Math.round(smp.gt/60)+'m  | '+smp.state);
        marks['act'+smp.act]=smp.gt; lastAct=smp.act;
        await p.screenshot({path:SHOTS+'/0'+smp.act+'-act'+smp.act+'-arrival.png'});
      }
      if(smp.ended){ say('--> ENDED at game '+Math.round(smp.gt/60)+'m'); marks.ended=smp.gt; break; }
      if(smp.bad.length) say('BAD TEXT @'+Math.round(smp.gt/60)+'m: '+smp.bad.slice(0,4).join(' | '));
      if(step%120===0) say('  t='+Math.round(smp.gt/60)+'m act'+smp.act+' made='+smp.made+' cash='+smp.cash+' insp='+smp.insp+' crea='+smp.crea+' house='+smp.house+' | '+smp.obj);
    }
    if(Date.now()-t0>16*60*1000){ say('!! wall-clock cap hit'); break; }
  }
  await p.evaluate(()=>window.__warpOff());
  await p.waitForTimeout(400);
  await p.screenshot({path:SHOTS+'/09-final.png',fullPage:true});

  const last=samples[samples.length-1];
  say('final: act='+last.act+' made='+last.made+' gameMin='+Math.round(last.gt/60)+' ended='+last.ended);
  say('marks: '+JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k,v])=>[k,Math.round(v/60)+'m']))));
  say('errors('+errs.length+'): '+JSON.stringify([...new Set(errs)].slice(0,15),null,1));

  // stuck-readout analysis
  const seen={};
  samples.forEach(s2=>{ for(const k in s2.read){ (seen[k]=seen[k]||new Set()).add(s2.read[k]); } });
  const stuck=Object.entries(seen).filter(([k,v])=>v.size===1).map(([k,v])=>k+' = "'+[...v][0]+'"');
  say('readouts visible but never changing ('+stuck.length+'):\n  '+stuck.join('\n  '));
  fs.writeFileSync(SHOTS+'/samples.json',JSON.stringify(samples));
  fs.writeFileSync(SHOTS+'/play-report.txt',log.join('\n'));
  await b.close();
})();
