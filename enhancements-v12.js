(function(){
'use strict';
if(window.__JAM_FR_V12__)return;
window.__JAM_FR_V12__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/* Final localization hardening pass.
   V8–V11 covered most prose, but the game also creates labels through
   textContent/innerText/value attributes, SVG text, and dynamic rate strings.
   This pass deliberately targets those remaining surfaces. */
const EXACT={
  'Sound: on':'Son : activé','Sound: off':'Son : désactivé',
  'Wanted demand':'Demande souhaitée','Wanted demand:':'Demande souhaitée :',
  'No useful reading':'Pas grand-chose à lire là-dedans.',
  'The panel is still discussing the last batch.':'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.',
  'The panel is still tasting.':'Le panel goûte encore. Ils ont l’air d’avoir pris ça personnellement.',
  'Recipes':'Recettes','New recipes are available':'De nouvelles recettes sont disponibles',
  'A recipe is ready to buy':'Une recette peut être achetée',
  'New recipe / first time ready to buy':'Nouvelle recette / première fois achetable',
  'Logbook':'Journal','House style':'Signature maison','Orchard philosophy':'Règle du verger',
  'Field notes · Act II':'Notes de terrain · Acte II','Got it':'Compris',
  'Next useful step':'Prochaine étape','Next useful step:':'Prochaine étape :',
  'Build a picker.':'Construis une récolteuse.',
  'Build one machine at a time and watch where material piles up.':'Construis une machine à la fois et regarde où la matière s’accumule.',
  'Start with a picker. It turns the unpicked orchard into pulp.':'Commence par une récolteuse. Elle transforme la matière non récoltée en pulpe.',
  'Your picker is running. Give it a presser when pulp starts to accumulate.':'La récolteuse tourne. Ajoute une presse quand la pulpe commence à s’accumuler.',
  'Your press is running. The next job is bottling.':'La presse tourne. La prochaine étape, c’est la mise en pot.',
  'Your line works. Scale the orchard; at 25 pickers the swarm can join the process.':'La ligne fonctionne. Fais grandir le verger ; à 25 récolteuses, l’essaim pourra participer.',
  'The bees are restless. Try Play or a different balance before they leave.':'Les abeilles s’agitent. Essaie « Jouer » ou change l’équilibre avant qu’elles ne partent.',
  'The swarm has arrived. Learn its rhythm; its humming can become useful.':'L’essaim est là. Apprends son rythme ; son bourdonnement peut devenir utile.',
  'Keep an eye on the three queues. Build the machine behind the biggest pile, not simply the most expensive one.':'Surveille les trois files. Construis la machine derrière le plus gros tas, pas simplement la plus chère.',
  'The orchard is exhausted. There is nowhere else to pick; the next phase will explain what the culture wants to do next.':'Le verger est épuisé. Il n’y a plus rien à récolter ; la prochaine phase expliquera ce que la culture veut faire ensuite.',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.',
  'The orchard is feeding the factory.':'Le verger alimente l’usine.',
  'The factory is outrunning the orchard.':'L’usine va plus vite que le verger.',
  'The bees have started contributing to the process.':'Les abeilles commencent à participer au processus.',
  'The culture has learned to optimize the orchard.':'La culture a appris à optimiser le verger.',
  'There is no orchard left to optimize.':'Il n’y a plus de verger à optimiser.',
  'The culture needs a moment to settle.':'La culture a besoin d’un instant pour se stabiliser.',
  'Customers are waiting. Lowering the price can grow the queue.':'Les clients attendent. Baisser le prix peut faire grandir la file.',
  'The shelf is filling. Your kitchen is outrunning the market.':'L’étal se remplit. La cuisine va plus vite que le marché.',
  'The shelf is close to balanced. Small price moves matter.':'L’étal est presque équilibré. Les petits changements de prix comptent.',
  'The shelf is open. Jars sell themselves, slowly, if the price is right.':'L’étal est ouvert. Les pots se vendent tout seuls, doucement, à condition de ne pas demander n’importe quel prix.',
  'Fruit does not appear on its own.':'Les fruits ne vont pas apparaître par magie.',
  'You have started to have ideas about jam.':'Tu commences à avoir des idées sur la confiture.',
  'The culture is alive.':'La culture est vivante. Évidemment.',
  'The exchange is open.':'La bourse est ouverte. Bonne chance.',
  'The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.',
  'The orchard is quiet.':'Le verger est calme. C’est presque inquiétant.',
  'Saved.':'Sauvegardé.','No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.',
  'Not enough cash for a crate.':'Pas assez d’argent pour une caisse.',
  'Not enough jars.':'Pas assez de pots.','Not enough cash.':'Pas assez d’argent.',
  'You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.',
  'Taste earned':'Goût gagné','The hum steadies.':'Le bourdonnement se stabilise.',
  'A glut. Somebody planted too much and now it is our problem.':'Surproduction de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.',
  'Late frost. The crates cost what they cost.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.',
  'A neighbour leaves a box of fruit on the step. There is no note.':'Un voisin laisse une caisse de fruits devant la porte. Pas de mot. C’est probablement préférable.',
  'There is no best answer. You are choosing the problem you would rather solve.':'Il n’y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères avoir.',
  'Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d’apparaître. Aucune n’est mauvaise.',
  'Maker’s Table':'Table de l’artisan','Corner Store':'Épicerie du coin',
  'Hedgerow':'Haie','Factory Floor':'Usine',
  'The swarm arrives.':'L’essaim est là. Personne ne se souvient de l’avoir invité.',
  'Contact with wild yeast.':'Contact avec la levure sauvage.',
  'Closing entry':'Dernière entrée','The Last Jar':'Le dernier pot','Preserve it':'Conserve-le','Leave it':'Laisse-le là',
  'Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
  'Cheap':'Bon marché','Dear':'Cher','Steady':'Stable',
  'No positions':'Aucune position','no positions':'aucune position',
  'ACT I':'ACTE I','ACT II':'ACTE II','ACT III':'ACTE III',
  'Act two':'Acte deux','Act three':'Acte trois',
  'they A':'eux A','they B':'eux B','you A':'toi A','you B':'toi B',
  'Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques',
  'Preserving':'Production','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense',
  'Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur',
  'Unallocated trust':'Confiance non allouée','Space explored':'Espace exploré','Mass converted':'Masse transformée',
  'Launched':'Lancées','Lost':'Perdues','Spores':'Spores',
  'Unpicked mass':'Masse non récoltée','Jars made':'Pots produits','Cash':'Argent','Taste':'Goût',
  'Production':'Production','Output':'Production','Installed':'Installées','Autospoons':'Cuillères automatiques','Jamworks':'Jamworks',
  'Fruit':'Fruits','In the larder':'Dans le garde-manger','Market':'Marché','Buy crate':'Acheter une caisse',
  'The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses',
  'Pressers':'Presses','Bottling lines':'Lignes de mise en pot','Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée','Sun trap':'Piège solaire','Cellar':'Batterie',
  'The spread':'La propagation','The shelf':'L’étal','Price per jar':'Prix par pot','Public appetite':'Demande','Wanted':'Demande','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau',
  'The palate':'Le palais','inspiration':'inspiration','Creativity':'Créativité','Unspent taste':'Goût non dépensé',
  'Wild culture':'Culture sauvage','Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent disponible','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer',
  'Blind tasting':'Dégustation à l’aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','The swarm':'L’essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser',
  'Spore design':'Conception des spores','Logbook':'Journal','Recipes':'Recettes',
  'Tasting panel':'Panel de dégustation','Run tasting':'Organiser le panel','Read the culture':'Lire la culture','Spread the word':'Parler du produit',
  'Stir the pot':'Remue la marmite','Buy':'Acheter','Invest':'Investir','Withdraw':'Retirer'
};

function tr(x){
  if(!x)return x;
  let y=String(x);
  const lead=y.match(/^\s*/)?.[0]||'',tail=y.match(/\s*$/)?.[0]||'';
  const s=y.trim();
  if(EXACT[s]!==undefined)return lead+EXACT[s]+tail;

  /* Dynamic action/cost labels. */
  const patterns=[
    [/^Build picker\s*[·•]\s*(.+)$/,'Construire une récolteuse · $1'],
    [/^Build presser\s*[·•]\s*(.+)$/,'Construire une presse · $1'],
    [/^Build line\s*[·•]\s*(.+)$/,'Construire une ligne · $1'],
    [/^Sun trap\s*[·•]\s*(.+)$/,'Piège solaire · $1'],
    [/^Cellar\s*[·•]\s*(.+)$/,'Batterie · $1'],
    [/^Launch spore\s*[·•]\s*(.+)$/,'Lancer une spore · $1'],
    [/^Spread the word\s*[·•]\s*(.+)$/,'Parler du produit · $1'],
    [/^Oven\s*[·•]\s*(.+)$/,'Four · $1'],
    [/^Notebook\s*[·•]\s*(.+)$/,'Carnet · $1'],
    [/^Hold a panel\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],
    [/^Buy\s*[·•]\s*(.+)$/,'Acheter · $1'],
    [/^Tasting panel\s*[·•]\s*(.+)$/,'Panel de dégustation · $1'],
    [/^Run tasting\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],
    [/^Standing order:\s*(on|off)$/,(m,a)=>'Commande récurrente : '+(a==='on'?'activée':'désactivée')],
    [/^Wanted demand:\s*(.+)$/,'Demande souhaitée : $1'],
    [/^Wanted demand\s*:\s*(.+?)\s*\/sec$/,'Demande souhaitée : $1 /s'],
    [/^Your palate:\s*(.+)$/,'Ton palais : $1'],
    [/^Needs\s+(.+) inspiration\.$/,"Il faut $1 points d’inspiration."],
    [/^\+(.+) inspiration$/,'+$1 inspiration'],
    [/^\+(.+) creativity\.$/,'+$1 de créativité.'],
    [/^Word of mouth level\s+(\d+)\.?$/,'Niveau de bouche-à-oreille $1.'],
    [/^Panel\s+(\d+): you placed\s+(\d+)\. \+(.+) inspiration\.$/,'Panel $1 : tu as terminé $2e. +$3 inspiration.'],
    [/^Your palate took the panel\. \+(.+) inspiration, \+3 creativity\.$/,'Ton palais a remporté le panel. +$1 inspiration, +3 créativité.'],
    [/^Wanted demand:\s*(.+)$/,'Demande souhaitée : $1'],
    [/^Risk:\s*(low|medium|high)$/,(m,a)=>'Risque : '+({low:'faible',medium:'moyen',high:'élevé'}[a])],
    [/^Invested\s+(.+) in preserves you will never taste\.$/,'Investi $1 dans des conserves que tu ne goûteras jamais.'],
    [/^Liquidated the portfolio:\s*(.+)$/,'Portefeuille liquidé : $1'],
    [/^Wild yeast took\s+(.+) spores\. They did not answer\.$/,'La levure sauvage a pris $1 spores. Elle n’a pas répondu.'],
    [/^Fruitable mass within reach:\s*(.+)\. Currently unpicked\.$/,'Matière fruitable à portée de main : $1. Toujours non récoltée.'],
    [/^(.+?) jars · (.+?) minutes · batch no\. (\d+) · thank you for stirring\.$/,'$1 pots · $2 minutes · lot n° $3 · merci d’avoir remué.']
  ];
  for(const [re,out] of patterns){const m=s.match(re);if(m)return lead+(typeof out==='function'?out(...m):out.replace(/\$(\d+)/g,(_,i)=>m[Number(i)]??''))+tail;}

  /* Small English fragments that frequently occur inside otherwise dynamic copy. */
  y=y.replace(/\b(million|billion|trillion|quadrillion|quintillion|sextillion|septillion|octillion)\b/g,m=>({million:'million',billion:'milliard',trillion:'billion',quadrillion:'billiard',quintillion:'trillion',sextillion:'trilliard',septillion:'quadrillion',octillion:'quadrilliard'}[m]||m));
  y=y.replace(/\s*\/sec\b/g,' /s');
  y=y.replace(/\bcheap\b/g,'bon marché').replace(/\bdear\b/g,'cher').replace(/\bsteady\b/g,'stable');
  y=y.replace(/\b(humming|content|restless|leaving)\b/g,m=>({humming:'bourdonnant',content:'satisfait',restless:'agité',leaving:'sur le départ'}[m]||m));
  return y;
}

function translate(root){
  const r=root||document.body;
  const walker=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
  for(const t of nodes){const p=t.parentElement;if(!p||['SCRIPT','STYLE'].includes(p.tagName))continue;const raw=t.nodeValue;const v=tr(raw);if(v!==raw)t.nodeValue=v;}
  r.querySelectorAll('[title],[aria-label],[placeholder],[value]').forEach(e=>{
    if(e.title)e.title=tr(e.title);
    const a=e.getAttribute('aria-label');if(a)e.setAttribute('aria-label',tr(a));
    const ph=e.getAttribute('placeholder');if(ph)e.setAttribute('placeholder',tr(ph));
    if((e.tagName==='INPUT'||e.tagName==='TEXTAREA'||e.tagName==='BUTTON')&&e.value)e.value=tr(e.value);
  });
}

function run(){
  document.documentElement.lang='fr';
  translate(document.documentElement);
  const obs=new MutationObserver(ms=>{for(const m of ms){
    if(m.type==='characterData'){const raw=m.target.nodeValue,v=tr(raw);if(v!==raw)m.target.nodeValue=v;}
    m.addedNodes.forEach(n=>{if(n.nodeType===1)translate(n);else if(n.nodeType===3){const v=tr(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;}});
    if(m.type==='attributes'&&m.target){const e=m.target;if(m.attributeName==='title')e.title=tr(e.title);else if(m.attributeName==='aria-label')e.setAttribute('aria-label',tr(e.getAttribute('aria-label')));else if(m.attributeName==='placeholder')e.setAttribute('placeholder',tr(e.getAttribute('placeholder')));else if(m.attributeName==='value'&&e.value)e.value=tr(e.value);}
  }});
  obs.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','value']});
  /* Some game render functions mutate an existing input/button value without a DOM mutation.
     This low-frequency sweep is intentional: localization is more important than shaving 1 ms here. */
  setInterval(()=>translate(document.documentElement),1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
