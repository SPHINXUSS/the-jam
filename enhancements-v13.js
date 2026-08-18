(function(){
'use strict';
if(window.__JAM_FR_V13__)return;
window.__JAM_FR_V13__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/* V13 deliberately has NO MutationObserver.
   V12 froze the game by observing characterData and then modifying the same
   text node. V13 translates after the game's own render pass, throttled to
   at most once every 350ms. */
const EXACT={
  'Stir the pot':'Remue la marmite.','Stir the pot.':'Remue la marmite.',
  'Build picker':'Construire une récolteuse','Build presser':'Construire une presse','Build line':'Construire une ligne',
  'Sun trap':'Piège solaire','Cellar':'Batterie','Launch spore':'Lancer une spore','Spread the word':'Parler du produit',
  'Oven':'Four','Notebook':'Carnet','Buy':'Acheter','Buy crate':'Acheter une caisse',
  'Hold a panel':'Organiser le panel','Tasting panel':'Panel de dégustation','Run tasting':'Organiser le panel',
  'Standing order: on':'Commande récurrente : activée','Standing order: off':'Commande récurrente : désactivée',
  'Wanted demand':'Demande souhaitée','Wanted demand:':'Demande souhaitée :',
  'New recipes are available':'De nouvelles recettes sont disponibles','A recipe is ready to buy':'Une recette peut être achetée',
  'Logbook':'Journal','House style':'Signature maison','Orchard philosophy':'Règle du verger',
  'Field notes · Act II':'Notes de terrain · Acte II','Got it':'Compris','Next useful step':'Prochaine étape',
  'Customers are waiting. Lowering the price can grow the queue.':'Les clients attendent. Baisser le prix peut faire grandir la file.',
  'The shelf is filling. Your kitchen is outrunning the market.':'L’étal se remplit. La cuisine va plus vite que le marché.',
  'The shelf is close to balanced. Small price moves matter.':'L’étal est presque équilibré. Les petits changements de prix comptent.',
  'The orchard is feeding the factory.':'Le verger alimente l’usine.',
  'The factory is outrunning the orchard.':'L’usine va plus vite que le verger.',
  'The bees have started contributing to the process.':'Les abeilles commencent à participer au processus.',
  'The culture has learned to optimize the orchard.':'La culture a appris à optimiser le verger.',
  'There is no orchard left to optimize.':'Il n’y a plus de verger à optimiser.',
  'Your factory wants more power than the grid supplies. Add a Sun Trap or Cellar.':'Ton usine réclame plus d’énergie que le réseau n’en fournit. Il faut plus de jus.',
  'Build one machine at a time and watch where material piles up.':'Construis une machine à la fois et regarde où la matière s’accumule.',
  'Start with a picker. It turns the unpicked orchard into pulp.':'Commence par une récolteuse. Elle transforme la matière non récoltée en pulpe.',
  'Pulp is piling up. Build a presser next.':'La pulpe s’entasse. Construis une presse ensuite.',
  'Your picker is running. Give it a presser when pulp starts to accumulate.':'La récolteuse tourne. Ajoute une presse quand la pulpe commence à s’accumuler.',
  'Pressed fruit is waiting. Build a bottling line next.':'Les fruits pressés attendent. Construis une ligne de mise en pot ensuite.',
  'Your press is running. The next job is bottling.':'La presse tourne. La prochaine étape, c’est la mise en pot.',
  'Your line works. Scale the orchard; at 25 pickers the swarm can join the process.':'La ligne fonctionne. Fais grandir le verger ; à 25 récolteuses, l’essaim pourra participer.',
  'The bees are restless. Try Play or a different balance before they leave.':'Les abeilles s’agitent. Essaie « Jouer » ou change l’équilibre avant qu’elles ne partent.',
  'The swarm has arrived. Learn its rhythm; its humming can become useful.':'L’essaim est là. Apprends son rythme ; son bourdonnement peut devenir utile.',
  'Keep an eye on the three queues. Build the machine behind the biggest pile, not simply the most expensive one.':'Surveille les trois files. Construis la machine derrière le plus gros tas, pas simplement la plus chère.',
  'The orchard is exhausted. There is nowhere else to pick; the next phase will explain what the culture wants to do next.':'Le verger est épuisé. Il n’y a plus rien à récolter ; la prochaine phase expliquera ce que la culture veut faire ensuite.',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.',
  'The culture is alive.':'La culture est vivante. Évidemment.',
  'The exchange is open.':'La bourse est ouverte. Bonne chance.',
  'The orchard is quiet.':'Le verger est calme. C’est presque inquiétant.',
  'The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.',
  'A pot, a spoon, and three hundred berries.':'Une marmite, une cuillère et trois cents fruits. Ça devrait suffire.',
  'Fruit does not appear on its own.':'Les fruits ne vont pas apparaître par magie.',
  'You have started to have ideas about jam.':'Tu commences à avoir des idées sur la confiture.',
  'You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.',
  'Saved.':'Sauvegardé.','No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.',
  'Not enough cash for a crate.':'Pas assez d’argent pour une caisse.','Not enough jars.':'Pas assez de pots.','Not enough cash.':'Pas assez d’argent.',
  'Taste earned':'Goût gagné','No useful reading':'Pas grand-chose à lire là-dedans.','The hum steadies.':'Le bourdonnement se stabilise.',
  'The culture needs a moment to settle.':'La culture a besoin d’un instant pour se stabiliser.',
  'The panel is still discussing the last batch.':'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.',
  'The panel is still tasting.':'Le panel goûte encore. Ils ont l’air d’avoir pris ça personnellement.',
  'A glut. Somebody planted too much and now it is our problem.':'Surproduction de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.',
  'Late frost. The crates cost what they cost.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.',
  'A neighbour leaves a box of fruit on the step. There is no note.':'Un voisin laisse une caisse de fruits devant la porte. Pas de mot. C’est probablement préférable.',
  'There is no best answer. You are choosing the problem you would rather solve.':'Il n’y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères avoir.',
  'Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d’apparaître. Aucune n’est mauvaise.',
  'Maker’s Table':'Table de l’artisan','Corner Store':'Épicerie du coin','Hedgerow':'Haie','Factory Floor':'Usine',
  'The swarm arrives.':'L’essaim est là. Personne ne se souvient de l’avoir invité.',
  'Contact with wild yeast.':'Contact avec la levure sauvage.',
  'Closing entry':'Dernière entrée','The Last Jar':'Le dernier pot','Preserve it':'Conserve-le','Leave it':'Laisse-le là',
  'ACT I':'ACTE I','ACT II':'ACTE II','ACT III':'ACTE III','Act two':'Acte deux','Act three':'Acte trois',
  'Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
  'Cheap':'Bon marché','Dear':'Cher','Steady':'Stable','No positions':'Aucune position','no positions':'aucune position',
  'Jars made':'Pots produits','Cash':'Argent','Taste':'Goût','Unpicked mass':'Masse non récoltée','Production':'Production','Output':'Production',
  'Autospoons':'Cuillères automatiques','Installed':'Installées','Jamworks':'Jamworks','Fruit':'Fruits','In the larder':'Dans le garde-manger',
  'Market':'Marché','The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses',
  'Pressers':'Presses','Bottling lines':'Lignes de mise en pot','Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée',
  'The spread':'La propagation','Spores':'Spores','Launched':'Lancées','Lost':'Perdues','Space explored':'Espace exploré','Mass converted':'Masse transformée',
  'The shelf':'L’étal','Price per jar':'Prix par pot','Public appetite':'Demande','Wanted':'Demande','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau',
  'The palate':'Le palais','inspiration':'inspiration','Creativity':'Créativité','Unspent taste':'Goût non dépensé','Wild culture':'Culture sauvage',
  'Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent disponible','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer',
  'Blind tasting':'Dégustation à l’aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','The swarm':'L’essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser',
  'Spore design':'Conception des spores','Unallocated trust':'Confiance non allouée','Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques',
  'Preserving':'Production','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense','Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur','Logbook':'Journal','Recipes':'Recettes'
};
const STRATS={'EVEN':'ÉQUILIBRÉ','ALWAYS A':'TOUJOURS A','ALWAYS B':'TOUJOURS B','GREEDY':'AVIDE','GENEROUS':'GÉNÉREUX','MINIMAX':'MINIMAX','TIT FOR TAT':'DONNANT-DONNANT','BEAT LAST':'CONTRE-ATTAQUE'};
const MOOD={humming:'bourdonnant',content:'satisfait',restless:'agité',leaving:'sur le départ'};
function tr(x){
  if(!x)return x;
  let s=String(x).trim();
  if(EXACT[s]!==undefined)return EXACT[s];
  let m;
  const p=[
    [/^Build picker\s*[·•]\s*(.+)$/,'Construire une récolteuse · $1'],[/^Build presser\s*[·•]\s*(.+)$/,'Construire une presse · $1'],[/^Build line\s*[·•]\s*(.+)$/,'Construire une ligne · $1'],
    [/^Sun trap\s*[·•]\s*(.+)$/,'Piège solaire · $1'],[/^Cellar\s*[·•]\s*(.+)$/,'Batterie · $1'],[/^Launch spore\s*[·•]\s*(.+)$/,'Lancer une spore · $1'],[/^Spread the word\s*[·•]\s*(.+)$/,'Parler du produit · $1'],
    [/^Oven\s*[·•]\s*(.+)$/,'Four · $1'],[/^Notebook\s*[·•]\s*(.+)$/,'Carnet · $1'],[/^Buy\s*[·•]\s*(.+)$/,'Acheter · $1'],[/^Hold a panel\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],
    [/^Tasting panel\s*[·•]\s*(.+)$/,'Panel de dégustation · $1'],[/^Run tasting\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],[/^Standing order:\s*(on|off)$/,(a,b)=>'Commande récurrente : '+(b==='on'?'activée':'désactivée')],
    [/^Wanted demand:\s*(.+)$/,'Demande souhaitée : $1'],[/^Your palate:\s*(.+)$/,(a,b)=>'Ton palais : '+(STRATS[b]||b)],[/^Needs\s+(.+) inspiration\.$/,"Il faut $1 points d’inspiration."],
    [/^Word of mouth level\s+(\d+)\.?$/,'Niveau de bouche-à-oreille $1.'],[/^Panel\s+(\d+): you placed\s+(\d+)\. \+(.+) inspiration\.$/,'Panel $1 : tu as terminé $2e. +$3 inspiration.'],
    [/^Your palate took the panel\. \+(.+) inspiration, \+3 creativity\.$/,'Ton palais a remporté le panel. +$1 inspiration, +3 créativité.'],
    [/^Invested\s+(.+) in preserves you will never taste\.$/,'Investi $1 dans des conserves que tu ne goûteras jamais.'],[/^Liquidated the portfolio:\s*(.+)$/,'Portefeuille liquidé : $1'],
    [/^Wild yeast took\s+(.+) spores\. They did not answer\.$/,'La levure sauvage a pris $1 spores. Elle n’a pas répondu.'],[/^Fruitable mass within reach:\s*(.+)\. Currently unpicked\.$/,'Matière fruitable à portée de main : $1. Toujours non récoltée.'],
    [/^(.+?) jars · (.+?) minutes · batch no\. (\d+) · thank you for stirring\.$/,'$1 pots · $2 minutes · lot n° $3 · merci d’avoir remué.'],[/^\+(.+) creativity\.$/,'+$1 de créativité.'],
    [/^Risk:\s*(low|medium|high)$/,(a,b)=>'Risque : '+({low:'faible',medium:'moyen',high:'élevé'}[b])]
  ];
  for(const [re,out] of p){m=s.match(re);if(m)return typeof out==='function'?out(...m):out.replace(/\$(\d+)/g,(_,i)=>m[Number(i)]??'');}
  let y=s;
  y=y.replace(/\b(EVEN|ALWAYS A|ALWAYS B|GREEDY|GENEROUS|MINIMAX|TIT FOR TAT|BEAT LAST)\b/g,k=>STRATS[k]||k);
  y=y.replace(/\b(humming|content|restless|leaving)\b/g,k=>MOOD[k]||k);
  y=y.replace(/\s*\/sec\b/g,' /s');
  y=y.replace(/\b(million|billion|trillion|quadrillion|quintillion|sextillion|septillion|octillion)\b/g,k=>({million:'million',billion:'milliard',trillion:'billion',quadrillion:'billiard',quintillion:'trillion',sextillion:'trilliard',septillion:'quadrillion',octillion:'quadrilliard'}[k]||k));
  y=y.replace(/\bcheap\b/gi,'bon marché').replace(/\bdear\b/gi,'cher').replace(/\bsteady\b/gi,'stable');
  y=y.replace(/^Your palate:\s*/,'Ton palais : ');
  return y;
}

let lastSweep=0,pending=false;
function sweep(){
  const now=performance.now();
  if(now-lastSweep<350||pending)return;
  pending=true;requestAnimationFrame(()=>{
    pending=false;lastSweep=performance.now();
    const root=document.body;if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;
    while(n=walker.nextNode()){
      const p=n.parentElement;
      if(p&&p.tagName!=='SCRIPT'&&p.tagName!=='STYLE'&&p.tagName!=='NOSCRIPT')nodes.push(n);
    }
    for(const t of nodes){const raw=t.nodeValue,trim=raw.trim();if(!trim)continue;const v=tr(trim);if(v!==trim)t.nodeValue=raw.replace(trim,v)}
    root.querySelectorAll('[title],[aria-label],[placeholder],button,input[type="button"],input[type="submit"]').forEach(el=>{
      if(el.title)el.title=tr(el.title);
      const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',tr(a));
      const ph=el.getAttribute('placeholder');if(ph)el.setAttribute('placeholder',tr(ph));
      if('value' in el && el.value)el.value=tr(el.value);
    });
  });
}

/* One render hook = no DOM feedback loop. */
if(typeof render==='function'&&!window.__JAM_FR_RENDER_WRAPPED__){
  window.__JAM_FR_RENDER_WRAPPED__=true;
  const baseRender=render;
  render=function(){const r=baseRender.apply(this,arguments);sweep();return r};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sweep,{once:true});
else sweep();
setTimeout(sweep,150);setTimeout(sweep,600);setTimeout(sweep,1400);
})();