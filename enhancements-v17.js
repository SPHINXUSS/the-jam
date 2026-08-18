(function(){
'use strict';
if(window.__JAM_CULTURE_V17__)return;
window.__JAM_CULTURE_V17__=true;

/* Balance pass: culture is intentionally spammy and risky; tasting is a
   competitive side gamble, not a permanent inspiration drain. */
function readCultureV17(){
  if(s.act!==1)return;
  const vals=chipValues(performance.now()/1000);
  if(!vals.length){toast('Nothing conclusive.');return;}
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const mult=Number(s.chipMult)||1;
  let delta=Math.round(avg*160*mult);
  if(delta<0){
    const maxLoss=Math.max(8,Math.min(480,Math.floor(Math.max(1,s.insp)*0.12)));
    delta=Math.max(-maxLoss,delta);
  }else{
    delta=Math.min(720,delta);
  }
  const before=s.insp;
  s.insp=clamp(s.insp+delta,0,inspMax());
  const actual=Math.round(s.insp-before);
  if(actual>0)toast('+'+fmt(actual)+' inspiration');
  else if(actual<0)toast(fmt(actual)+' inspiration');
  else toast(localStorage.getItem('the-jam-language')==='fr'?'Rien de concluant.':'Nothing conclusive.');
  save();
}
const cultureBtn=document.getElementById('readCulture');
if(cultureBtn)cultureBtn.onclick=readCultureV17;

if(localStorage.getItem('the-jam-language')==='fr'){
  if(cultureBtn)cultureBtn.textContent='Observer la culture';
  const panel=document.getElementById('pCulture');
  if(panel)panel.querySelectorAll('.r-desc').forEach(p=>p.textContent='La culture ne tient jamais en place. Quand les barres sont hautes, observe-la : elle donne de l’inspiration. Quand elles sont basses, elle peut t’en reprendre.');
}

if(!window.__JAM_TASTING_V17__){
  window.__JAM_TASTING_V17__=true;
  const tastingBtn=document.getElementById('tRun');
  if(tastingBtn){
    tastingBtn.onclick=function(){
      if(!s.tour||!s.tour.on)return;
      const runs=s.tour.runs||0;
      const cost=Math.min(1200,800+runs*100);
      if(s.insp<cost){toast('Needs '+fmt(cost)+' inspiration.');return;}
      s.insp-=cost;
      const pay=[[Math.floor(Math.random()*7),Math.floor(Math.random()*7)],[Math.floor(Math.random()*7),Math.floor(Math.random()*7)]];
      const n=Math.max(2,Math.min(s.tour.unlocked||2,STRATS.length));
      const score=new Array(n).fill(0);
      for(let a=0;a<n;a++)for(let b=0;b<n;b++){
        if(a===b)continue;
        const ha=[],hb=[];
        for(let r=0;r<12;r++){
          const ma=STRATS[a].f(hb,r,pay);
          const trans=[[pay[0][0],pay[1][0]],[pay[0][1],pay[1][1]]];
          const mb=STRATS[b].f(ha,r,trans);
          score[a]+=pay[ma][mb];score[b]+=pay[mb][ma];ha.push(ma);hb.push(mb);
        }
      }
      const noisy=score.map((v,i)=>({i,v:v+(Math.random()*36-18)})).sort((a,b)=>b.v-a.v);
      s.tour.grid=pay;s.tour.rank=noisy;s.tour.runs++;
      const place=Math.max(0,noisy.findIndex(o=>o.i===s.tour.strat));
      const quality=Math.max(0,score[s.tour.strat]||0);
      const mult=[2.2,1.4,1.0,0.8,0.62][Math.min(4,place)];
      const gain=Math.max(240,Math.round(quality*5*mult));
      s.insp=clamp(s.insp+gain,0,inspMax());
      s.tour.won+=gain;
      if(place===0){s.crea+=2;note('Your palate took the panel. +'+fmt(gain)+' inspiration, +2 creativity.','hi')}
      else note('Panel '+s.tour.runs+': you placed '+(place+1)+'. +'+fmt(gain)+' inspiration.','dim');
      save();
      if(typeof drawTournament==='function')drawTournament();
    };
  }
}
})();
