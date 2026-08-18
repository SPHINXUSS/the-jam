(function(){
  'use strict';
  if(window.__JAM_SAVE_V18__)return;
  window.__JAM_SAVE_V18__=true;

  /* Persistent save hardening.
     localStorage is preferred; sessionStorage is a persistent fallback for the
     current browser session. Saves are written on important lifecycle events,
     not only on the game's 10-second timer. */
  const SAVE_KEY=KEY;
  const local=()=>{try{localStorage.setItem('__jam_save_probe__','1');localStorage.removeItem('__jam_save_probe__');return true}catch(e){return false}};
  const session=()=>{try{sessionStorage.setItem('__jam_save_probe__','1');sessionStorage.removeItem('__jam_save_probe__');return true}catch(e){return false}};

  function hardSave(){
    try{
      s.last=Date.now();
      const payload=JSON.stringify(s);
      if(local()){
        localStorage.setItem(SAVE_KEY,payload);
        /* Mirror to session storage so a transient localStorage failure does not
           turn an otherwise successful run into a lost run. */
        if(session())sessionStorage.setItem(SAVE_KEY,payload);
        return true;
      }
      if(session()){
        sessionStorage.setItem(SAVE_KEY,payload);
        return true;
      }
    }catch(e){
      try{sessionStorage.setItem(SAVE_KEY,JSON.stringify(s));return true}catch(_e){}
    }
    return false;
  }

  function hardLoad(){
    try{
      let raw=null;
      try{raw=localStorage.getItem(SAVE_KEY)}catch(e){}
      if(!raw){try{raw=sessionStorage.getItem(SAVE_KEY)}catch(e){}}
      if(!raw)return false;
      const o=JSON.parse(raw);
      if(!o||o.v!==1)return false;
      s=Object.assign(fresh(),o);
      s.alloc=Object.assign(fresh().alloc,o.alloc||{});
      s.ex=Object.assign(fresh().ex,o.ex||{});
      s.tour=Object.assign(fresh().tour,o.tour||{});
      return true;
    }catch(e){return false}
  }

  /* Replace the game's persistence entry points. They remain same-scope and
     preserve the existing state schema. */
  save=hardSave;
  load=hardLoad;

  /* Persist immediately when the browser is about to discard the document. */
  window.addEventListener('pagehide',hardSave,{capture:true});
  window.addEventListener('beforeunload',hardSave,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')hardSave()});

  /* Also persist shortly after boot and then periodically, independent of the
     original timer. */
  setTimeout(hardSave,500);
  setInterval(hardSave,5000);
})();
