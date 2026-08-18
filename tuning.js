/* Light-touch balance tuning for the existing game state. This runs inside Claude's original IIFE. */
if(!window.__JAM_TUNING__){
  window.__JAM_TUNING__=true;
  const rawTune=store.get(KEY);
  const earlyTune=(()=>{try{return rawTune?JSON.parse(rawTune):null}catch(e){return null}})();

  /* A believable artisan shelf price and a little starting awareness.
     We do not alter later saves unless they are still at the broken tutorial price. */
  if(!rawTune){
    s.price=3.2;
    s.mktEff=2.2;
  }else if(s.act===1 && s.made<1000 && s.price<1){
    s.price=3.2;
    s.mktEff=Math.max(s.mktEff||1,2.2);
  }
  s.price=Math.max(1.8,s.price||3.2);
  s.mktEff=Math.max(1,s.mktEff||1);

  /* Marketing becomes a useful early decision instead of a distant wall. */
  mktCost=function(){return 60*Math.pow(1.5,s.mkt-1)};
}
