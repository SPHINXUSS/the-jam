(function(){
'use strict';
if(window.__JAM_FR_V10__)return;
window.__JAM_FR_V10__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/* Runtime strings that cannot be covered by static phrase dictionaries because
   Claude's game assembles them from numbers/state at render time. */
const STRAT={
  'EVEN':'ÉQUILIBRÉ','ALWAYS A':'TOUJOURS A','ALWAYS B':'TOUJOURS B',
  'GREEDY':'AVIDE','GENEROUS':'GÉNÉREUX','MINIMAX':'MINIMAX',
  'TIT FOR TAT':'DONNANT-DONNANT','BEAT LAST':'CONTRE-ATTAQUE'
};
const MOOD={humming:'bourdonnant',content:'satisfait',restless:'agité',leaving:'sur le départ'};
const SCALE={million:'million',billion:'milliard',trillion:'billion',quadrillion:'billiard',quintillion:'trillion',sextillion:'trilliard',septillion:'quadrillion',octillion:'quadrilliard'};
const WORD={
  'No unallocated trust.':'Il n\'y a plus de confiance à allouer.',
  'Invested ':'Investi ',
  ' in preserves you will never taste.':' dans des conserves que tu ne goûteras jamais.',
  'Liquidated the portfolio: ':'Portefeuille liquidé : ',
  'Word of mouth level ':'Niveau de bouche-à-oreille ',
  'Needs ':'Il faut ',
  ' inspiration.':' d\'inspiration.',
  'Not enough on the desk to be worth it.':'Pas assez d\'argent disponible pour que cela vaille le coup.',
  'The jam is ':'La confiture est ',
  'trusted':'désormais jugée digne de confiance',
  ' a little more. One taste earned.':' un peu plus. Un point de goût gagné.',
  'A colony of wild yeast was talked out of existence.':'Une colonie de levure sauvage a été convaincue de disparaître. Voilà qui simplifie les choses.',
  'Wild yeast took ':'La levure sauvage a pris ',
  ' spores. They did not answer.':' spores. Elle n\'a pas répondu.',
  'The hum steadies.':'Le bourdonnement se stabilise.',
  'The hum of the swarm has been gone for some time.':'Le bourdonnement de l\'essaim a disparu depuis un moment.',
  'Not enough jars.':'Pas assez de pots.',
  'Not enough cash.':'Pas assez d\'argent.',
  'No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.',
  'Taste earned':'Goût gagné',
  'You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.'
};
function mapPhrase(x){
  let y=x;
  Object.keys(WORD).forEach(k=>{if(y===k)y=WORD[k];});
  return y;
}
function tr(x){
  if(!x)return x;
  let y=x;
  /* exact / fragment replacements */
  if(STRAT[y])return STRAT[y];
  if(MOOD[y])return MOOD[y];
  if(SCALE[y])return SCALE[y];
  if(WORD[y])return WORD[y];
  y=y.replace(/\b(million|billion|trillion|quadrillion|quintillion|sextillion|septillion|octillion)\b/g,(m)=>SCALE[m]||m);
  y=y.replace(/Your palate:\s*/,'Ton palais : ');
  y=y.replace(/Risk:\s*(low|medium|high)/,(_,m)=>'Risque : '+({low:'faible',medium:'moyen',high:'élevé'}[m]||m));
  y=y.replace(/\s*\/sec\b/g,' /s');
  y=y.replace(/(\d+(?:\.\d+)?)\s*inspiration\b/g,'$1 inspiration');
  y=y.replace(/(\d+(?:\.\d+)?)\s*creativity\b/g,'$1 créativité');
  y=y.replace(/\b(humming|content|restless|leaving)\b/g,m=>MOOD[m]||m);
  y=y.replace(/\b(EVEN|ALWAYS A|ALWAYS B|GREEDY|GENEROUS|MINIMAX|TIT FOR TAT|BEAT LAST)\b/g,m=>STRAT[m]||m);
  return y;
}
function walk(root){
  const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;while(n=w.nextNode())nodes.push(n);
  nodes.forEach(t=>{
    const p=t.parentElement;if(!p||['SCRIPT','STYLE'].includes(p.tagName))return;
    const raw=t.nodeValue;const trim=raw.trim();if(!trim)return;
    const v=tr(trim);if(v!==trim)t.nodeValue=raw.replace(trim,v);
  });
  (root||document.body).querySelectorAll('[title],[aria-label]').forEach(e=>{
    if(e.title)e.title=tr(e.title);
    if(e.getAttribute('aria-label'))e.setAttribute('aria-label',tr(e.getAttribute('aria-label')));
  });
}
function run(){
  walk(document.body);
  const o=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{
    if(n.nodeType===1)walk(n);
    else if(n.nodeType===3){const raw=n.nodeValue,trim=raw.trim();if(trim){const v=tr(trim);if(v!==trim)n.nodeValue=raw.replace(trim,v);}}
  })));
  o.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
