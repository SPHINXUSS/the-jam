/* ============================================================
   The stand-in player.

   One policy, shared by every harness that plays the game headless,
   so `sim.js` (how long does an act take) and `pace.js` (how often
   does anything happen) cannot drift into simulating two different
   players. It stands in for a reasonably attentive person: stirs
   briskly at first, settles back, sets the price and the sugar to
   whatever earns most, and spends on whichever thing is holding the
   rest up.

   It is a model, not a playtest. It says what the numbers do; it does
   not say whether any of it is fun.
   ============================================================ */
'use strict';

function makePlayer(g,opt){
  opt=opt||{};
  const IDLE=!!opt.idle;
  const s=()=>g.game.s;
  const R=()=>g.game.R;

  /* Clicks per simulated second: brisk at the start, then the player
     settles back and mostly watches, which is how these games are played.

     idle means "puts it down after six minutes", not "never touches it".
     Nobody can start this game without stirring — there is no jam until
     somebody makes some — so a run with no clicks at all measures nothing. */
  function clickRate(t){
    if(IDLE)return t<360?3:0;
    return t<300?3:t<1200?1:0.25;
  }

  function margin(){ return Math.max(0.01,s().price-g.sugarCostPerJar()); }

  /* pick the price that earns most, given what we can actually make and move */
  function bestPrice(){
    const st=s(), keep=st.price;
    let best=keep,bestRev=-1;
    for(let p=1.20;p<=12.0001;p+=0.10){
      st.price=Math.round(p*100)/100;
      st.sugar=Math.round(g.sugarPeak());
      const moving=Math.min(g.autoPerSec()+2,g.demand());
      const rev=moving*(st.price-g.sugarCostPerJar());
      if(rev>bestRev){bestRev=rev;best=st.price}
    }
    st.price=best; st.sugar=Math.round(g.sugarPeak());
    return best;
  }

  function buyRecipes(){
    const bought=[];
    for(const r of R()){
      const st=s();
      if(st.recipes[r.id]||r.act!==st.act)continue;
      let open=false; try{open=r.when()}catch(e){}
      if(!open||!g.canAfford(r))continue;
      g.buyRecipe(r.id); bought.push(r.id);
    }
    return bought;
  }

  /* taste is the only currency with a real fork in it: rate or ceiling.
     Spend it on the one that is actually binding. */
  function spendTaste(){
    const st=s();
    let n=0;
    while(st.taste>0){
      if(st.insp>=g.inspMax()*0.9)st.cellars++; else st.ovens++;
      st.taste--; n++;
    }
    return n;
  }

  function actOneSpend(){
    const st=s();
    const reserve=st.cratePrice*4;
    const cash=st.cash-reserve;
    if(cash<=0)return null;
    const m=margin(), want=g.demand(), make=g.autoPerSec();
    const opts=[];
    const headroom=Math.max(0,want-make);
    opts.push({k:'spoon',c:g.spoonCost(st.spoons),v:Math.min(0.85*st.spoonPower,headroom||0.85*st.spoonPower)*m});
    if(st.recipes.geometry)
      opts.push({k:'works',c:g.worksCost(st.works),v:Math.min(120*st.worksPower,headroom||120*st.worksPower)*m});
    if(st.recipes.window){
      const before=g.demand(); st.mkt++; const after=g.demand(); st.mkt--;
      opts.push({k:'mkt',c:g.mktCost(),v:(after-before)*g.reachShare()*m});
    }
    if(st.autoSell){
      opts.push({k:'seller',c:g.sellerCost(),v:Math.min(0.055,1-g.reachShare())*want*m});
      if(st.sellers>=4)opts.push({k:'shop',c:g.shopCost(),v:Math.min(0.16,1-g.reachShare())*want*m});
    }
    opts.sort((a,b)=>(b.v/b.c)-(a.v/a.c));
    for(const o of opts){
      if(o.v<=0||o.c>cash)continue;
      if(o.k==='spoon'){st.cash-=o.c;st.spoons++}
      else if(o.k==='works'){st.cash-=o.c;st.works++}
      else if(o.k==='mkt'){st.cash-=o.c;st.mkt++}
      else if(o.k==='seller'){st.cash-=o.c;st.sellers++}
      else if(o.k==='shop'){st.cash-=o.c;st.shops++}
      return o.k;
    }
    return null;
  }

  function actTwoSpend(){
    const st=s();
    /* power first: a brownout costs more than anything it would have bought */
    if(g.powDraw()>g.powSupply()*0.75&&st.jars>=g.sunCost(st.sun)){ st.jars-=g.sunCost(st.sun);st.sun++;return 'sun' }
    if(st.sun>=2&&g.powStore()<g.powDraw()*70&&st.jars>=g.battCost(st.batt)){ st.jars-=g.battCost(st.batt);st.batt++;return 'batt' }
    if((st.spoilRate||0)>(st.orate||0)*0.2&&st.jars>=g.vatCost(st.vats||0)){ st.jars-=g.vatCost(st.vats||0);st.vats=(st.vats||0)+1;return 'vat' }
    /* then whichever stage is holding the other two up */
    const b=g.bottleneck();
    if(b==='nothing built'||b==='picking'){ if(st.jars>=g.pickerCost(st.pickers)){st.jars-=g.pickerCost(st.pickers);st.pickers++;return 'picker'} }
    else if(b==='setting'){ if(st.jars>=g.presserCost(st.pressers)){st.jars-=g.presserCost(st.pressers);st.pressers++;return 'presser'} }
    else if(st.jars>=g.lineCost(st.lines)){ st.jars-=g.lineCost(st.lines);st.lines++;return 'line' }
    /* with money to spare, a real player levels the lagging stages too,
       because the big recipes are gated on a balanced operation */
    const lag=[['pickers',g.pickerCost(st.pickers)],['pressers',g.presserCost(st.pressers)],
               ['lines',g.lineCost(st.lines)]].sort((x,y)=>st[x[0]]-st[y[0]])[0];
    if(st.jars>=lag[1]*6){ st.jars-=lag[1]; st[lag[0]]++; return lag[0] }
    return null;
  }

  function actThreeSpend(){
    const st=s();
    let n=0;
    while(st.jars>=g.sporeCost()*2){ const c=g.sporeCost(); st.jars-=c; st.spores++; st.launched++; n++; }
    return n?'spore':null;
  }

  /* one simulated step: the manual play, the tick, then the spending */
  function step(t,dt,o){
    o=o||{};
    const st=s();
    const ev={stirs:0,handSales:0,bought:null,recipes:[],taste:0};
    if(st.act===1){
      const cr=clickRate(t)*dt;
      for(let i=0;i<Math.floor(cr);i++){
        g.stir(); ev.stirs++;
        if(g.atTheDoor()>=1&&st.jars>=1){ g.sellByHand(); ev.handSales++; }
      }
      if(st.fruit<st.crate*0.35&&st.cash>=st.cratePrice)g.buyFruit();
      if(o.repriceNow)bestPrice();
    }
    g.tick(dt);
    if(o.style&&!st.style&&st.made>=800)st.style=o.style;
    if(o.spendNow){
      ev.taste=spendTaste();
      ev.recipes=buyRecipes();
      ev.bought=st.act===1?actOneSpend():st.act===2?actTwoSpend():actThreeSpend();
    }
    return ev;
  }

  return {clickRate,bestPrice,buyRecipes,spendTaste,actOneSpend,actTwoSpend,actThreeSpend,step};
}

module.exports={makePlayer};
