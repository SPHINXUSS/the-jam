(function(){
'use strict';
if(window.__JAM_CULTURE_V17__)return;
window.__JAM_CULTURE_V17__=true;

/* Culture should be a fast little gamble, not a cooldown button.
   Good timing pays inspiration; bad timing can cost some. */
function readCultureV17(){
  const t=performance.now()/1000;
  const vals=chipValues(t);
  const positive=vals.filter(v=>v>0);
  const n=Math.max(1,vals.length);
  const coherence=positive.length/n;
  const sum=vals.reduce((a,b)=>a+b,0);
  let delta=0;
  if(coherence>=0.42 && sum>0){
    delta=Math.min(150,Math.max(1,Math.round(sum*46*(0.55+coherence))));
  }else if(coherence<=0.28 && sum<0){
    delta=-Math.min(60,Math.max(1,Math.floor(Math.max(1,s.insp)*0.018)));
  }
  s.insp=clamp(s.insp+delta,0,inspMax());
  const fr=localStorage.getItem('the-jam-language')==='fr';
  if(delta>0)toast('+'+fmt(delta)+' inspiration');
  else if(delta<0)toast(fmt(delta)+' inspiration');
  else toast(fr?'Rien de concluant.':'Nothing conclusive.');
  save();
}

const btn=document.getElementById('readCulture');
if(btn)btn.onclick=readCultureV17;
})();
