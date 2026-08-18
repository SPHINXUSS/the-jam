(function(){
'use strict';
if(window.__JAM_FR_V11__)return;
window.__JAM_FR_V11__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/* Final runtime pass: dynamic controls are built from English prefixes + numbers,
   so exact dictionary entries are insufficient. */
function tr(x){
  if(!x)return x;
  let y=x;

  /* Dynamic purchase/action labels */
  y=y.replace(/^Build picker\s*·\s*(.+)$/,'Construire une récolteuse · $1');
  y=y.replace(/^Build presser\s*·\s*(.+)$/,'Construire une presse · $1');
  y=y.replace(/^Build line\s*·\s*(.+)$/,'Construire une ligne · $1');
  y=y.replace(/^Sun trap\s*·\s*(.+)$/,'Piège solaire · $1');
  y=y.replace(/^Cellar\s*·\s*(.+)$/,'Batterie · $1');
  y=y.replace(/^Launch spore\s*·\s*(.+)$/,'Lancer une spore · $1');
  y=y.replace(/^Spread the word\s*·\s*(.+)$/,'Parler du produit · $1');
  y=y.replace(/^Oven\s*·\s*(.+)$/,'Four · $1');
  y=y.replace(/^Notebook\s*·\s*(.+)$/,'Carnet · $1');
  y=y.replace(/^Buy\s*·\s*(.+)$/,'Acheter · $1');
  y=y.replace(/^Hold a panel\s*·\s*(.+)$/,'Organiser le panel · $1');
  y=y.replace(/^Standing order:\s*(on|off)$/,(m,s)=>'Commande récurrente : '+(s==='on'?'oui':'non'));
  y=y.replace(/^Risk:\s*(low|medium|high)$/,(m,s)=>'Risque : '+({low:'faible',medium:'moyen',high:'élevé'}[s]));

  /* Dynamic strategy selector */
  y=y.replace(/^Your palate:\s*EVEN$/,'Ton palais : ÉQUILIBRÉ');
  y=y.replace(/^Your palate:\s*ALWAYS A$/,'Ton palais : TOUJOURS A');
  y=y.replace(/^Your palate:\s*ALWAYS B$/,'Ton palais : TOUJOURS B');
  y=y.replace(/^Your palate:\s*GREEDY$/,'Ton palais : AVIDE');
  y=y.replace(/^Your palate:\s*GENEROUS$/,'Ton palais : GÉNÉREUX');
  y=y.replace(/^Your palate:\s*MINIMAX$/,'Ton palais : MINIMAX');
  y=y.replace(/^Your palate:\s*TIT FOR TAT$/,'Ton palais : DONNANT-DONNANT');
  y=y.replace(/^Your palate:\s*BEAT LAST$/,'Ton palais : CONTRE-ATTAQUE');

  /* Dynamic rates and resource readouts */
  y=y.replace(/\s*\/sec\b/g,' /s');
  y=y.replace(/\bcheap\b/g,'bon marché').replace(/\bdear\b/g,'cher').replace(/\bsteady\b/g,'stable');
  y=y.replace(/\b(humming|content|restless|leaving)\b/g,m=>({humming:'bourdonnant',content:'satisfait',restless:'agité',leaving:'sur le départ'}[m]||m));
  y=y.replace(/\b(million|billion|trillion|quadrillion|quintillion|sextillion|septillion|octillion)\b/g,m=>({million:'million',billion:'milliard',trillion:'billion',quadrillion:'billiard',quintillion:'trillion',sextillion:'trilliard',septillion:'quadrillion',octillion:'quadrilliard'}[m]||m));

  /* Common dynamic toasts / notes */
  y=y.replace(/^Needs\s+(.+) inspiration\.$/,'Il faut $1 d\'inspiration.');
  y=y.replace(/^Needs\s+(.+)\.php$/,'');
  y=y.replace(/^Not enough jars\.$/,'Pas assez de pots.');
  y=y.replace(/^Not enough cash\.$/,'Pas assez d\'argent.');
  y=y.replace(/^Not enough on the desk to be worth it\.$/,'Pas assez d\'argent disponible pour que cela vaille le coup.');
  y=y.replace(/^Invested\s+(.+) in preserves you will never taste\.$/,'Investi $1 dans des conserves que tu ne goûteras jamais.');
  y=y.replace(/^Liquidated the portfolio:\s*(.+)\.$/,'Portefeuille liquidé : $1.');
  y=y.replace(/^Word of mouth level\s*(\d+)\.$/,'Niveau de bouche-à-oreille $1.');
  y=y.replace(/^Panel\s+(\d+): you placed\s+(\d+)\. \+(.+) inspiration\.$/,'Panel $1 : tu as terminé $2e. +$3 d\'inspiration.');
  y=y.replace(/^A colony of wild yeast was talked out of existence\.$/,'Une colonie de levure sauvage a été convaincue de disparaître. Voilà qui simplifie les choses.');
  y=y.replace(/^Wild yeast took\s+(.+) spores\. They did not answer\.$/,'La levure sauvage a pris $1 spores. Elle n\'a pas répondu.');

  return y;
}

function walk(root){
  const r=root||document.body;
  const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;while(n=w.nextNode())nodes.push(n);
  nodes.forEach(t=>{
    const p=t.parentElement;
    if(!p||['SCRIPT','STYLE'].includes(p.tagName))return;
    const raw=t.nodeValue,trim=raw.trim();if(!trim)return;
    const v=tr(trim);if(v!==trim)t.nodeValue=raw.replace(trim,v);
  });
  r.querySelectorAll('[title],[aria-label]').forEach(e=>{
    if(e.title)e.title=tr(e.title);
    const a=e.getAttribute('aria-label');if(a)e.setAttribute('aria-label',tr(a));
  });
}
function run(){
  walk(document.body);
  const o=new MutationObserver(ms=>ms.forEach(m=>{
    if(m.type==='characterData'){
      const raw=m.target.nodeValue,trim=raw.trim();if(trim){const v=tr(trim);if(v!==trim)m.target.nodeValue=raw.replace(trim,v);}
    }
    m.addedNodes.forEach(n=>{
      if(n.nodeType===1)walk(n);
      else if(n.nodeType===3){const raw=n.nodeValue,trim=raw.trim();if(trim){const v=tr(trim);if(v!==trim)n.nodeValue=raw.replace(trim,v);}}
    });
  }));
  o.observe(document.body,{childList:true,subtree:true,characterData:true});

  /* Render updates can replace text without inserting the surrounding node.
     A light periodic sweep makes the localization robust to that pattern too. */
  setInterval(()=>walk(document.body),1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
