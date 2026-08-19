/* ============================================================
   A DOM small enough to load the game outside a browser.

   The point is that the balance simulator runs the real economy —
   engine.js and ui.js, unmodified — instead of a second copy of the
   maths that can drift away from the game. Nothing here draws
   anything; every node accepts every call and remembers nothing that
   matters.
   ============================================================ */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'../..');

function el(id){
  const node={
    id, textContent:'', innerHTML:'', value:'', disabled:false,
    dataset:{}, childNodes:[], children:[], firstChild:null, parentElement:null,
    tagName:'DIV', nodeValue:'', nodeType:1, offsetWidth:1, offsetHeight:1,
    style:{ setProperty(){}, removeProperty(){} },
    classList:(function(){ const set=new Set(['hidden']);
      return { add:(...c)=>c.forEach(x=>set.add(x)),
               remove:(...c)=>c.forEach(x=>set.delete(x)),
               toggle:(c,on)=>{ if(on===undefined)set.has(c)?set.delete(c):set.add(c); else on?set.add(c):set.delete(c); },
               contains:c=>set.has(c) }; })(),
    setAttribute(){}, getAttribute(){return null}, removeAttribute(){},
    appendChild(c){ this.childNodes.push(c); this.children.push(c); c.parentElement=this; return c },
    removeChild(c){ const i=this.childNodes.indexOf(c); if(i>=0){this.childNodes.splice(i,1);this.children.splice(i,1)} },
    remove(){ if(this.parentElement)this.parentElement.removeChild(this) },
    insertBefore(c){ return this.appendChild(c) },
    querySelector(){ return el('q') }, querySelectorAll(){ return [] },
    closest(){ return null },
    addEventListener(){}, removeEventListener(){}, focus(){}, blur(){}, click(){},
    getBoundingClientRect(){ return {left:0,top:0,right:1,bottom:1,width:1,height:1,x:0,y:0} }
  };
  node.parentElement=node.parentElement||{classList:node.classList};
  return node;
}

function makeWindow(){
  const nodes=new Map();
  const get=id=>{ if(!nodes.has(id))nodes.set(id,el(id)); return nodes.get(id); };
  const store={};
  const document={
    body:el('body'), documentElement:el('html'), head:el('head'),
    getElementById:get,
    querySelector:sel=>get(String(sel).replace(/^[#.]/,'')),
    querySelectorAll:()=>[],
    createElement:tag=>{const n=el('new');n.tagName=String(tag).toUpperCase();return n},
    createElementNS:(ns,tag)=>{const n=el('new');n.tagName=String(tag).toUpperCase();return n},
    createTreeWalker:()=>({nextNode:()=>null}),
    addEventListener(){}, removeEventListener(){}
  };
  const win={
    document, nodes,
    localStorage:{ getItem:k=>(k in store?store[k]:null), setItem:(k,v)=>{store[k]=String(v)},
                   removeItem:k=>{delete store[k]}, clear:()=>{for(const k in store)delete store[k]} },
    matchMedia:()=>({matches:false,addListener(){},addEventListener(){}}),
    requestAnimationFrame:()=>0, cancelAnimationFrame(){},
    setTimeout:()=>0, clearTimeout(){}, setInterval:()=>0, clearInterval(){},
    performance:{now:()=>Date.now()},
    navigator:{language:'en-US'},
    innerWidth:1280, innerHeight:900,
    addEventListener(){}, removeEventListener(){}, confirm:()=>false,
    NodeFilter:{SHOW_TEXT:4,SHOW_ELEMENT:1},
    AudioContext:undefined, webkitAudioContext:undefined,
    console
  };
  win.window=win; win.self=win; win.globalThis=win;
  return win;
}

/* load the four scripts in the order index.html loads them */
function loadGame(){
  const win=makeWindow();
  const ctx=vm.createContext(win);
  for(const f of ['i18n.js','feel.js','engine.js','ui.js']){
    vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f});
  }
  /* Top-level `let`/`const` land in the script's lexical scope, not on the
     global object, so the state and the recipe table are invisible from
     outside until something inside the context hands them over. `s` is
     reassigned by load(), so it has to be a live accessor. */
  vm.runInContext(`globalThis.game={
    get s(){return s}, set s(v){s=v},
    get R(){return R}, get LANG(){return LANG}, get DICT(){return DICT}
  };`,ctx,{filename:'bridge.js'});
  return ctx;
}
module.exports={loadGame};
