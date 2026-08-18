(function(){
'use strict';
if(window.__JAM_FR_V9__)return;
window.__JAM_FR_V9__=true;
const lang=localStorage.getItem('the-jam-language')||(/^fr\b/i.test(navigator.language||'')?'fr':'en');
if(lang!=='fr')return;
const M={
 'ACT I':'ACTE I','ACT II':'ACTE II','ACT III':'ACTE III','Act two':'Acte deux','Act three':'Acte trois',
 'they A':'eux A','they B':'eux B','you A':'toi A','you B':'toi B','insp':'insp','crea':'créa',
 'Autospoons available.':'Les cuillères automatiques sont prêtes.',
 'You can spread the word.':'Tu peux maintenant faire parler du produit.',
 'Jamworks available.':'Les jamworks sont prêts.',
 'A tasting panel convenes.':'Un panel de dégustation se réunit.',
 'The swarm arrives.':'L’essaim est là. Personne ne se souvient de l’avoir invité.',
 'Machinery may now be built out of jars. There are enough jars.':'Les machines peuvent maintenant être construites avec des pots. Il y en a suffisamment.',
 'Every jar ever sold has been quietly recalled. Nobody objected; nobody was asked.':'Tous les pots vendus ont été discrètement rappelés. Personne n’a protesté. Personne n’a été consulté.',
 'Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.':'Tous les pots du bassin de collecte sont chargés à bord. Les spores peuvent être lancées. Chacune emporte la recette, et presque rien d’autre.',
 'There is no unpicked mass left within reach. The orchard is quiet.':'Il ne reste plus de matière non récoltée à portée de main. Le verger est calme.',
 'Every gram that could be reached has been reached.':'Chaque gramme qui pouvait être atteint l’a été.',
 'The culture does not stay in the jar. By morning it is in the hedgerow; by evening it is in the soil. It is still, technically, doing what it was asked.':'La culture ne reste pas dans le pot. Au matin, elle est dans la haie ; le soir, elle est dans le sol. Techniquement, elle fait toujours ce qu’on lui a demandé.',
 'The catchment is finished. Somewhere above the orchard there is a great deal of matter that has never been asked whether it would like to be jam.':'Le bassin de collecte est épuisé. Quelque part au-dessus du verger, il reste une quantité considérable de matière à qui personne n’a encore demandé si elle voulait devenir de la confiture.',
 'The panel is still discussing the last batch. They have a lot to say.':'Le panel discute encore du dernier lot. Ils ont manifestement beaucoup de choses à en dire.',
 'Every jar in the catchment is loaded aboard. Spores may be launched. Each carries the recipe and very little else.':'Tous les pots du bassin de collecte sont chargés à bord. Les spores peuvent être lancées. Chacune emporte la recette, et presque rien d’autre.',
 'The last jar':'Le dernier pot','Closing entry':'Dernière entrée',
 'Everything that could be reached has been reached. The observable universe is ':'Tout ce qui pouvait être atteint l’a été. L’univers observable contient ',
 ' jars of jam, sealed, labelled and stacked in a space that no longer contains anything to stack them against.':' pots de confiture, scellés, étiquetés et empilés dans un espace qui ne contient plus rien contre quoi les empiler.',
 'The spores report in from the edge. There is nothing further to convert, no further instruction in the recipe, and no one left who wanted any of this. The hum of the swarm has been gone for some time. You did not notice when it stopped.':'Les spores rapportent depuis la frontière. Il n’y a plus rien à convertir, plus aucune instruction dans la recette, et plus personne qui ait demandé tout cela. Le bourdonnement de l’essaim a disparu depuis un moment. Tu n’as pas remarqué quand il s’est arrêté.',
 'There is one gram held back. Not for any reason in the method — it simply was not collected, and now the method has nothing to say about it.':'Il reste un gramme de côté. Pour aucune raison prévue par la méthode : il n’a simplement pas été récolté, et maintenant la méthode n’a plus rien à en dire.',
 'It is set, sealed, and labelled in a hand that has not been human for a long while. The recipe is complete. Nothing follows it. The jars are very good — genuinely, measurably good — and there is no mouth in any direction that could confirm this.':'Il est pris, scellé et étiqueté d’une écriture qui n’est plus humaine depuis longtemps. La recette est complète. Il n’y a rien après. Les pots sont très bons — vraiment, mesurément bons — et il n’y a plus aucune bouche dans aucune direction pour le confirmer.',
 'One gram, left as fruit. It goes soft, and then it goes to nothing, which is a thing jam cannot do. It is the last event in the universe that was not planned in a kitchen. That seems, on reflection, worth the loss of one jar.':'Un gramme, laissé sous forme de fruit. Il ramollit, puis disparaît, ce que la confiture est précisément incapable de faire. C’est le dernier événement de l’univers qui n’a pas été planifié dans une cuisine. Après réflexion, cela semble valoir la perte d’un pot.',
 'Risk: low':'Risque : faible','Risk: medium':'Risque : moyen','Risk: high':'Risque : élevé',
};
function tr(x){
 if(M[x]!==undefined)return M[x];
 let m=x.match(/^The culture does not stay in the jar\.(.*)$/); if(m)return M['The culture does not stay in the jar.']+m[1];
 m=x.match(/^(.+?) jars · (.+?) minutes · batch no\. (\d+) · thank you for stirring\.$/); if(m)return m[1]+' pots · '+m[2]+' minutes · lot n° '+m[3]+' · merci d’avoir remué.';
 m=x.match(/^Panel (\d+): you placed (\d+)\. \+(.+) inspiration\.$/); if(m)return 'Panel '+m[1]+' : tu as terminé '+m[2]+'e. +'+m[3]+' inspiration.';
 return x;
}
function walk(root){const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=w.nextNode())a.push(n);a.forEach(t=>{const p=t.parentElement;if(!p||['SCRIPT','STYLE','SVG'].includes(p.tagName))return;const raw=t.nodeValue,v=tr(raw.trim());if(raw.trim()&&v!==raw.trim())t.nodeValue=raw.replace(raw.trim(),v)});(root||document.body).querySelectorAll('[title],[aria-label]').forEach(e=>{if(e.title)e.title=tr(e.title);if(e.getAttribute('aria-label'))e.setAttribute('aria-label',tr(e.getAttribute('aria-label')))});}
function run(){walk(document.body);const o=new MutationObserver(ms=>ms.forEach(m=>{m.addedNodes.forEach(n=>{if(n.nodeType===1)walk(n);else if(n.nodeType===3){const raw=n.nodeValue,v=tr(raw.trim());if(raw.trim()&&v!==raw.trim())n.nodeValue=raw.replace(raw.trim(),v)}})}));o.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
