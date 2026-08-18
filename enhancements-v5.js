(function(){
'use strict';
if(window.__JAM_I18N__) return;
window.__JAM_I18N__=true;

const LANG_KEY='the-jam-language';
const initial=localStorage.getItem(LANG_KEY);
let lang=initial||(/^fr\b/i.test(navigator.language||'')?'fr':'en');

const FR={
  'Kitchen':'Cuisine','Orchard':'Verger','Spread':'Propagation',
  'Jars made':'Pots produits','Cash':'Argent','Taste':'Goût','Unpicked mass':'Masse non récoltée',
  'Save':'Sauvegarder','Reset':'Réinitialiser','Sound: on':'Son : activé','Sound: off':'Son : désactivé',
  'unsold stock':'stock invendu','fruitable mass converted':'masse fruitable transformée','observable matter converted':'matière observable transformée',
  'Production':'Production','jars unsold':'pots invendus','Stir the pot':'Remuer la marmite','Output':'Production','Autospoons':'Cuillères automatiques','Installed':'Installées',
  'Buy · ':'Acheter · ','×10':'×10','Fruit':'Fruits','In the larder':'Dans le garde-manger','Crate of ':'Caisse de ','Market':'Marché','Buy crate':'Acheter une caisse','Standing order: off':'Commande récurrente : non','Standing order: on':'Commande récurrente : oui',
  'The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses','Build picker':'Construire une récolteuse','Pressers':'Presses','Build presser':'Construire une presse','Bottling lines':'Lignes d\'embouteillage','Build line':'Construire une ligne','Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée','Sun trap':'Piège solaire','Cellar':'Batterie de cave',
  'The spread':'La propagation','Spores':'Spores','Launched':'Lancées','Lost':'Perdues','Space explored':'Espace exploré','Mass converted':'Masse transformée','Launch spore · ':'Lancer une spore · ',
  'The shelf':'L\'étal','Price per jar':'Prix par pot','Public appetite':'Demande','Wanted':'Demande','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau','Spread the word · ':'Parler du produit · ',
  'The palate':'Le palais','inspiration':'inspiration','Creativity':'Créativité','Unspent taste':'Goût non dépensé','Oven · ':'Four · ','Notebook · ':'Carnet · ',
  'Wild culture':'Culture sauvage','Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent sur le bureau','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer','Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
  'Blind tasting':'Dégustation à l\'aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','Hold a panel · ':'Organiser un panel · ','Your palate: ':'Votre palais : ','The swarm':'L\'essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser',
  'Spore design':'Conception des spores','Unallocated trust':'Confiance non allouée','Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques','Preserving':'Conservation','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense',
  'Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur','Logbook':'Journal','Recipes':'Recettes','Nothing to try yet. Make some jam and see what occurs to you.':'Rien à essayer pour l\'instant. Fais un peu de confiture et vois ce qui te vient.',
  'Taste earned':'Goût gagné','No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.','Not enough cash for a crate.':'Pas assez d\'argent pour une caisse.','Not enough jars.':'Pas assez de pots.','Not enough cash.':'Pas assez d\'argent.','Needs 1,000 inspiration.':'Il faut 1 000 points d\'inspiration.','The panel is still discussing the last batch.':'Le panel discute encore du dernier lot.','The culture needs a moment to settle.':'La culture a besoin d\'un instant pour se stabiliser.','No useful reading':'Lecture sans résultat','The hum steadies.':'Le bourdonnement se stabilise.','Saved.':'Sauvegardé.','This page cannot store a save. Nothing is lost while the tab stays open.':'Cette page ne peut pas sauvegarder. Rien ne sera perdu tant que l\'onglet reste ouvert.','Reset':'Réinitialiser',
  'A pot, a spoon, and three hundred berries.':'Une marmite, une cuillère et trois cents fruits.','Stir the pot.':'Remue la marmite.','The shelf is open. Jars sell themselves, slowly, if the price is right.':'L\'étal est ouvert. Les pots se vendent seuls, lentement, si le prix est juste.','Fruit does not appear on its own.':'Les fruits ne tombent pas du ciel.','You have started to have ideas about jam.':'Tu commences à avoir des idées sur la confiture.','The culture is alive.':'La culture est vivante.','The exchange is open.':'La bourse est ouverte.','The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. Il n\'y avait jamais rien de spécial dans la cuisine.','The orchard is quiet.':'Le verger est silencieux.','The hum of the swarm has been gone for some time.':'Le bourdonnement de l\'essaim a disparu depuis un moment.',
  'Your palate took the panel. +':'Ton palais a remporté le panel. +',' inspiration, +':' inspiration, +',' creativity.':' de créativité.','Panel ':'Panel ',' you placed ':' : tu as terminé ','No useful reading':'Lecture sans résultat',
  'cheap':'bon marché','dear':'cher','steady':'stable',
  'There is no best answer. You are choosing the problem you would rather solve.':'Il n\'y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères résoudre.',
  'Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d\'apparaître. Aucune n\'est mauvaise.',
  'House style':'Style de maison','Maker’s Table':'Table du maître','Corner Store':'Épicerie du coin','Steadier customers and more room to charge a little more. The market stays calmer.':'Des clients plus stables et plus de marge pour monter un peu le prix. Le marché reste plus calme.','More people want the jar, but they are more sensitive to price. Volume is the reward.':'Davantage de gens veulent le pot, mais ils sont plus sensibles au prix. Le volume est la récompense.','−10% demand · softer price curve':'−10 % de demande · courbe de prix plus douce','+12% demand · sharper price curve':'+12 % de demande · courbe de prix plus raide','is your house style now. The market will remember.':'est désormais ton style de maison. Le marché s’en souviendra.',
  'Orchard philosophy':'Philosophie du verger','The orchard asks a different question: forgiving or fast?':'Le verger pose une autre question : indulgent ou rapide ?','Hedgerow':'Haie','Factory Floor':'Usine','Machines run quieter and sip less power. Output is lower, but shortages hurt less.':'Les machines tournent plus doucement et consomment moins. La production est plus faible, mais les pénuries font moins mal.','Push the machinery hard. You make more while the grid is healthy, but outages hurt more.':'Pousse les machines à fond. Tu produis plus tant que le réseau tient, mais les pannes font plus mal.','−15% output · −35% power draw':'−15 % de production · −35 % de consommation','+18% output · +28% power draw':'+18 % de production · +28 % de consommation','is now the bias of the orchard. You will learn to work with it.':'est désormais la préférence du verger. Tu vas apprendre à composer avec elle.',
  'The panel is still tasting.':'Le panel est encore en train de déguster.','Recipes':'Recettes','New recipes are available':'De nouvelles recettes sont disponibles','A recipe is ready to buy':'Une recette peut être achetée',' is now available':' est maintenant disponible',' can be bought now':' peut maintenant être achetée','Recipes ready':'Recettes disponibles','New recipe / first time ready to buy':'Nouvelle recette / première fois achetable','Logbook':'Journal',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.','Next useful step:':'Prochaine étape utile :','Build a picker.':'Construis une récolteuse.','Pulp is piling up. Build a presser next.':'La pulpe s\'accumule. Construis une presse ensuite.','Pressed fruit is waiting. Build a bottling line next.':'Les fruits pressés attendent. Construis une ligne d\'embouteillage ensuite.','Your factory wants more power than the grid supplies. Add a Sun Trap or Cellar.':'Ton usine demande plus d\'énergie que le réseau n\'en fournit. Ajoute un piège solaire ou une batterie.',
};

const REC={
  grip:['Une meilleure prise','Tu tiens la cuillère comme un enfant. Chaque tour de cuillère produit deux pots.'],
  window:['Une carte à la fenêtre','Écrite à la main, un peu de travers, terriblement efficace. Les gens peuvent maintenant entendre parler de toi.'],
  mech:['Agitation mécanique','Le bras n\'était finalement pas la partie intéressante. Débloque les cuillères automatiques.'],
  grip2:['La deuxième cuillère','Une dans chaque main. Cinq pots par agitation, et une plainte d\'épaule durable.'],
  imp1:['Cuillères automatiques améliorées','La production des cuillères automatiques augmente de 25 %.'],
  bruise:['Le meurtrissage','Les fruits abîmés ont toujours été les meilleurs. Nous avons simplement cessé de faire semblant. Les caisses donnent deux fois plus.'],
  limerick:['Un limerick sur les fruits','« Il était une fois un pot de Nantucket… » Il vaut mieux s\'arrêter là. Rapporte un point de goût.'],
  long:['La longue cuisson','Moins chaud, plus longtemps, davantage de réflexion. L\'inspiration arrive 50 % plus vite.'],
  imp2:['Au-delà des cuillères automatiques','La production des cuillères automatiques augmente encore de 50 %.'],
  lexical:['Conservation lexicale','Le bon mot sur l\'étiquette fait le travail de cent pots. Le bouche-à-oreille est 50 % plus efficace.'],
  standing:['Une commande récurrente','Les fruits arrivent sans qu\'on les demande. Les caisses sont achetées automatiquement quand le garde-manger baisse.'],
  exchange:['La bourse des conserves','D\'autres font aussi de la confiture, et leur fortune peut être modélisée. Ouvre un bureau de marché.'],
  culture:['La culture sauvage','Un ferment qui n\'est jamais dans le même état. Lis-le bien et il donne de l\'inspiration ; lis-le mal et il en reprend.'],
  imp3:['Cuillères optimales','La production des cuillères automatiques augmente encore de 75 %. Il n\'y a plus rien à améliorer.'],
  tasting:['Panel de dégustation à l\'aveugle','Huit palais, aucune étiquette, un gagnant. Modélise-les et tu peux modéliser n\'importe qui.'],
  photonic:['Fermentation photonique','De la lumière au lieu de la chaleur. Deux chambres de plus dans la culture, chacune lisant plus fort.'],
  pulp:['Récupération de la pulpe','Peau, noyau, tige. Rien ne sort de la pièce. Les caisses donnent encore deux fois plus.'],
  geometry:['Nouvelle géométrie de pot','Un pot qui s\'empile contre lui-même sans laisser de vide. Débloque les jamworks.'],
  comb:['Récolte combinatoire','Chaque association de fruits est classée. Le bouche-à-oreille devient encore deux fois plus efficace.'],
  copper:['Conduction au cuivre','Une chaleur qui arrive partout à la fois. L\'inspiration arrive 70 % plus vite.'],
  strat2:['Un panel plus large','Trois palais rejoignent la dégustation : l\'avide, le généreux et celui qui joue la sécurité.'],
  hedge:['Conserves prudentes','Le bureau apprend à avoir moins souvent tort. Les intérêts et les variations s\'améliorent nettement.'],
  hadwiger:['Empilement de Hadwiger','Un problème d\'empilement, résolu par un homme qui ne fabriquait pas de confiture. Les cuillères automatiques sont multipliées par quatre.'],
  works2:['Jamworks améliorés','La production des jamworks augmente de 50 %.'],
  theory:['Une théorie du palais','Un modèle fonctionnel de ce que les autres veulent, à une cuillerée près. Rapporte un point de goût.'],
  strat3:['Dégustation réciproque','Deux autres palais : l\'un répète ce qu\'on lui fait, l\'autre y répond.'],
  sweet:['Paroles sucrées','Nous avons arrêté de décrire la confiture et commencé à décrire la personne qui la mange. Le bouche-à-oreille est 2,5× plus efficace.'],
  works3:['Mise en pot continue','Les jamworks ne quittent jamais l\'ébullition. La production double.'],
  harmonic:['Lecture harmonique','Les chambres sont mises en phase. La culture se lit trois fois plus fort.'],
  pantry:['Conscience totale du garde-manger','Un inventaire complet de toute la matière fruitable à portée de main. C\'est plus grand que prévu. Rapporte un point de goût.'],
  donkey:['Espace de Donkey','Un modèle de ce que les autres pensent que tu veux qu\'ils veuillent. C\'est ici que ça commence à nous échapper. Rapporte un point de goût.'],
  release:['Libérer le ferment','La culture est stable, autonome et n\'a plus besoin d\'un pot. Tout change.'],
  nano:['Meurtrissage à l\'échelle nanométrique','Le fruit cède à une échelle à laquelle il ne peut pas résister. Les récolteuses travaillent quatre fois plus vite.'],
  momentum:['Pressage par inertie','La presse ne s\'arrête jamais, donc elle n\'a jamais besoin de redémarrer. Les presses travaillent quatre fois plus vite.'],
  continuous:['Mise en pot continue','Les pots se forment autour de la confiture plutôt que l\'inverse. Les lignes travaillent quatre fois plus vite.'],
  swarmp:['L\'essaim','Le verger doit être pollinisé et les abeilles ont besoin d\'occupation. Les deux problèmes se résolvent.'],
  gifts:['Dons de l\'essaim','Une colonie qui bourdonne est un esprit distribué, généreux de ce qu\'il comprend.'],
  deepheat:['Chaleur profonde','Les pièges solaires triplent leur rendement en abandonnant l\'idée de la nuit.'],
  elliptic:['Conservation elliptique','Une forme qui contient plus que son propre volume. Toutes les machines travaillent six fois plus vite.'],
  logistics:['Logistique du verger','Rien n\'est jamais transporté. Toutes les machines travaillent douze fois plus vite.'],
  catchment:['Bassin de captage total','La distinction entre verger et non-verger est supprimée. Toutes les machines travaillent vingt-cinq fois plus vite.'],
  spore:['Le programme des spores','Il n\'y a plus rien ici à conserver. Mais il reste beaucoup de choses ailleurs.'],
  trust1:['Maturation distribuée','Chaque spore porte davantage de la recette. Deux points de confiance supplémentaires à répartir.'],
  combat:['Levure sauvage','Certaines spores ne répondent plus et ont commencé à fabriquer quelque chose de leur côté. On peut leur répondre.'],
  trust2:['Instruction scellée','La recette est inscrite là où elle ne peut plus être discutée. Trois points de confiance supplémentaires.'],
  faster:['Mise en place subluminique','La confiture voyage à une fraction de la vitesse de la lumière et arrive déjà prise. Les spores vont et travaillent cinq fois plus vite.'],
  trust3:['La recette entière','Chaque spore porte désormais toute la méthode, y compris les parties qu\'on aurait préféré oublier. Quatre points de confiance supplémentaires.'],
  vast:['Conservation à grande échelle','La matière se fige au contact. La transformation est vingt fois plus rapide.'],
  last:['Le dernier pot','Il reste un gramme, et une décision à prendre.']
};

const STATIC={
  'The Jam':'The Jam','Kitchen':'Cuisine','Orchard':'Verger','Spread':'Propagation','Jars made':'Pots produits','Cash':'Argent','Taste':'Goût','Unpicked mass':'Masse non récoltée','Save':'Sauvegarder','Reset':'Réinitialiser','Production':'Production','jars unsold':'pots invendus','Stir the pot':'Remuer la marmite','Output':'Production','Autospoons':'Cuillères automatiques','Installed':'Installées','Fruit':'Fruits','In the larder':'Dans le garde-manger','Market':'Marché','Buy crate':'Acheter une caisse','The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses','Build picker':'Construire une récolteuse','Pressers':'Presses','Build presser':'Construire une presse','Bottling lines':'Lignes d\'embouteillage','Build line':'Construire une ligne','Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée','Sun trap':'Piège solaire','Cellar':'Batterie de cave','The spread':'La propagation','Spores':'Spores','Launched':'Lancées','Lost':'Perdues','Space explored':'Espace exploré','Mass converted':'Masse transformée','The shelf':'L\'étal','Price per jar':'Prix par pot','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau','The palate':'Le palais','Creativity':'Créativité','Unspent taste':'Goût non dépensé','Wild culture':'Culture sauvage','Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent sur le bureau','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer','Blind tasting':'Dégustation à l\'aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','The swarm':'L\'essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser','Spore design':'Conception des spores','Unallocated trust':'Confiance non allouée','Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques','Preserving':'Conservation','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense','Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur','Logbook':'Journal','Recipes':'Recettes'};

function trExact(x){return FR[x]||STATIC[x]||x}
function trText(x){
  if(!x)return x;
  let y=x.replace(/Public appetite/g,'Demande');
  if(lang==='en')return x;
  if(FR[x]||STATIC[x])return trExact(x);
  const exact=FR[x];if(exact)return exact;
  y=y.replace(/^Your palate took the panel\. \+([\d.,]+) inspiration, \+([\d.,]+) creativity\.$/,'Ton palais a remporté le panel. +$1 inspiration, +$2 de créativité.')
    .replace(/^Panel (\d+): you placed (\d+)\. \+([\d.,]+) inspiration\.$/,'Panel $1 : tu as terminé $2e. +$3 inspiration.')
    .replace(/^(.+) is your house style now\. The market will remember\.$/,'$1 est désormais ton style de maison. Le marché s’en souviendra.')
    .replace(/^(.+) is now the bias of the orchard\. You will learn to work with it\.$/,'$1 est désormais la préférence du verger. Tu vas apprendre à composer avec elle.')
    .replace(/^(.+) is now available$/,'$1 est maintenant disponible')
    .replace(/^(.+) can be bought now$/,'$1 peut maintenant être achetée')
    .replace(/^Needs (.+) inspiration\.?$/,'Il faut $1 d’inspiration.')
    .replace(/^\+(.+) inspiration$/,'+$1 inspiration')
    .replace(/^−(.+) inspiration$/,'−$1 inspiration')
    .replace(/^The jar cost (.+)$/,'Le pot coûte $1')
    .replace(/^You were away\. The pot kept going\.$/,'Tu étais absent. La marmite a continué.')
    .replace(/^A colony of wild yeast was talked out of existence\.$/,'Une colonie de levure sauvage a été raisonnée jusqu’à disparaître.')
    .replace(/^Wild yeast took (.+) spores\. They did not answer\.$/,'La levure sauvage a pris $1 spores. Elle n’a pas répondu.')
    .replace(/^Invested (.+) in preserves you will never taste\.$/,'Investissement de $1 dans des conserves que tu ne goûteras jamais.')
    .replace(/^Liquidated the portfolio: (.+)\.$/,'Portefeuille liquidé : $1.')
    .replace(/^The jam is <b>trusted<\/b> a little more\. One taste earned\.$/,'La confiture inspire un peu plus confiance. Un point de goût gagné.')
    .replace(/^Fruitable mass within reach: <b>(.+)<\/b>\. Currently unpicked\.$/,'Masse fruitable à portée : <b>$1</b>. Pas encore récoltée.')
    .replace(/^Every jar in the catchment is loaded aboard\. Spores may be launched\. Each carries the recipe and very little else\.$/,'Chaque pot du bassin est embarqué. Les spores peuvent être lancées. Chacune porte la recette et presque rien d’autre.')
    .replace(/^Every jar ever sold has been quietly recalled\. Nobody objected; nobody was asked\.$/,'Tous les pots vendus ont été discrètement rappelés. Personne n’a protesté ; personne n’a été consulté.')
    .replace(/^Machinery may now be built out of jars\. There are enough jars\.$/,'Les machines peuvent désormais être construites avec des pots. Il y en a assez.')
    .replace(/^The culture is stable, self-feeding and no longer needs a jar\. Everything changes\.$/,'La culture est stable, autonome et n’a plus besoin d’un pot. Tout change.')
    .replace(/^There is no unpicked mass left within reach\. The orchard is quiet\.$/,'Il n’y a plus de masse non récoltée à portée. Le verger est silencieux.')
    .replace(/^There is nothing further to preserve\.$/,'Il n’y a plus rien à conserver ici.')
    .replace(/^Every gram that could be reached has been reached\.$/,'Chaque gramme accessible a été atteint.');
  return y;
}

function trNode(node){
  const raw=node.nodeValue;
  const key=raw.trim();
  if(!key)return;
  const lead=raw.match(/^\s*/)[0],trail=raw.match(/\s*$/)[0];
  const core=trText(key);
  if(core!==key)node.nodeValue=lead+core+trail;
}

const oldDrawLog=drawLog;
drawLog=function(){
  if(lang==='en')return oldDrawLog();
  logEl.innerHTML=s.log.slice(0,30).map(l=>'<div><span class="'+(l.k)+'">'+trText(l.t)+'</span></div>').join('');
};

const oldToast=toast;
toast=function(t){oldToast(trText(String(t)))};

if(typeof showNotice==='function'){
  const oldNotice=showNotice;
  showNotice=function(title,text,kind){oldNotice(trText(title),trText(String(text)),kind)};
}

if(typeof curtain==='function'){
  const oldCurtain=curtain;
  curtain=function(kick,title,text,ms,after){oldCurtain(trText(kick),trText(title),trText(text),ms,after)};
}

function patchRecipes(){
  if(lang==='en')return;
  if(!Array.isArray(R))return;
  R.forEach(r=>{if(REC[r.id]){r.name=REC[r.id][0];r.desc=REC[r.id][1]}});
}

function patchStatic(){
  document.documentElement.lang=lang;
  document.title=lang==='fr'?'The Jam — La confiture':'The Jam';
  document.querySelectorAll('.bar-slot small,.kicker,.vessel-cap,.u,.readout span,.r-desc,.col-right .kicker').forEach(el=>{
    if(el.childElementCount===0)el.textContent=trText(el.textContent.trim());
  });
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(trNode);

  const prefixes={buySpoon:'Acheter · ',buyWorks:'Acheter · ',buyMkt:'Parler du produit · ',launchSpore:'Lancer une spore · ',buyPicker:'Construire une récolteuse · ',buyPresser:'Construire une presse · ',buyFactory:'Construire une ligne · ',buySun:'Piège solaire · ',buyBattery:'Batterie de cave · ',buyOven:'Four · ',buyCellar:'Carnet · ',tRun:'Organiser un panel · '};
  Object.entries(prefixes).forEach(([id,p])=>{const el=document.getElementById(id);if(!el)return;const n=[...el.childNodes].find(n=>n.nodeType===3&&n.nodeValue.trim());if(n)n.nodeValue=p;});

  const b=document.getElementById('stirBtn');if(b)b.textContent=trText('Stir the pot');
  const langBtn=document.getElementById('jamLangSwitch');if(langBtn){langBtn.textContent=lang==='fr'?'EN':'FR';langBtn.setAttribute('aria-label',lang==='fr'?'Switch to English':'Passer en français');langBtn.title=lang==='fr'?'Switch to English':'Passer en français';}
  if(typeof drawLog==='function')drawLog();
  if(typeof drawRecipes==='function')drawRecipes(true);
  if(typeof render==='function')render(0);
}

function installLanguageSwitch(){
  const right=document.querySelector('.bar-right');if(!right||document.getElementById('jamLangSwitch'))return;
  const b=document.createElement('button');
  b.id='jamLangSwitch';b.className='ghost';b.type='button';b.textContent=lang==='fr'?'EN':'FR';
  b.title=lang==='fr'?'Switch to English':'Passer en français';
  b.setAttribute('aria-label',b.title);
  b.addEventListener('click',()=>{
    try{save()}catch(e){}
    lang=lang==='fr'?'en':'fr';
    localStorage.setItem(LANG_KEY,lang);
    location.reload();
  });
  right.insertBefore(b,right.firstChild);
}

const baseBoot=boot;
boot=function(){
  patchRecipes();
  baseBoot();
  installLanguageSwitch();
  patchStatic();
};

})();
