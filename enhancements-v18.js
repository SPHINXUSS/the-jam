(function(){
'use strict';
if(window.__JAM_SAVE_V18__)return;
window.__JAM_SAVE_V18__=true;

/* Durable synchronous save mirror. localStorage is still preferred by the
   original game, but this mirror survives page refreshes even when storage
   behavior is unreliable in the current browser/page setup. */
const SAVE_KEY=KEY;
const PREFIX='__THE_JAM_SAVE_V18__=';
const baseSave=save;
const baseLoad=load;

function cloneIntoState(o){
  if(!o||o.v!==1||!o.started)return false;
  const f=fresh();
  s=Object.assign(f,o);
  s.alloc=Object.assign(f.alloc,o.alloc||{});
  s.ex=Object.assign(f.ex,o.ex||{});
  s.tour=Object.assign(f.tour,o.tour||{});
  return true;
}

function mirrorWrite(){
  try{
    s.last=Date.now();
    window.name=PREFIX+JSON.stringify(s);
    return true;
  }catch(e){return false}
}

function mirrorRead(){
  try{
    const raw=String(window.name||'');
    if(!raw.startsWith(PREFIX))return false;
    return cloneIntoState(JSON.parse(raw.slice(PREFIX.length)));
  }catch(e){return false}
}

save=function(){
  try{baseSave()}catch(e){}
  mirrorWrite();
};

load=function(){
  /* Prefer the durable mirror because it is synchronous and survived the
     refresh that exposed the bug. */
  if(mirrorRead())return true;
  const ok=baseLoad();
  if(ok)mirrorWrite();
  return ok;
};

window.addEventListener('pagehide',mirrorWrite,{capture:true});
window.addEventListener('beforeunload',mirrorWrite,{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')mirrorWrite()});
setTimeout(mirrorWrite,500);
setInterval(()=>{if(typeof s!=='undefined'&&!s.ended)mirrorWrite()},5000);
})();
