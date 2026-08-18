(function(){
'use strict';
if(localStorage.getItem('the-jam-language')!=='fr')return;
if(typeof tr!=='function')return;

/* Composite labels: the English label is a text node next to a live value span.
   Translating text nodes one-by-one is fine, but this layer makes those prefixes
   explicit so a dynamic value can never make the whole label look half-English. */
function prefixBeforeValue(id,en,fr){
  const el=document.getElementById(id); if(!el)return;
  const parent=el.parentNode; if(!parent)return;
  for(const node of parent.childNodes){
    if(node.nodeType===Node.TEXT_NODE && node.nodeValue.indexOf(en)>=0){
      node.nodeValue=node.nodeValue.replace(en,fr);
    }
  }
}

function fixCompositeLabels(){
  prefixBeforeValue('crateSize','Crate of','Caisse de');
  prefixBeforeValue('spoonCost','Buy ·','Acheter ·');
  prefixBeforeValue('worksCost','Buy ·','Acheter ·');
  prefixBeforeValue('mktCost','Spread the word ·','Parler du produit ·');
  prefixBeforeValue('ovens','Oven ·','Four ·');
  prefixBeforeValue('cellars','Notebook ·','Carnet ·');
  prefixBeforeValue('sporeCost','Launch spore ·','Lancer une spore ·');
}

fixCompositeLabels();
if(typeof render==='function'&&!window.__JAM_FR_V15_RENDER_WRAPPED__){
  window.__JAM_FR_V15_RENDER_WRAPPED__=true;
  const baseRender=render;
  render=function(){const r=baseRender.apply(this,arguments);fixCompositeLabels();return r};
}
setTimeout(fixCompositeLabels,100);
setTimeout(fixCompositeLabels,500);
})();
