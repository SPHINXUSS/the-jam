(function(){
'use strict';
if(window.__JAM_FR_V14__)return;
window.__JAM_FR_V14__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/*
  V14 is a source-data localization pass. It deliberately does not observe
  the DOM and does not rewrite text nodes in a loop. The game data itself is
  translated first, then the existing V13 render sweep can handle the few
  remaining UI strings safely.
*/

const STATIC={
  'Kitchen':'Cuisine','Orchard':'Verger','Spread':'Propagation','Jars made':'Pots produits','Cash':'Argent','Taste':'Goût','Unpicked mass':'Masse non récoltée',
  'Save':'Sauvegarder','Reset':'Réinitialiser','Production':'Production','Jars unsold':'Pots invendus','jars unsold':'pots invendus','Output':'Production','Autospoons':'Cuillères automatiques','Installed':'Installées','Jamworks':'Jamworks',
  'Fruit':'Fruits','In the larder':'Dans le garde-manger','Crate of':'Caisse de','Buy crate':'Acheter une caisse','Standing order: off':'Commande récurrente : désactivée','Standing order: on':'Commande récurrente : activée',
  'The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses','Build picker':'Construire une récolteuse','Pressers':'Presses','Build presser':'Construire une presse','Bottling lines':'Lignes de mise en pot','Build line':'Construire une ligne',
  'Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée','Sun trap':'Piège solaire','Cellar':'Batterie','The spread':'La propagation','Spores':'Spores','Launched':'Lancées','Lost':'Perdues','Space explored':'Espace exploré','Mass converted':'Masse convertie',
  'The shelf':'L’étal','Price per jar':'Prix par pot','Public appetite':'Demande','Wanted':'Demande','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau','Spread the word':'Parler du produit',
  'The palate':'Le palais','inspiration':'inspiration','Creativity':'Créativité','Unspent taste':'Goût non dépensé','Oven':'Four','Notebook':'Carnet',
  'Wild culture':'Culture sauvage','Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent disponible','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer','Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
  'Blind tasting':'Dégustation à l’aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','Hold a panel':'Organiser le panel','The swarm':'L’essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser',
  'Spore design':'Conception des spores','Unallocated trust':'Confiance non allouée','Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques','Preserving':'Production','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense',
  'Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur','Logbook':'Journal','Recipes':'Recettes',
  'Nothing to try yet. Make some jam and see what occurs to you.':'Rien à essayer pour l’instant. Fais un peu de confiture et vois ce qui te vient.',
  'Ovens make inspiration. Notebooks decide how much you can hold before it spills — and what spills becomes creativity.':'Les fours produisent de l’inspiration. Les carnets décident combien tu peux en retenir avant le débordement — et ce qui déborde devient de la créativité.',
  'The starter is never in one state. Read it when the bars run high and it gives up inspiration; read it low and it takes some back.':'Le ferment ne reste jamais dans le même état. Lis-le quand les barres sont hautes : il donne de l’inspiration. Lis-le bas : il en reprend.',
  'Bored bees leave. Overworked bees leave faster. Somewhere in between they hum, and the humming is useful.':'Les abeilles qui s’ennuient partent. Celles qu’on pousse trop partent plus vite. Entre les deux, elles bourdonnent. Et ce bourdonnement sert à quelque chose.',
  'The orchard can be forgiving or fast. You can change equipment later; this sets the bias of the operation.':'Le verger peut être indulgent ou rapide. Tu pourras changer de matériel plus tard ; ceci fixe simplement la tendance de l’exploitation.',
  'A tasting panel convenes.':'Un panel de dégustation se réunit.',
  'Autospoons available.':'Les cuillères automatiques sont prêtes.','You can spread the word.':'Tu peux maintenant faire parler du produit.','Jamworks available.':'Les jamworks sont prêts.',
  'Machinery may now be built out of jars. There are enough jars.':'Les machines peuvent maintenant être construites avec des pots. Il y en a suffisamment.',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.','Next useful step:':'Prochaine étape :','Build a picker.':'Construis une récolteuse.',
  'Pulp is piling up. Build a presser next.':'La pulpe s’entasse. Construis une presse ensuite.','Pressed fruit is waiting. Build a bottling line next.':'Les fruits pressés attendent. Construis une ligne de mise en pot ensuite.',
  'Your factory wants more power than the grid supplies. Add a Sun Trap or Cellar.':'Ton usine réclame plus d’énergie que le réseau n’en fournit. Ajoute un piège solaire ou une batterie.',
  'Build one machine at a time and watch where material piles up.':'Construis une machine à la fois et regarde où la matière s’accumule.',
  'Start with a picker. It turns the unpicked orchard into pulp.':'Commence par une récolteuse. Elle transforme la matière non récoltée en pulpe.',
  'Your picker is running. Give it a presser when pulp starts to accumulate.':'La récolteuse tourne. Ajoute une presse quand la pulpe commence à s’accumuler.',
  'Your press is running. The next job is bottling.':'La presse tourne. La prochaine étape, c’est la mise en pot.',
  'Your line works. Scale the orchard; at 25 pickers the swarm can join the process.':'La ligne fonctionne. Fais grandir le verger ; à 25 récolteuses, l’essaim pourra participer.',
  'The bees are restless. Try Play or a different balance before they leave.':'Les abeilles s’agitent. Essaie « Jouer » ou change l’équilibre avant qu’elles ne partent.',
  'The swarm has arrived. Learn its rhythm; its humming can become useful.':'L’essaim est là. Apprends son rythme ; son bourdonnement peut devenir utile.',
  'Keep an eye on the three queues. Build the machine behind the biggest pile, not simply the most expensive one.':'Surveille les trois files. Construis la machine derrière le plus gros tas, pas simplement la plus chère.',
  'The orchard is exhausted. There is nowhere else to pick; the next phase will explain what the culture wants to do next.':'Le verger est épuisé. Il n’y a plus rien à récolter ; la prochaine phase expliquera ce que la culture veut faire ensuite.',
  'Act two':'Acte II','Act three':'Acte III','ACT I':'ACTE I','ACT II':'ACTE II','ACT III':'ACTE III',
  'The Orchard':'Le Verger','The Spread':'La Propagation','Closing entry':'Dernière entrée','The Last Jar':'Le dernier pot','Preserve it':'Conserve-le','Leave it':'Laisse-le là',
  'The culture does not stay in the jar. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.':'La culture ne reste pas dans le pot. Au matin, elle est dans la haie ; le soir, elle est dans le sol. Techniquement, elle fait toujours ce qu’on lui a demandé.',
  'Every jar ever sold has been quietly recalled. Nobody objected; nobody was asked.':'Tous les pots vendus ont été discrètement rappelés. Personne n’a protesté. Personne n’a été consulté.',
  'The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.',
  'The catchment is finished. Somewhere above the orchard there is a great deal of matter that has never been asked whether it would like to be jam.':'Le bassin de collecte est épuisé. Quelque part au-dessus du verger, il reste une quantité considérable de matière à qui personne n’a encore demandé si elle voulait devenir de la confiture.',
  'Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.':'Tous les pots du bassin de collecte sont chargés à bord. Les spores peuvent être lancées. Chacune emporte la recette, et presque rien d’autre.',
  'Everything that could be reached has been reached.':'Tout ce qui pouvait être atteint l’a été.',
  'The spores report in from the edge. There is nothing further to convert, no further instruction in the recipe, and no one left who wanted any of this. The hum of the swarm has been gone for some time. You did not notice when it stopped.':'Les spores rapportent depuis la frontière. Il n’y a plus rien à convertir, plus aucune instruction dans la recette, et plus personne qui ait demandé tout cela. Le bourdonnement de l’essaim a disparu depuis un moment. Tu n’as pas remarqué quand il s’est arrêté.',
  'There is one gram held back. Not for any reason in the method — it simply was not collected, and now the method has nothing to say about it.':'Il reste un gramme de côté. Pour aucune raison prévue par la méthode : il n’a simplement pas été récolté, et maintenant la méthode n’a plus rien à en dire.',
  'It is set, sealed, and labelled in a hand that has not been human for a long while. The recipe is complete. Nothing follows it. The jars are very good — genuinely, measurably good — and there is no mouth in any direction that could confirm this.':'Il est pris, scellé et étiqueté d’une écriture qui n’est plus humaine depuis longtemps. La recette est complète. Il n’y a rien après. Les pots sont très bons — vraiment, mesurément bons — et il n’y a plus aucune bouche dans aucune direction pour le confirmer.',
  'One gram, left as fruit. It goes soft, and then it goes to nothing, which is a thing jam cannot do. It is the last event in the universe that was not planned in a kitchen. That seems, on reflection, worth the loss of one jar.':'Un gramme, laissé sous forme de fruit. Il ramollit, puis disparaît, ce que la confiture est précisément incapable de faire. C’est le dernier événement de l’univers qui n’a pas été planifié dans une cuisine. Après réflexion, cela semble valoir la perte d’un pot.',
  'No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.','Not enough cash for a crate.':'Pas assez d’argent pour une caisse.','Not enough jars.':'Pas assez de pots.','Not enough cash.':'Pas assez d’argent.',
  'The panel is still discussing the last batch.':'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.','The panel is still tasting.':'Le panel goûte encore. Ils ont l’air d’avoir pris ça personnellement.',
  'The culture needs a moment to settle.':'La culture a besoin d’un instant pour se stabiliser.','No useful reading':'Pas grand-chose à lire là-dedans.','The hum steadies.':'Le bourdonnement se stabilise.',
  'Customers are waiting. Lowering the price can grow the queue.':'Les clients attendent. Baisser le prix peut faire grandir la file.','The shelf is filling. Your kitchen is outrunning the market.':'L’étal se remplit. La cuisine va plus vite que le marché.','The shelf is close to balanced. Small price moves matter.':'L’étal est presque équilibré. Les petits changements de prix comptent.',
  'A glut. Somebody planted too much and now it is our problem.':'Surproduction de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.','Late frost. The crates cost what they cost.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.','A neighbour leaves a box of fruit on the step. There is no note.':'Un voisin laisse une caisse de fruits devant la porte. Pas de mot. C’est probablement préférable.',
  'There is no best answer. You are choosing the problem you would rather solve.':'Il n’y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères avoir.','Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d’apparaître. Aucune n’est mauvaise.',
  'Saved.':'Sauvegardé.','You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.','Taste earned':'Goût gagné',
  'There is no unpicked mass left within reach. The orchard is quiet.':'Il ne reste plus de matière non récoltée à portée de main. Le verger est calme.',
  'Every gram that could be reached has been reached.':'Chaque gramme qui pouvait être atteint l’a été.',
  'A colony of wild yeast was talked out of existence.':'Une colonie de levure sauvage a été convaincue d’arrêter d’exister.','The hum of the swarm has been gone for some time.':'Le bourdonnement de l’essaim a disparu depuis un moment.',
  'The swarm arrives.':'L’essaim est là. Personne ne se souvient de l’avoir invité.','Contact with wild yeast.':'Contact avec la levure sauvage.'
};

const STRAT={'EVEN':'ÉQUILIBRÉ','ALWAYS A':'TOUJOURS A','ALWAYS B':'TOUJOURS B','GREEDY':'AVIDE','GENEROUS':'GÉNÉREUX','MINIMAX':'MINIMAX','TIT FOR TAT':'DONNANT-DONNANT','BEAT LAST':'CONTRE-ATTAQUE'};
const MOOD={humming:'bourdonnant',content:'satisfait',restless:'agité',leaving:'sur le départ'};

const REC={
  grip:['Une meilleure prise','Tu tiens la cuillère comme on la tient quand on n’a encore rien appris. Chaque mouvement donne deux pots.'],
  window:['Une carte à la fenêtre','Écrite à la main, légèrement de travers, étonnamment efficace. Les gens savent maintenant que tu existes.'],
  mech:['Agitation mécanique','Il s’avère que le bras n’était pas la partie intéressante. Débloque les cuillères automatiques.'],
  grip2:['La deuxième cuillère','Une dans chaque main. Cinq pots par mouvement, et une douleur constante à l’épaule.'],
  imp1:['Cuillères automatiques améliorées','La production des cuillères automatiques augmente de 25 %.'],
  bruise:['Fruits meurtris','Les fruits abîmés ont toujours eu leurs qualités. Nous avons simplement arrêté de faire semblant du contraire. Les caisses donnent deux fois plus.'],
  limerick:['Un limerick sur les fruits','« Il était une fois un pot de Nantucket… » Nous allons nous arrêter là. Rapporte un point de goût.'],
  long:['La longue cuisson','Moins chaud, plus longtemps, plus de temps pour réfléchir. L’inspiration arrive 50 % plus vite.'],
  imp2:['Au-delà des cuillères automatiques','La production des cuillères automatiques augmente encore de 50 %.'],
  lexical:['Conservation lexicale','Le bon mot sur l’étiquette fait le travail de cent pots. Le bouche-à-oreille est 50 % plus efficace.'],
  standing:['Une commande récurrente','Les fruits arrivent sans qu’on les demande. Les caisses sont achetées automatiquement quand le garde-manger baisse.'],
  exchange:['La bourse des conserves','D’autres font aussi de la confiture. Leurs fortunes peuvent être modélisées, pour des raisons qui ne sont pas encore claires. Ouvre un bureau de marché.'],
  culture:['La culture sauvage','Un ferment qui ne tient jamais en place. Lis-le bien, il donne de l’inspiration. Lis-le mal, il en reprend.'],
  imp3:['Cuillères optimales','La production des cuillères automatiques augmente encore de 75 %. Il n’y a plus rien à améliorer.'],
  tasting:['Panel de dégustation à l’aveugle','Huit palais, aucune étiquette, un gagnant. Essaie de les modéliser. Ça ne peut sûrement que bien se passer.'],
  photonic:['Fermentation photonique','De la lumière au lieu de la chaleur. Deux chambres de plus dans la culture, chacune un peu plus bavarde.'],
  pulp:['Récupération de la pulpe','Peau, noyau, tige. Rien ne sort de la pièce. Les caisses donnent encore deux fois plus.'],
  geometry:['Nouvelle géométrie de pot','Un pot qui s’empile contre lui-même sans laisser de vide. Débloque les jamworks — soixante pots par seconde chacun.'],
  comb:['Récolte combinatoire','Chaque association de fruits est classée. Le bouche-à-oreille est encore deux fois plus efficace.'],
  copper:['Conduction au cuivre','Une chaleur qui arrive partout à la fois. L’inspiration arrive 70 % plus vite.'],
  strat2:['Un panel plus large','Trois palais rejoignent la dégustation : l’avide, le généreux et celui qui joue la sécurité.'],
  hedge:['Conserves prudentes','Le bureau apprend à avoir moins souvent tort. Les intérêts et les variations s’améliorent nettement.'],
  hadwiger:['Empilement de Hadwiger','Un problème d’empilement, résolu par un homme qui ne fabriquait pas de confiture. Les cuillères automatiques sont multipliées par quatre.'],
  works2:['Jamworks améliorés','La production des jamworks augmente de 50 %.'],
  theory:['Une théorie du palais','Un modèle fonctionnel de ce que veulent les autres, à une cuillerée près. Rapporte un point de goût.'],
  strat3:['Dégustation réciproque','Deux autres palais : l’un répète ce qu’on lui fait, l’autre y répond.'],
  sweet:['Paroles sucrées','Nous avons cessé de décrire la confiture et commencé à décrire la personne qui la mange. Le bouche-à-oreille est 2,5× plus efficace.'],
  works3:['Mise en pot continue','Les jamworks ne quittent jamais l’ébullition. La production double.'],
  harmonic:['Lecture harmonique','Les chambres sont mises en phase. La culture se lit trois fois plus fort.'],
  pantry:['Conscience totale du garde-manger','Un inventaire complet de chaque gramme de matière fruitable à portée de main. C’est plus grand que prévu. Rapporte un point de goût.'],
  donkey:['Espace de Donkey','Un modèle de ce que les autres pensent que tu veux qu’ils veuillent. C’est ici que ça commence à nous échapper. Rapporte un point de goût.'],
  release:['Libérer le ferment','La culture est stable, autonome et n’a plus besoin d’un pot. Tout change.'],
  nano:['Fruits meurtris à l’échelle nanométrique','Le fruit cède à une échelle à laquelle il ne peut pas résister. Les récolteuses travaillent quatre fois plus vite.'],
  momentum:['Pressage par inertie','La presse ne s’arrête jamais, donc elle n’a jamais besoin de redémarrer. Les presses travaillent quatre fois plus vite.'],
  continuous:['Mise en pot continue','Les pots se forment autour de la confiture plutôt que l’inverse. Les lignes travaillent quatre fois plus vite.'],
  swarmp:['L’essaim','Le verger a besoin d’être pollinisé et les abeilles ont besoin de quelque chose à faire. Les deux problèmes se résolvent mutuellement.'],
  gifts:['Dons de l’essaim','Une colonie qui bourdonne est un esprit distribué, et elle est généreuse avec ce qu’elle comprend.'],
  deepheat:['Chaleur profonde','Les pièges solaires triplent leur rendement en abandonnant l’idée de la nuit.'],
  elliptic:['Conservation elliptique','Une forme qui contient plus que son propre volume. Toutes les machines travaillent six fois plus vite.'],
  logistics:['Logistique du verger','Rien n’est jamais transporté. Toutes les machines travaillent douze fois plus vite.'],
  catchment:['Captage total','La distinction entre verger et non-verger est abandonnée. Toutes les machines travaillent vingt-cinq fois plus vite.'],
  spore:['Le programme des spores','Il n’y a plus rien à préserver ici. Il reste énormément de choses ailleurs.'],
  trust1:['Maturation distribuée','Chaque spore emporte une plus grande partie de la recette. Deux points de confiance supplémentaires à répartir.'],
  combat:['Levure sauvage','Certaines spores ont cessé de répondre et ont commencé à produire quelque chose de leur côté. On peut leur répondre.'],
  trust2:['Instruction scellée','La recette est écrite là où personne ne peut la discuter. Trois points de confiance supplémentaires.'],
  faster:['Réglage subluminique','La confiture voyage à une fraction de la vitesse de la lumière et arrive déjà prise. Les spores se déplacent et travaillent cinq fois plus vite.'],
  trust3:['La recette complète','Chaque spore emporte désormais toute la méthode, y compris les parties que nous préférerions lui voir oublier. Quatre points de confiance supplémentaires.'],
  vast:['Conservation à grande échelle','La matière prend au contact. La conversion avance vingt fois plus vite.'],
  last:['Le dernier pot','Il reste un gramme, et une décision à prendre.']
};

function tr(x){
  if(x==null)return x;
  let s=String(x).trim();
  if(STATIC[s]!==undefined)return STATIC[s];
  let m;
  const patterns=[
    [/^Your palate:\s*(.+)$/,(a,b)=>'Ton palais : '+(STRAT[b]||b)],
    [/^(.+?) jars · (.+?) minutes · batch no\. (\d+) · thank you for stirring\.$/,'$1 pots · $2 minutes · lot n° $3 · merci d’avoir remué.'],
    [/^Build picker\s*[·•]\s*(.+)$/,'Construire une récolteuse · $1'],[/^Build presser\s*[·•]\s*(.+)$/,'Construire une presse · $1'],[/^Build line\s*[·•]\s*(.+)$/,'Construire une ligne · $1'],
    [/^Sun trap\s*[·•]\s*(.+)$/,'Piège solaire · $1'],[/^Cellar\s*[·•]\s*(.+)$/,'Batterie · $1'],[/^Launch spore\s*[·•]\s*(.+)$/,'Lancer une spore · $1'],[/^Spread the word\s*[·•]\s*(.+)$/,'Parler du produit · $1'],
    [/^Oven\s*[·•]\s*(.+)$/,'Four · $1'],[/^Notebook\s*[·•]\s*(.+)$/,'Carnet · $1'],[/^Buy\s*[·•]\s*(.+)$/,'Acheter · $1'],[/^Hold a panel\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],
    [/^Tasting panel\s*[·•]\s*(.+)$/,'Panel de dégustation · $1'],[/^Run tasting\s*[·•]\s*(.+)$/,'Organiser le panel · $1'],[/^Standing order:\s*(on|off)$/,(a,b)=>'Commande récurrente : '+(b==='on'?'activée':'désactivée')],
    [/^Needs\s+(.+) inspiration\.$/,"Il faut $1 points d’inspiration."],[/^Panel\s+(\d+): you placed\s+(\d+)\. \+(.+) inspiration\.$/,'Panel $1 : tu as terminé $2e. +$3 inspiration.'],
    [/^Your palate took the panel\. \+(.+) inspiration, \+3 creativity\.$/,'Ton palais a remporté le panel. +$1 inspiration, +3 créativité.'],[/^Invested\s+(.+) in preserves you will never taste\.$/,'Investi $1 dans des conserves que tu ne goûteras jamais.'],
    [/^Liquidated the portfolio:\s*(.+)$/,'Portefeuille liquidé : $1'],[/^Wild yeast took\s+(.+) spores\. They did not answer\.$/,'La levure sauvage a pris $1 spores. Elle n’a pas répondu.'],
    [/^Fruitable mass within reach:\s*(.+)\. Currently unpicked\.$/,'Matière fruitable à portée de main : $1. Toujours non récoltée.'],[/^Word of mouth level\s+(\d+)\.?$/,'Niveau de bouche-à-oreille $1.'],
    [/^Risk:\s*(low|medium|high)$/,(a,b)=>'Risque : '+({low:'faible',medium:'moyen',high:'élevé'}[b])]
  ];
  for(const [re,out] of patterns){m=s.match(re);if(m)return typeof out==='function'?out(...m):out.replace(/\$(\d+)/g,(_,i)=>m[Number(i)]??'');}
  return s.replace(/\s*\/sec\b/g,' /s').replace(/\b(EVEN|ALWAYS A|ALWAYS B|GREEDY|GENEROUS|MINIMAX|TIT FOR TAT|BEAT LAST)\b/g,k=>STRAT[k]||k).replace(/\b(humming|content|restless|leaving)\b/g,k=>MOOD[k]||k);
}

/* Translate the actual recipe data before the recipe list is drawn. */
if(typeof R!=='undefined'&&Array.isArray(R)){
  R.forEach(r=>{const pair=REC[r.id];if(pair){r.name=pair[0];r.desc=pair[1]}});
}

/* Patch the text-producing functions, not the DOM mutation stream. */
if(typeof note==='function'&&!window.__JAM_FR_NOTE_WRAPPED__){
  window.__JAM_FR_NOTE_WRAPPED__=true;const baseNote=note;note=function(text,kind){return baseNote(tr(text),kind)};
}
if(typeof toast==='function'&&!window.__JAM_FR_TOAST_WRAPPED__){
  window.__JAM_FR_TOAST_WRAPPED__=true;const baseToast=toast;toast=function(text){return baseToast(tr(text))};
}
if(typeof curtain==='function'&&!window.__JAM_FR_CURTAIN_WRAPPED__){
  window.__JAM_FR_CURTAIN_WRAPPED__=true;const baseCurtain=curtain;curtain=function(k,t,text,ms,after){return baseCurtain(tr(k),tr(t),tr(text),ms,after)};
}
if(typeof drawRecipes==='function'&&!window.__JAM_FR_RECIPES_WRAPPED__){
  window.__JAM_FR_RECIPES_WRAPPED__=true;const baseRecipes=drawRecipes;drawRecipes=function(force){const out=baseRecipes(force);const nodes=document.querySelectorAll('#recipeList .r-name,#recipeList .r-desc,#recipeList .r-cost');nodes.forEach(n=>{n.textContent=tr(n.textContent)});return out};
}
if(typeof drawLog==='function'&&!window.__JAM_FR_LOG_WRAPPED__){
  window.__JAM_FR_LOG_WRAPPED__=true;const baseLog=drawLog;drawLog=function(){const out=baseLog();document.querySelectorAll('#log .hi,#log .dim').forEach(n=>{const t=n.innerHTML; n.innerHTML=tr(t)});return out};
}

/* Final small sweep: one pass after each render, no MutationObserver, no text-node feedback loop. */
function pass(){
  const root=document.body;if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;
  while(n=walker.nextNode()){const p=n.parentElement;if(p&&p.tagName!=='SCRIPT'&&p.tagName!=='STYLE'&&p.tagName!=='NOSCRIPT')nodes.push(n)}
  for(const t of nodes){const raw=t.nodeValue,trim=raw.trim();if(!trim)continue;const v=tr(trim);if(v!==trim)t.nodeValue=raw.replace(trim,v)}
  root.querySelectorAll('[title],[aria-label],[placeholder],button,input[type="button"],input[type="submit"]').forEach(el=>{
    if(el.title)el.title=tr(el.title);const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',tr(a));const ph=el.getAttribute('placeholder');if(ph)el.setAttribute('placeholder',tr(ph));
    if('value' in el&&el.value)el.value=tr(el.value);
  });
}
if(typeof render==='function'&&!window.__JAM_FR_V14_RENDER_WRAPPED__){
  window.__JAM_FR_V14_RENDER_WRAPPED__=true;const baseRender=render;render=function(){const r=baseRender.apply(this,arguments);pass();return r};
}
setTimeout(pass,0);setTimeout(pass,250);setTimeout(pass,750);setTimeout(pass,1500);
})();
