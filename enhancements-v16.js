(function(){
'use strict';
if(window.__JAM_FR_V16__)return;
window.__JAM_FR_V16__=true;
if(localStorage.getItem('the-jam-language')!=='fr')return;

/* Canonical French recipe copy. French prose is written for the game,
   not translated word-for-word from English. */
const RECIPE_FR={
  grip:['Une meilleure prise','Tu tiens la cuillère comme on tient une cuillère quand on n’a encore rien appris. Chaque mouvement donne deux pots.'],
  window:['Une carte à la fenêtre','Écrite à la main, légèrement de travers, étonnamment efficace. Les gens savent maintenant que tu existes.'],
  mech:['Remuage mécanique','Il s’avère que le bras n’était pas la partie intéressante. Débloque les cuillères automatiques.'],
  grip2:['La deuxième cuillère','Une dans chaque main. Cinq pots par mouvement, et une douleur constante à l’épaule.'],
  imp1:['Cuillères automatiques améliorées','La production des cuillères automatiques augmente de 25 %.'],
  bruise:['Fruits meurtris','Les fruits abîmés ont toujours eu leurs qualités. Nous avons simplement arrêté de faire semblant du contraire. Les caisses donnent deux fois plus.'],
  limerick:['Un limerick sur les fruits','« Il était une fois un pot de Nantucket… » Nous allons nous arrêter là. Rapporte un point de goût.'],
  long:['La longue cuisson','Moins chaud, plus longtemps, plus de temps pour réfléchir. L’inspiration arrive 50 % plus vite.'],
  imp2:['Au-delà des cuillères automatiques','La production des cuillères automatiques augmente encore de 50 %.'],
  lexical:['Conservation lexicale','Le bon mot sur l’étiquette fait le travail de cent pots. Le bouche-à-oreille est 50 % plus efficace.'],
  standing:['Une commande récurrente','Les fruits arrivent sans qu’on les demande. Les caisses sont achetées automatiquement quand le garde-manger baisse.'],
  exchange:['La bourse des conserves','D’autres font aussi de la confiture. Leurs fortunes peuvent être modélisées, pour des raisons qui ne sont pas encore claires. Ouvre un bureau de marché.'],
  culture:['La culture sauvage','La culture ne tient jamais en place. Quand les barres sont hautes, lis-la : elle donne de l’inspiration. Quand elles sont basses, elle t’en reprend.'],
  imp3:['Cuillères optimales','La production des cuillères automatiques augmente encore de 75 %. Il n’y a plus rien à améliorer.'],
  tasting:['Panel de dégustation à l’aveugle','Huit palais, aucune étiquette, un gagnant. Essaie de les modéliser. Ça ne peut sûrement que bien se passer.'],
  photonic:['Fermentation photonique','De la lumière au lieu de la chaleur. Deux chambres de plus dans la culture, et chacune réagit davantage.'],
  pulp:['Récupération de la pulpe','Peau, noyau, tige. Rien ne sort de la pièce. Les caisses donnent encore deux fois plus.'],
  geometry:['Nouvelle géométrie de pot','Un pot qui s’empile contre lui-même sans laisser de vide. Débloque les jamworks : cinq cents pots par seconde chacun.'],
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
  harmonic:['Lecture harmonique','Les chambres sont mises en phase. La culture réagit trois fois plus fort.'],
  pantry:['Conscience totale du garde-manger','Un inventaire complet de chaque gramme de matière fruitable à portée de main. C’est plus grand que prévu. Rapporte un point de goût.'],
  donkey:['Espace de Donkey','Un modèle de ce que les autres pensent que tu veux qu’ils veuillent. C’est ici que ça commence à nous échapper. Rapporte un point de goût.'],
  release:['Libérer la culture','La culture est stable, autonome et n’a plus besoin d’un pot. Tout change.'],
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

/* Rewrite the remaining culture-related prose using the same vocabulary. */
const CULTURE_COPY={
  'Wild culture':'Culture sauvage',
  'Read the culture':'Observer la culture',
  'The culture is alive.':'La culture est vivante. Évidemment.',
  'The culture needs a moment to settle.':'La culture a besoin d’un instant pour se calmer.',
  'The culture does not stay in the jar. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.':'La culture ne reste pas dans son pot. Le matin, elle est dans la haie ; le soir, elle est dans le sol. Techniquement, elle fait toujours ce qu’on lui a demandé.',
  'The culture has learned to optimize the orchard.':'La culture a appris à optimiser le verger.',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.',
  'Release the Starter':'Libérer la culture'
};

function canon(){
  if(typeof R==='undefined'||!Array.isArray(R))return;
  for(const r of R){
    const pair=RECIPE_FR[r.id];
    if(pair){r.name=pair[0];r.desc=pair[1];}
  }
  const list=document.querySelectorAll('#recipeList .r-name,#recipeList .r-desc');
  for(const el of list){
    const card=el.closest('.recipe');if(!card)continue;
    const id=card.getAttribute('data-id');
    const pair=RECIPE_FR[id];if(!pair)continue;
    el.textContent=el.classList.contains('r-name')?pair[0]:pair[1];
  }
  const all=document.querySelectorAll('button,.kicker,.readout span,p,div');
  for(const el of all){
    const text=el.textContent?.trim();
    if(text&&CULTURE_COPY[text]!==undefined)el.textContent=CULTURE_COPY[text];
  }
}
if(typeof render==='function'&&!window.__JAM_FR_V16_RENDER_WRAPPED__){
  window.__JAM_FR_V16_RENDER_WRAPPED__=true;
  const baseRender=render;
  render=function(){const r=baseRender.apply(this,arguments);canon();return r};
}
setTimeout(canon,0);
setTimeout(canon,150);
setTimeout(canon,500);
})();
