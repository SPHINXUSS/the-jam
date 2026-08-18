(function(){
'use strict';
if(window.__JAM_I18N_DYNAMIC__) return;
window.__JAM_I18N_DYNAMIC__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

const M={
  'Opening the kitchen…':'Ouverture de la cuisine…','Kitchen':'Cuisine','Orchard':'Verger','Spread':'Propagation',
  'Customers are waiting. Lowering the price can grow the queue.':'Les clients attendent. Baisser le prix peut faire grandir la file.','The shelf is filling. Your kitchen is outrunning the market.':'L’étal se remplit. Ta cuisine produit plus vite que le marché.','The shelf is close to balanced. Small price moves matter.':'L’étal est presque équilibré. De petits changements de prix comptent.',
  'Tasting panel · ':'Panel de dégustation · ','Run tasting · ':'Organiser le panel · ','Recipes':'Recettes','New recipes are available':'De nouvelles recettes sont disponibles','A recipe is ready to buy':'Une recette peut être achetée','New recipe / first time ready to buy':'Nouvelle recette / première fois achetable',
  'The orchard asks a different question: forgiving or fast?':'Le verger pose une autre question : indulgent ou rapide ?','House style':'Style de maison','Orchard philosophy':'Philosophie du verger','Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d’apparaître. Aucune n’est mauvaise.',
  'Next useful step:':'Prochaine étape utile :','Build a picker.':'Construis une récolteuse.','Pulp is piling up. Build a presser next.':'La pulpe s’accumule. Construis une presse ensuite.','Pressed fruit is waiting. Build a bottling line next.':'Les fruits pressés attendent. Construis une ligne d’embouteillage ensuite.','Your factory wants more power than the grid supplies. Add a Sun Trap or Cellar.':'Ton usine demande plus d’énergie que le réseau n’en fournit. Ajoute un piège solaire ou une batterie.',
  'A pot, a spoon, and three hundred berries.':'Une marmite, une cuillère et trois cents fruits.','Stir the pot.':'Remue la marmite.','The shelf is open. Jars sell themselves, slowly, if the price is right.':'L’étal est ouvert. Les pots se vendent seuls, lentement, si le prix est juste.','Fruit does not appear on its own.':'Les fruits ne tombent pas du ciel.','You have started to have ideas about jam.':'Tu commences à avoir des idées sur la confiture.','The culture is alive.':'La culture est vivante.','The exchange is open.':'La bourse est ouverte.','The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. Il n’y avait jamais rien de spécial dans la cuisine.','The orchard is quiet.':'Le verger est silencieux.',
  'A colony of wild yeast was talked out of existence.':'Une colonie de levure sauvage a été raisonnée jusqu’à disparaître.','Wild yeast took ':'La levure sauvage a pris ',' spores. They did not answer.':' spores. Elle n’a pas répondu.','The hum steadies.':'Le bourdonnement se stabilise.','You were away. The pot kept going.':'Tu étais absent. La marmite a continué.','Saved.':'Sauvegardé.','Needs ':'Il faut ',' inspiration.':' d’inspiration.','Not enough jars.':'Pas assez de pots.','Not enough cash.':'Pas assez d’argent.','No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.','Not enough cash for a crate.':'Pas assez d’argent pour une caisse.',
  'A glut. Somebody planted too much and now it is our problem.':'Une surproduction. Quelqu’un en a planté trop et c’est maintenant notre problème.','Late frost. The crates cost what they cost.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent.','A neighbour leaves a box of fruit on the step. There is no note.':'Un voisin dépose une caisse de fruits sur le pas de la porte. Aucun mot.',
  'The palette took the panel.':'Le palais a remporté le panel.','The panel is still tasting.':'Le panel est encore en train de déguster.','No useful reading':'Lecture sans résultat',
  'The orchard is feeding the factory.':'Le verger alimente l’usine.','The factory is outrunning the orchard.':'L’usine va plus vite que le verger.','The bees have started contributing to the process.':'Les abeilles ont commencé à participer au processus.','The culture has learned to optimize the orchard.':'La culture a appris à optimiser le verger.','There is no orchard left to optimize.':'Il n’y a plus de verger à optimiser.'
};
function tr(s){
  if(!s)return s;
  let x=s;
  Object.entries(M).forEach(([a,b])=>{x=x.split(a).join(b)});
  return x;
}
function translateNode(n){
  if(n.nodeType!==3)return;
  const raw=n.nodeValue;if(!raw.trim())return;
  const lead=raw.match(/^\s*/)[0],trail=raw.match(/\s*$/)[0],core=raw.trim(),out=tr(core);
  if(out!==core)n.nodeValue=lead+out+trail;
}
function scan(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(translateNode);
}

let busy=false;
const observer=new MutationObserver(records=>{
  if(busy)return;
  busy=true;observer.disconnect();
  records.forEach(r=>{
    r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n);else if(n.nodeType===3)translateNode(n)});
  });
  busy=false;observer.observe(document.body,{childList:true,subtree:true});
});

setTimeout(()=>{
  scan(document.body);
  observer.observe(document.body,{childList:true,subtree:true});
},0);
})();
