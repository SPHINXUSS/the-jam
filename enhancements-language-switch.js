(function(){
'use strict';
if(window.__JAM_LANGUAGE_SWITCH__)return;
window.__JAM_LANGUAGE_SWITCH__=true;

const KEY='the-jam-language';
let lang=localStorage.getItem(KEY)||(/^fr\b/i.test(navigator.language||'')?'fr':'en');

function install(){
  const right=document.querySelector('.bar-right');
  if(!right||document.getElementById('jamLangSwitch'))return;
  const b=document.createElement('button');
  b.id='jamLangSwitch';
  b.className='ghost';
  b.type='button';
  b.textContent=lang==='fr'?'EN':'FR';
  b.title=lang==='fr'?'Switch to English':'Passer en français';
  b.setAttribute('aria-label',b.title);
  b.addEventListener('click',()=>{
    try{save()}catch(e){}
    localStorage.setItem(KEY,lang==='fr'?'en':'fr');
    location.reload();
  });
  right.insertBefore(b,right.firstChild);
}

if(typeof boot==='function'){
  const baseBoot=boot;
  boot=function(){
    baseBoot();
    install();
  };
}else if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',install,{once:true});
}else{
  install();
}
})();
