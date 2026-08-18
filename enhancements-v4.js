(function(){
  'use strict';
  if(window.__JAM_ACT2_GUIDE__) return;
  window.__JAM_ACT2_GUIDE__=true;

  const css=document.createElement('style');
  css.textContent=`
    #jamAct2Guide{padding:13px 14px;background:var(--card);border:1px solid var(--rule);box-shadow:var(--shadow);margin-bottom:14px}
    #jamAct2Guide .guide-head{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
    #jamAct2Guide .guide-title{font:600 18px/1.1 "Bodoni Moda",serif}
    #jamAct2Guide .guide-close{font-size:10px;padding:4px 7px}
    #jamAct2Guide .guide-copy{color:var(--steel);font-size:11.5px;line-height:1.5;margin-top:7px;max-width:68ch}
    #jamAct2Guide .guide-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}
    #jamAct2Guide .flow{border:1px solid var(--rule);background:var(--card-2);padding:8px 9px}
    #jamAct2Guide .flow b{display:block;font:500 11px "IBM Plex Mono",monospace;letter-spacing:.05em;text-transform:uppercase}
    #jamAct2Guide .flow span{display:block;color:var(--steel);font-size:10.5px;margin-top:3px}
    #jamAct2Guide .guide-now{margin-top:10px;padding-top:9px;border-top:1px dotted var(--rule-soft);display:flex;gap:10px;align-items:baseline}
    #jamAct2Guide .guide-now .k{font:9px "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--steel);white-space:nowrap}
    #jamAct2Guide .guide-now .v{font-size:12px}
    #jamAct2Guide.compact{padding:7px 9px;margin-bottom:10px}
    #jamAct2Guide.compact .guide-copy,#jamAct2Guide.compact .guide-flow{display:none}
    @media(max-width:760px){#jamAct2Guide .guide-flow{grid-template-columns:1fr}.guide-now{display:block}.guide-now .k{display:block;margin-bottom:3px}}
  `;
  document.head.appendChild(css);

  function getGuide(){
    let g=document.getElementById('jamAct2Guide');
    if(g)return g;
    const orchard=document.getElementById('pOrchard');
    if(!orchard)return null;
    g=document.createElement('section');
    g.id='jamAct2Guide';
    g.innerHTML=`
      <div class="guide-head"><div><div class="kicker">Field notes · Act II</div><div class="guide-title">The jam escaped the jar.</div></div><button class="ghost guide-close" id="jamGuideClose" type="button">Got it</button></div>
      <div class="guide-copy">The culture has spread into the orchard. You are no longer running a shop: you are following the culture's new production chain and turning the remaining fruitable mass into jam before the catchment is exhausted.</div>
      <div class="guide-flow">
        <div class="flow"><b>1 · Pick</b><span>Unpicked mass → pulp</span></div>
        <div class="flow"><b>2 · Press</b><span>Pulp → pressed fruit</span></div>
        <div class="flow"><b>3 · Bottle</b><span>Pressed fruit → jars</span></div>
      </div>
      <div class="guide-now"><span class="k">Next useful step</span><span class="v" id="jamGuideNow">Build one machine at a time and watch where material piles up.</span></div>`;
    orchard.parentNode.insertBefore(g,orchard);
    document.getElementById('jamGuideClose').onclick=()=>{g.classList.add('compact');s.seen.act2Guide=true;save()};
    return g;
  }

  function updateGuide(){
    if(s.act!==2)return;
    const g=getGuide();if(!g)return;
    const v=document.getElementById('jamGuideNow');if(!v)return;
    let text='Build one machine at a time and watch where material piles up.';
    if(s.pickers<1)text='Start with a picker. It turns the unpicked orchard into pulp.';
    else if(s.pressers<1)text=s.pulp>0?'Pulp is piling up. Build a presser next.':'Your picker is running. Give it a presser when pulp starts to accumulate.';
    else if(s.lines<1)text=s.ofruit>0?'Pressed fruit is waiting. Build a bottling line next.':'Your press is running. The next job is bottling.';
    else if(powDraw()>Math.max(1,powSupply()))text='Your factory wants more power than the grid supplies. Add a Sun Trap or a Cellar.';
    else if(!s.swarmOn&&s.pickers<25)text='Your line works. Scale the orchard; at 25 pickers the swarm can join the process.';
    else if(s.swarmOn&&s.mood<0.45)text='The bees are restless. Try Play or a different balance before they leave.';
    else if(s.swarmOn&&!s.recipes.gifts)text='The swarm has arrived. Learn its rhythm; its humming can become useful.';
    else if(s.mass>0)text='Keep an eye on the three queues. Build the machine behind the biggest pile, not simply the most expensive one.';
    else text='The orchard is exhausted. There is nowhere else to pick; the next phase will explain what the culture wants to do next.';
    v.textContent=text;
  }

  const baseBegin=beginAct2;
  beginAct2=function(){
    baseBegin();
    setTimeout(()=>{
      const g=getGuide();
      if(g&&!s.seen.act2Guide)g.classList.remove('compact');
      updateGuide();
    },80);
  };

  const baseRender=render;
  render=function(dt){
    baseRender(dt);
    updateGuide();
  };

  if(s.act===2){
    setTimeout(()=>{
      const g=getGuide();
      if(g&&!s.seen.act2Guide)g.classList.remove('compact');
      updateGuide();
    },40);
  }
})();
