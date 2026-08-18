(function(){
'use strict';
if(window.__JAM_I18N_V7__) return;
window.__JAM_I18N_V7__=true;
if((localStorage.getItem('the-jam-language')||'en')!=='fr')return;

/* Native-French polish. These are replacements for phrases that were grammatically
   possible but sounded translated. The tone stays dry, understated and slightly
   strange; never try to be funny harder than the English. */
const F={
  'Agitation mécanique':'Cuillère mécanique',
  'Une dans chaque main. Cinq pots par agitation, et une plainte d’épaule durable.':'Une dans chaque main. Cinq pots par mouvement, et une douleur constante à l’épaule.',
  'Une dans chaque main. Cinq pots par agitation, et une plainte d\'épaule durable.':'Une dans chaque main. Cinq pots par mouvement, et une douleur constante à l’épaule.',
  'Le coup de cuillère':'Les fruits meurtris',
  'Conservation elliptique':'Confiture elliptique',
  'Conduction de cuivre':'Conduction du cuivre',
  'Style maison':'Signature maison',
  'Style de maison':'Signature maison',
  'Table du maître':'Table de l’artisan',
  'Épicerie du coin':'Épicerie du quartier',
  'Philosophie du verger':'Règle du verger',
  'Le verger pose une autre question : indulgent ou rapide ?':'Le verger pose une autre question : tranquille ou rapide ?',
  'Des clients plus stables, et un peu plus de marge pour monter les prix. Le marché reste calme.':'Des clients plus stables, et un peu plus de marge pour monter les prix. Le marché reste calme.',
  'Davantage de gens veulent le pot, mais ils regardent davantage le prix. Le volume est la récompense.':'Davantage de gens veulent le pot, mais ils regardent davantage le prix. Le volume est la récompense.',
  'est désormais ton style maison. Le marché s’en souviendra.':'est désormais ta signature. Le marché s’en souviendra.',
  'est désormais la préférence du verger. Il faudra apprendre à faire avec.':'est désormais la règle du verger. Il faudra apprendre à faire avec.',
  'Il n’y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères avoir.':'Il n’y a pas de bonne réponse. Tu choisis juste le problème que tu préfères avoir.',
  'Deux façons de grandir viennent d’apparaître. Aucune n’est la mauvaise. Enfin, pas officiellement.':'Deux façons de grandir viennent d’apparaître. Aucune n’est mauvaise. Elles ont simplement des ennuis différents.',
  'La culture a besoin d’une petite seconde pour se remettre d’elle-même.':'La culture a besoin d’un instant pour se stabiliser.',
  'Le panel n’a pas fini de goûter.':'Le panel n’a pas fini de goûter.',
  'Le panel goûte encore. Ils ont l’air d’avoir pris ça personnellement.':'Le panel goûte encore. Ils ont l’air de prendre ça très au sérieux.',
  'Pas grand-chose à lire là-dedans.':'Rien de très utile à en tirer.',
  'La bourse est ouverte. Bonne chance.':'La bourse est ouverte. Fais-en ce que tu veux.',
  'La culture est vivante. Évidemment.':'La culture est vivante. Évidemment.',
  'Les fruits ne vont pas apparaître par magie.':'Les fruits ne vont pas apparaître tout seuls.',
  'L’étal est ouvert. Les pots se vendent tout seuls, doucement, à condition de ne pas demander n’importe quel prix.':'L’étal est ouvert. Les pots se vendent tout seuls, doucement, si le prix reste raisonnable.',
  'Une marmite, une cuillère et trois cents fruits. Ça devrait suffire.':'Une marmite, une cuillère et trois cents fruits. Pour commencer, ça suffira.',
  'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.':'La cuisine est fermée. Elle n’avait jamais rien eu d’exceptionnel, de toute façon.',
  'Le verger est silencieux.':'Le verger est calme.',
  'Le bourdonnement de l’essaim a disparu depuis un moment.':'Le bourdonnement de l’essaim a disparu depuis un moment.',
  'Le bourdonnement se stabilise.':'Le bourdonnement se calme.',
  'Un voisin laisse une caisse de fruits devant la porte. Pas de mot. C’est probablement préférable.':'Un voisin laisse une caisse de fruits devant la porte. Pas de mot.',
  'Surproduction de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.':'Excédent de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.',
  'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.',
  'Le palais a remporté le panel.':'Ton palais a remporté le panel.',
  'Ton palais a dominé le panel. +':'Ton palais a remporté le panel. +',
  'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.':'Le panel discute encore du dernier lot.',
  'Un ferment qui ne tient jamais en place. Lis-le bien, il donne de l’inspiration. Lis-le mal, il en reprend.':'Un ferment qui ne tient jamais en place. Lis-le bien, il donne de l’inspiration. Lis-le mal, il en reprend.',
  'De la lumière plutôt que de la chaleur. Deux chambres de plus dans la culture, et chacune répond un peu mieux.':'De la lumière plutôt que de la chaleur. Deux chambres de plus dans la culture, et chacune répond un peu mieux.',
  'De la lumière au lieu de la chaleur. Deux chambres de plus dans la culture, chacune un peu plus bavarde.':'De la lumière plutôt que de la chaleur. Deux chambres de plus dans la culture, chacune un peu plus bavarde.',
  'Peau, noyau, tige. Rien ne quitte la pièce. Les caisses donnent encore deux fois plus.':'Peau, noyau, tige. Rien ne quitte la pièce. Les caisses donnent encore deux fois plus.',
  'Un problème d’empilement, résolu par un homme qui ne fabriquait pas de confiture. Les cuillères automatiques sont maintenant quatre fois plus efficaces.':'Un problème d’empilement, résolu par un homme qui ne fabriquait pas de confiture. Les cuillères automatiques sont maintenant quatre fois plus efficaces.',
  'Les jamworks ne quittent jamais le feu. La production double.':'Les jamworks ne quittent jamais le feu. La production double.',
  'Une colonie qui bourdonne est un esprit distribué, généreux de ce qu’il comprend.':'Une colonie qui bourdonne ressemble à un esprit distribué, et elle partage volontiers ce qu’elle comprend.',
  'Le verger doit être pollinisé et les abeilles ont besoin de travail. Les deux problèmes viennent de trouver un arrangement.':'Le verger doit être pollinisé et les abeilles ont besoin de travail. Les deux problèmes viennent de trouver un arrangement.',
  'Le bon mot sur l’étiquette fait le travail de cent pots.':'Le bon mot sur l’étiquette fait le travail de cent pots.',
  'Une bonne étiquette fait le travail de cent pots.':'Une bonne étiquette fait le travail de cent pots.',
  'Un modèle assez crédible de ce que les autres veulent, à une cuillerée près. Rapporte un point de goût.':'Un modèle assez crédible de ce que les autres veulent, à une cuillerée près. Rapporte un point de goût.',
  'Un modèle de ce que les autres pensent que tu veux qu’ils veuillent. C’est ici que ça commence à nous échapper. Rapporte un point de goût.':'Un modèle de ce que les autres pensent que tu veux qu’ils veuillent. C’est ici que ça commence à nous dépasser. Rapporte un point de goût.',
  'La confiture s’est échappée du pot.':'La confiture s’est échappée du pot.',
  'La cuisine est fermée. Elle n’avait jamais rien eu d’exceptionnel, de toute façon.':'La cuisine est fermée. Elle n’avait jamais rien eu d’exceptionnel, de toute façon.',
  'La confiture est maintenant partout.':'La confiture est maintenant partout.',
  'Le dernier pot':'Le dernier pot',
  'Tout ce qui pouvait être atteint l’a été.':'Tout ce qui pouvait être atteint l’a été.',
  'La recette est complète. Il n’y a rien après.':'La recette est complète. Il n’y a rien après.',
  'merci d’avoir remué.':'merci d’avoir remué.'
};

function walk(n){
  if(n.nodeType===3){
    let v=n.nodeValue;
    for(const k in F)if(v.indexOf(k)!==-1)v=v.split(k).join(F[k]);
    n.nodeValue=v;
  }else if(n.nodeType===1){for(const c of Array.from(n.childNodes))walk(c);}
}
function run(){walk(document.body);}
new MutationObserver(run).observe(document.body,{subtree:true,childList:true,characterData:true});
setTimeout(run,0);setTimeout(run,300);setTimeout(run,1200);
})();
