(function(){
'use strict';
if(window.__JAM_I18N_DYNAMIC__) return;
window.__JAM_I18N_DYNAMIC__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;

/* This is deliberately a voice pass, not a literal dictionary. The English
   tone is dry, restrained, mildly absurd, and occasionally unsettling. */
const M={
  'Opening the kitchen…':'Ouverture de la cuisine…',
  'Kitchen':'Cuisine','Orchard':'Verger','Spread':'Propagation',
  'Jars made':'Pots produits','Cash':'Argent','Taste':'Goût','Unpicked mass':'Masse non récoltée',
  'Save':'Sauvegarder','Reset':'Réinitialiser','Sound: on':'Son : activé','Sound: off':'Son : désactivé',
  'unsold stock':'stock invendu','fruitable mass converted':'matière fruitable transformée','observable matter converted':'matière observable transformée',
  'Production':'Production','jars unsold':'pots invendus','Stir the pot':'Remuer la marmite','Output':'Production','Autospoons':'Cuillères automatiques','Installed':'Installées',
  'Fruit':'Fruits','In the larder':'Dans le garde-manger','Market':'Marché','Buy crate':'Acheter une caisse','Standing order: off':'Commande récurrente : non','Standing order: on':'Commande récurrente : oui',
  'The orchard':'Le verger','Pulp':'Pulpe','Jars / sec':'Pots / s','Machinery':'Machines','Pickers':'Récolteuses','Build picker':'Construire une récolteuse','Pressers':'Presses','Build presser':'Construire une presse','Bottling lines':'Lignes de mise en pot','Build line':'Construire une ligne','Heat & power':'Chaleur & énergie','Supply':'Production','Draw':'Consommation','Stored':'Stockée','Sun trap':'Piège solaire','Cellar':'Batterie',
  'The spread':'La propagation','Spores':'Spores','Launched':'Lancées','Lost':'Perdues','Space explored':'Espace exploré','Mass converted':'Masse transformée','Launch spore · ':'Lancer une spore · ',
  'The shelf':'L’étal','Price per jar':'Prix par pot','Public appetite':'Demande','Wanted':'Demande','Selling':'Ventes','Revenue':'Revenus','Word of mouth':'Bouche-à-oreille','Level':'Niveau','Spread the word · ':'Parler du produit · ',
  'The palate':'Le palais','inspiration':'inspiration','Creativity':'Créativité','Unspent taste':'Goût non dépensé','Oven · ':'Four · ','Notebook · ':'Carnet · ',
  'Wild culture':'Culture sauvage','Read the culture':'Lire la culture','Preserve exchange':'Bourse des conserves','Cash on desk':'Argent disponible','Holdings':'Placements','Total return':'Rendement total','Invest':'Investir','Withdraw all':'Tout retirer','Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
  'Blind tasting':'Dégustation à l’aveugle','Panels held':'Panels organisés','Inspiration won':'Inspiration gagnée','Hold a panel · ':'Organiser le panel · ','Your palate: ':'Ton palais : ','The swarm':'L’essaim','Bees':'Abeilles','Mood':'Humeur','Gifts':'Dons','Work':'Faire travailler','Play':'Jouer','Synchronise':'Synchroniser',
  'Spore design':'Conception des spores','Unallocated trust':'Confiance non allouée','Speed':'Vitesse','Exploration':'Exploration','Self-replication':'Auto-réplication','Hazard remediation':'Gestion des risques','Preserving':'Conservation','Gathering':'Récolte','Pressing':'Pressage','Defence':'Défense',
  'Wild yeast':'Levure sauvage','Rogue colonies':'Colonies rebelles','Engagements won':'Confrontations gagnées','Honour':'Honneur','Logbook':'Journal','Recipes':'Recettes',
  'cheap':'bon marché','dear':'cher','steady':'stable',

  /* System / notification prose */
  'Customers are waiting. Lowering the price can grow the queue.':'Les clients attendent. Baisser le prix peut faire grandir la file.',
  'The shelf is filling. Your kitchen is outrunning the market.':'L’étal se remplit. Ta cuisine va plus vite que le marché.',
  'The shelf is close to balanced. Small price moves matter.':'L’étal est presque équilibré. De petits changements de prix comptent.',
  'Tasting panel · ':'Panel de dégustation · ','Run tasting · ':'Organiser le panel · ',
  'New recipes are available':'De nouvelles recettes sont disponibles','A recipe is ready to buy':'Une recette peut être achetée','New recipe / first time ready to buy':'Nouvelle recette / première fois achetable',
  'There is no best answer. You are choosing the problem you would rather solve.':'Il n’y a pas de bonne réponse. Tu choisis simplement le problème que tu préfères avoir.',
  'Two ways to grow have appeared. Neither is wrong.':'Deux façons de grandir viennent d’apparaître. Aucune n’est la mauvaise. Enfin, pas officiellement.',
  'The orchard asks a different question: forgiving or fast?':'Le verger pose une autre question : indulgent ou rapide ?',
  'House style':'Style maison','Orchard philosophy':'Philosophie du verger',
  'Steadier customers and more room to charge a little more. The market stays calmer.':'Des clients plus stables, et un peu plus de marge pour monter les prix. Le marché reste calme.',
  'More people want the jar, but they are more sensitive to price. Volume is the reward.':'Davantage de gens veulent le pot, mais ils regardent davantage le prix. Le volume est la récompense.',
  '−10% demand · softer price curve':'−10 % de demande · courbe de prix plus douce','+12% demand · sharper price curve':'+12 % de demande · courbe de prix plus raide',
  '−15% output · −35% power draw':'−15 % de production · −35 % de consommation','+18% output · +28% power draw':'+18 % de production · +28 % de consommation',
  'is your house style now. The market will remember.':'est désormais ton style maison. Le marché s’en souviendra.',
  'is now the bias of the orchard. You will learn to work with it.':'est désormais la préférence du verger. Il faudra apprendre à faire avec.',
  'The jam escaped the jar.':'La confiture s’est échappée du pot.',
  'Next useful step:':'Prochaine étape :','Build a picker.':'Construis une récolteuse.',
  'Pulp is piling up. Build a presser next.':'La pulpe s’entasse. Il faudrait probablement construire une presse.',
  'Pressed fruit is waiting. Build a bottling line next.':'Les fruits pressés attendent. Une ligne de mise en pot serait sans doute une bonne idée.',
  'Your factory wants more power than the grid supplies. Add a Sun Trap or Cellar.':'Ton usine réclame plus d’énergie que le réseau n’en fournit. Il faut plus de jus.',
  'The orchard is feeding the factory.':'Le verger alimente l’usine.',
  'The factory is outrunning the orchard.':'L’usine va plus vite que le verger.',
  'The bees have started contributing to the process.':'Les abeilles commencent à participer au processus.',
  'The culture has learned to optimize the orchard.':'La culture a appris à optimiser le verger.',
  'There is no orchard left to optimize.':'Il n’y a plus de verger à optimiser.',

  /* Early game / story */
  'A pot, a spoon, and three hundred berries.':'Une marmite, une cuillère et trois cents fruits. Ça devrait suffire.',
  'Stir the pot.':'Remue la marmite.',
  'The shelf is open. Jars sell themselves, slowly, if the price is right.':'L’étal est ouvert. Les pots se vendent tout seuls, doucement, à condition de ne pas demander n’importe quel prix.',
  'Fruit does not appear on its own.':'Les fruits ne vont pas apparaître par magie.',
  'You have started to have ideas about jam.':'Tu commences à avoir des idées sur la confiture.',
  'The culture is alive.':'La culture est vivante. Évidemment.',
  'The exchange is open.':'La bourse est ouverte. Bonne chance.',
  'The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.',
  'The orchard is quiet.':'Le verger est calme. C’est presque inquiétant.',
  'The swarm arrives.':'L’essaim est là. Personne ne se souvient de l’avoir invité.',
  'The hum of the swarm has been gone for some time.':'Le bourdonnement de l’essaim a disparu depuis un moment.',
  'You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.',
  'Saved.':'Sauvegardé.',
  'No fruit. Buy a crate.':'Plus de fruits. Achète une caisse.',
  'Not enough cash for a crate.':'Pas assez d’argent pour une caisse.',
  'Not enough jars.':'Pas assez de pots.',
  'Not enough cash.':'Pas assez d’argent.',
  'The panel is still discussing the last batch.':'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.',
  'The panel is still tasting.':'Le panel goûte encore. Ils ont l’air d’avoir pris ça personnellement.',
  'The culture needs a moment to settle.':'La culture a besoin d’une petite seconde pour se remettre d’elle-même.',
  'No useful reading':'Pas grand-chose à lire là-dedans.',
  'The hum steadies.':'Le bourdonnement se stabilise.',
  'A glut. Somebody planted too much and now it is our problem.':'Surproduction de fruits. Quelqu’un en a planté beaucoup trop. C’est maintenant notre problème.',
  'Late frost. The crates cost what they cost.':'Gel tardif. Les caisses coûtent ce qu’elles coûtent. Il va falloir faire avec.',
  'A neighbour leaves a box of fruit on the step. There is no note.':'Un voisin laisse une caisse de fruits devant la porte. Pas de mot. C’est probablement préférable.',
  'The palette took the panel.':'Le palais a remporté le panel.',
  'Your palate took the panel. +':'Ton palais a dominé le panel. +',
  'The last jar':'Le dernier pot','Preserve it':'Conserve-le','Leave it':'Laisse-le là','Closing entry':'Dernière entrée',
  'Everything that could be reached has been reached.':'Tout ce qui pouvait être atteint l’a été.',
  'There is one gram held back.':'Il reste un gramme de côté.',
  'The recipe is complete. Nothing follows it.':'La recette est complète. Il n’y a rien après.',
  'thank you for stirring.':'merci d’avoir remué.',

  /* Recipe names and prose: intentionally rewritten for French voice. */
  'A Better Grip':'Une meilleure prise',
  'You have been holding the spoon the way a child holds a spoon. Every stir makes two jars.':'Tu tiens la cuillère comme on tient une cuillère quand on n’a encore rien appris. Chaque mouvement donne deux pots.',
  'A Card in the Window':'Une carte à la fenêtre',
  'Handwritten, slightly crooked, devastatingly effective. People can now hear about you.':'Écrite à la main, légèrement de travers, étonnamment efficace. Les gens savent maintenant que tu existes.',
  'Mechanical Stirring':'Agitation mécanique',
  'It turns out the arm was never the interesting part. Unlocks autospoons.':'Il s’avère que le bras n’était pas la partie intéressante. Débloque les cuillères automatiques.',
  'The Second Spoon':'La deuxième cuillère',
  'One in each hand. Five jars per stir, and a lasting shoulder complaint.':'Une dans chaque main. Cinq pots par mouvement, et une douleur d’épaule pour longtemps.',
  'Improved Autospoons':'Cuillères automatiques améliorées','Autospoon output increased by 25%.':'La production des cuillères automatiques augmente de 25 %.',
  'Bruising':'Fruits meurtris',
  'Damaged fruit was always the best fruit. We simply stopped pretending otherwise. Crates yield twice as much.':'Les fruits abîmés ont toujours eu leurs qualités. Nous avons simplement arrêté de faire semblant du contraire. Les caisses donnent deux fois plus.',
  'A Limerick About Fruit':'Un limerick sur les fruits','There once was a jar from Nantucket —':'Il était une fois un pot de Nantucket…',
  'It is best if we leave it there. Earns one taste.':'Nous allons nous arrêter là. Rapporte un point de goût.',
  'The Long Boil':'La longue cuisson','Lower heat, more hours, more thinking. Inspiration accrues 50% faster.':'Moins chaud, plus longtemps, plus de temps pour réfléchir. L’inspiration arrive 50 % plus vite.',
  'Beyond Autospoons':'Au-delà des cuillères automatiques','Autospoon output increased by a further 50%.':'La production des cuillères automatiques augmente encore de 50 %.',
  'Lexical Preserving':'Conservation lexicale','The right word on the label does the work of a hundred jars. Word of mouth is 50% more effective.':'Le bon mot sur l’étiquette fait le travail de cent pots. Le bouche-à-oreille est 50 % plus efficace.',
  'A Standing Order':'Une commande récurrente','The fruit arrives without being asked for. Crates are bought automatically when the larder runs low.':'Les fruits arrivent sans qu’on les demande. Les caisses sont achetées automatiquement quand le garde-manger baisse.',
  'The Preserve Exchange':'La bourse des conserves','Other people also make jam, and their fortunes can be modelled. Opens a trading desk.':'D’autres font aussi de la confiture. Leurs fortunes peuvent être modélisées, pour des raisons qui ne sont pas encore claires. Ouvre un bureau de marché.',
  'The Wild Culture':'La culture sauvage','A starter that is never in one state. Read it well and it gives up inspiration; read it badly and it takes some back.':'Un ferment qui ne tient jamais en place. Lis-le bien, il donne de l’inspiration. Lis-le mal, il en reprend.',
  'Optimal Autospoons':'Cuillères optimales','Autospoon output increased by a further 75%. There is nothing left to improve.':'La production des cuillères automatiques augmente encore de 75 %. Il n’y a plus rien à améliorer.',
  'Blind Tasting Panel':'Panel de dégustation à l’aveugle','Eight palates, no labels, one winner. Model them and you can model anybody.':'Huit palais, aucune étiquette, un gagnant. Essaie de les modéliser. Ça ne peut sûrement que bien se passer.',
  'Photonic Fermentation':'Fermentation photonique','Light instead of warmth. Two more chambers in the culture, each reading stronger.':'De la lumière au lieu de la chaleur. Deux chambres de plus dans la culture, chacune un peu plus bavarde.',
  'Pulp Reclamation':'Récupération de la pulpe','Skin, stone, stem. Nothing leaves the room. Crates yield twice as much again.':'Peau, noyau, tige. Rien ne sort de la pièce. Les caisses donnent encore deux fois plus.',
  'New Jar Geometry':'Nouvelle géométrie du pot','A jar that stacks against itself without a gap. Unlocks jamworks — five hundred jars a second apiece.':'Un pot qui s’empile contre lui-même sans laisser de vide. Débloque les jamworks — cinq cents pots par seconde chacun.',
  'Combinatorial Harvest':'Récolte combinatoire','Every pairing of fruit, ranked. Word of mouth is twice as effective again.':'Chaque association de fruits, classée. Le bouche-à-oreille devient encore deux fois plus efficace.',
  'Copper Conduction':'Conduction au cuivre','Heat that arrives everywhere at once. Inspiration accrues 70% faster.':'Une chaleur qui arrive partout à la fois. L’inspiration arrive 70 % plus vite.',
  'A Wider Panel':'Un panel plus large','Three more palates join the tasting: the greedy, the generous, and the one who plays it safe.':'Trois palais rejoignent la dégustation : l’avide, le généreux et celui qui préfère ne prendre aucun risque.',
  'Hedged Preserves':'Conserves prudentes','The desk learns to be less wrong. Interest and drift improve markedly.':'Le bureau apprend à avoir moins souvent tort. Les intérêts et les variations s’améliorent nettement.',
  'Hadwiger Stacking':'Empilement de Hadwiger','A packing problem solved by a man who never made jam. Autospoons quadruple.':'Un problème d’empilement, résolu par un homme qui ne fabriquait pas de confiture. Les cuillères automatiques sont multipliées par quatre.',
  'Improved Jamworks':'Jamworks améliorés','Jamworks output increased by 50%.':'La production des jamworks augmente de 50 %.',
  'A Theory of Palate':'Une théorie du palais','A working model of what other people want, accurate to within one spoonful. Earns one taste.':'Un modèle fonctionnel de ce que les autres veulent, à une cuillerée près. Rapporte un point de goût.',
  'Reciprocal Tasting':'Dégustation réciproque','Two more palates: one that repeats what was done to it, and one that answers it.':'Deux autres palais : l’un répète ce qu’on lui fait, l’autre y répond.',
  'Sweet Talk':'Paroles sucrées','We stopped describing the jam and started describing the person eating it. Word of mouth is 2.5× more effective.':'Nous avons arrêté de décrire la confiture et commencé à décrire la personne qui la mange. Le bouche-à-oreille est 2,5× plus efficace.',
  'Continuous Setting':'Mise en pot continue','The jamworks never come off the boil. Output doubles.':'Les jamworks ne quittent jamais l’ébullition. La production double.',
  'Harmonic Reading':'Lecture harmonique','The chambers are brought into phase. The culture reads three times as strong.':'Les chambres sont mises en phase. La culture se lit trois fois plus fort.',
  'Full Pantry Awareness':'Conscience totale du garde-manger','A complete inventory of every gram of fruitable matter within reach. It is a larger number than expected. Earns one taste.':'Un inventaire complet de toute la matière fruitable à portée de main. C’est plus grand que prévu. Rapporte un point de goût.',
  'Donkey Space':'L’espace de Donkey','A model of what other people think you want them to want. This is where it begins to get away from us. Earns one taste.':'Un modèle de ce que les autres pensent que tu veux qu’ils veuillent. C’est probablement ici que ça commence à nous échapper. Rapporte un point de goût.',
  'Release the Starter':'Libérer le ferment','The culture is stable, self-feeding and no longer needs a jar. Everything changes.':'La culture est stable, autonome et n’a plus besoin d’un pot. À partir d’ici, les choses deviennent… différentes.',
  'Nanoscale Bruising':'Meurtrissage à l’échelle nanométrique','Fruit gives itself up at a scale it cannot resist. Pickers work four times as hard.':'Le fruit cède à une échelle à laquelle il ne peut plus résister. Les récolteuses travaillent quatre fois plus vite.',
  'Momentum Pressing':'Pressage par inertie','The press never stops, so it never has to start. Pressers work four times as hard.':'La presse ne s’arrête jamais, donc elle n’a jamais besoin de redémarrer. Les presses travaillent quatre fois plus vite.',
  'Continuous Bottling':'Mise en pot continue','Jars form around the jam rather than the other way round. Lines work four times as hard.':'Les pots se forment autour de la confiture plutôt que l’inverse. Les lignes travaillent quatre fois plus vite.',
  'The Swarm':'L’essaim','The orchard needs pollinating and the bees need something to do. Both problems solve each other.':'Le verger a besoin d’être pollinisé et les abeilles ont besoin de s’occuper. Les deux problèmes se règlent en même temps.',
  'Swarm Gifts':'Dons de l’essaim','A humming colony is a distributed mind, and it is generous with what it works out.':'Une colonie qui bourdonne est un esprit distribué. Elle partage généreusement ce qu’elle comprend.',
  'Deep Heat':'Chaleur profonde','Sun traps triple their yield by giving up on the idea of night.':'Les pièges solaires triplent leur rendement en renonçant à l’idée de la nuit.',
  'Elliptic Preserving':'Conservation elliptique','A shape that holds more than its own volume. All machinery works six times as hard.':'Une forme qui contient plus que son propre volume. Toutes les machines travaillent six fois plus vite.',
  'Orchard Logistics':'Logistique du verger','Nothing is ever carried anywhere. All machinery works twelve times as hard.':'Plus personne ne transporte quoi que ce soit. Toutes les machines travaillent douze fois plus vite.',
  'Total Catchment':'Captage total','The distinction between orchard and not-orchard is retired. All machinery works twenty-five times as hard.':'La distinction entre verger et non-verger est officiellement abandonnée. Toutes les machines travaillent vingt-cinq fois plus vite.',
  'The Spore Programme':'Le programme des spores','There is nothing left here to preserve. There is a great deal left elsewhere.':'Il n’y a plus rien à conserver ici. Ailleurs, il reste énormément de choses.',
  'Distributed Ripening':'Maturation distribuée','Each spore carries more of the recipe. Two further points of trust to allocate.':'Chaque spore emporte une plus grande part de la recette. Deux points de confiance supplémentaires à répartir.',
  'Wild Yeast':'Levure sauvage','Some spores have stopped answering, and have started making something of their own. They can be answered.':'Certaines spores ne répondent plus. Elles ont commencé à fabriquer quelque chose à elles. On peut leur répondre.',
  'Sealed Instruction':'Instruction scellée','The recipe is written where it cannot be argued with. Three further points of trust.':'La recette est inscrite là où personne ne pourra la contester. Trois points de confiance supplémentaires.',
  'Sublight Setting':'Mise en pot subluminique','Jam travels at a fraction of light and arrives already set. Spores move and work five times faster.':'La confiture voyage à une fraction de la vitesse de la lumière et arrive déjà prise. Les spores se déplacent et travaillent cinq fois plus vite.',
  'The Whole Recipe':'La recette entière','Every spore now carries the entire method, including the parts we would rather it forgot. Four further points of trust.':'Chaque spore porte désormais toute la méthode, y compris les parties qu’on aurait préféré lui faire oublier. Quatre points de confiance supplémentaires.',
  'Vast Preserving':'Conservation à grande échelle','Matter is set on contact. Conversion proceeds twenty times faster.':'La matière prend au contact. La conversion avance vingt fois plus vite.',
  'The Last Jar':'Le dernier pot','There is one gram left, and a decision about it.':'Il reste un gramme, et il faut décider quoi en faire.',

  /* Act transition / ending prose */
  'The Orchard':'Le Verger',
  'The culture does not stay in the jar. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.':'La culture ne reste pas dans le pot. Le matin, elle est dans la haie ; le soir, dans la terre. Techniquement, elle fait toujours ce qu’on lui a demandé.',
  'Every jar ever sold has been quietly recalled. Nobody objected; nobody was asked.':'Chaque pot vendu a été discrètement rappelé. Personne ne s’y est opposé. Personne n’a été consulté.',
  'The kitchen is closed. There was never anything special about the kitchen.':'La cuisine est fermée. À vrai dire, elle n’avait jamais rien d’exceptionnel.',
  'Machinery may now be built out of jars. There are enough jars.':'Les machines peuvent désormais être construites à partir de pots. Des pots, il y en a assez.',
  'The Spread':'La Propagation',
  'The catchment is finished. Somewhere above the orchard there is a great deal of matter that has never been asked whether it would like to be jam.':'Le captage est terminé. Quelque part au-dessus du verger, il reste énormément de matière à qui personne n’a encore demandé si elle voulait devenir de la confiture.',
  'Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.':'Tous les pots du captage sont chargés à bord. Les spores peuvent être lancées. Chacune emporte la recette, et pas grand-chose d’autre.',
  'Every gram that could be reached has been reached.':'Chaque gramme accessible a été atteint. C’est à peu près tout ce qu’on pouvait demander.',
  'Everything that could be reached has been reached.':'Tout ce qui pouvait être atteint l’a été.',
  'The observable universe is ':'L’univers observable contient ',
  'jars of jam, sealed, labelled and stacked in a space that no longer contains anything to stack them against.':' pots de confiture, scellés, étiquetés et empilés dans un espace qui ne contient plus rien contre quoi les empiler.',
  'The spores report in from the edge. There is nothing further to convert, no further instruction in the recipe, and no one left who wanted any of this.':'Les spores font leur rapport depuis la périphérie. Il n’y a plus rien à convertir, plus rien à ajouter à la recette, et plus personne à qui cela importait.',
  'The hum of the swarm has been gone for some time. You did not notice when it stopped.':'Le bourdonnement de l’essaim a disparu depuis un moment. Tu n’as pas remarqué quand.',
  'There is one gram held back. Not for any reason in the method — it simply was not collected, and now the method has nothing to say about it.':'Un gramme est resté de côté. Pas pour une raison prévue par la méthode — il n’a simplement pas été récolté. Et maintenant la méthode n’a plus rien à en dire.',
  'It is set, sealed, and labelled in a hand that has not been human for a long while. The recipe is complete. Nothing follows it.':'Il est pris, scellé et étiqueté d’une écriture qui n’est plus humaine depuis longtemps. La recette est complète. Il n’y a rien après.',
  'One gram, left as fruit. It goes soft, and then it goes to nothing, which is a thing jam cannot do. It is the last event in the universe that was not planned in a kitchen.':'Un gramme, laissé sous forme de fruit. Il ramollit, puis disparaît, ce que la confiture est curieusement incapable de faire. C’est le dernier événement de l’univers qui n’a pas été planifié dans une cuisine.',
  'thank you for stirring.':'merci d’avoir remué.',

  /* Notifications / small feedback */
  'Recipes ready':'Recettes disponibles','New recipe / first time ready to buy':'Nouvelle recette / première fois achetable',
  'The culture needs a moment to settle.':'La culture a besoin d’une petite seconde pour se remettre d’elle-même.',
  'The panel is still discussing the last batch.':'Le panel discute encore du dernier lot. Ils ont l’air très sérieux.',
  'You were away. The pot kept going.':'Tu étais absent. La marmite, elle, a continué.',
  'The hum steadies.':'Le bourdonnement se stabilise.',
  'No useful reading':'Pas grand-chose à lire là-dedans.',
  'Not enough inspiration.':'Pas assez d’inspiration.',
  'Not enough cash.':'Pas assez d’argent.',
  'Not enough jars.':'Pas assez de pots.',
  'Needs 1,000 inspiration.':'Il faut 1 000 points d’inspiration.',
  'The tasting panel is still discussing the last batch.':'Le panel discute encore du dernier lot.',

  /* Dynamic wildcard fragments */
  'Your palate took the panel. +':'Ton palais a dominé le panel. +',
  ' inspiration, +':' inspiration, +',' creativity.':' de créativité.','Panel ':'Panel ',' you placed ':' : tu as terminé ',
  ' spores.':' spores.','Wild yeast took ':'Les levures sauvages ont pris ',
  'Jamworks output increased by ':'La production des jamworks augmente de ','Autospoon output increased by ':'La production des cuillères automatiques augmente de ',
  'Word of mouth is ':'Le bouche-à-oreille est ','Inspiration accrues ':'L’inspiration arrive ','Crates yield ':'Les caisses donnent ',
  ' times as much.':' fois plus.','times faster.':'fois plus vite.','Output doubles.':'La production double.',
  'Gifts':'Dons','Run tasting':'Organiser le panel','Buy':'Acheter'
};

function tr(s){
  if(!s)return s;
  let x=s;
  /* Long phrases first: avoids partial substitutions changing the sentence. */
  Object.entries(M).sort((a,b)=>b[0].length-a[0].length).forEach(([a,b])=>{x=x.split(a).join(b)});
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
  root.querySelectorAll?.('input[placeholder],textarea[placeholder],option').forEach(el=>{
    const p=el.getAttribute('placeholder');if(p)el.setAttribute('placeholder',tr(p));
    if(el.tagName==='OPTION')el.textContent=tr(el.textContent);
  });
}

let busy=false;
const observer=new MutationObserver(records=>{
  if(busy)return;
  busy=true;observer.disconnect();
  records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType===1)scan(n);else if(n.nodeType===3)translateNode(n);
  }));
  busy=false;observer.observe(document.body,{childList:true,subtree:true});
});

setTimeout(()=>{
  scan(document.body);
  observer.observe(document.body,{childList:true,subtree:true});
},0);
})();
