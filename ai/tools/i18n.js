#!/usr/bin/env node
/* ============================================================
   i18n tooling for The Jam.

   Translation has been the single most repeated PO complaint in the
   project, so checking it is a script and not a memory exercise.

     node ai/tools/i18n.js audit     — list English strings with no DICT entry
     node ai/tools/i18n.js add f.json — merge {"en":"fr"} pairs into DICT

   DICT lives on one line of i18n.js as a JSON object literal. Both modes
   read and rewrite exactly that line and nothing else.
   ============================================================ */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const I18N=path.join(ROOT,'i18n.js');

function readDict(){
  const src=fs.readFileSync(I18N,'utf8').split('\n');
  const i=src.findIndex(l=>l.startsWith('const DICT='));
  if(i<0)throw new Error('DICT line not found in i18n.js');
  const line=src[i];
  const json=line.slice(line.indexOf('{'),line.lastIndexOf('}')+1);
  return {src,i,dict:JSON.parse(json)};
}
function writeDict(src,i,dict){
  src[i]='const DICT='+JSON.stringify(dict)+';';
  fs.writeFileSync(I18N,src.join('\n'));
}

/* every place a user-visible English string can enter the DOM */
function collect(){
  const found=new Map();       /* string -> where */
  const markup=[];             /* candidates that may be fragments of a real string */
  const add=(str,where)=>{
    if(!str)return;
    const v=str.trim();
    if(!v||!/[A-Za-z]{3}/.test(v))return;
    if(!found.has(v))found.set(v,where);
  };
  const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

  for(const f of ['engine.js','ui.js','feel.js']){
    const src=read(f);
    /* t('…'), tf('…'), toast('…'), note('…'), pushNotice('…') */
    let m,re=/\b(t|tf|toast|note|pushNotice)\(\s*(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)")/g;
    while(m=re.exec(src))add((m[2]||m[3]||'').replace(/\\'/g,"'"),f);
    /* second argument of show(id,'…') */
    re=/\bshow\(\s*'[^']*'\s*,\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g;
    while(m=re.exec(src))add(m[1].replace(/\\'/g,"'"),f+' show()');
    /* authored data: recipe names and copy, fork copy, tooltips, palates */
    re=/\b(name|desc|blurb|note|kicker|copy|n|d)\s*:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g;
    while(m=re.exec(src))add(m[2].replace(/\\'/g,"'"),f+' '+m[1]);
    re=/^\s*(?:'[^']+'|[A-Za-z_$][\w$]*)\s*:\s*'([^'\\]*(?:\\.[^'\\]*)*)',?$/gm;
    while(m=re.exec(src))add(m[1].replace(/\\'/g,"'"),f+' map');
    /* Prose written straight into markup that JS builds — innerHTML and
       string concatenation. This whole class was invisible to the audit,
       which is how it kept reporting "missing: 0" while the player was
       looking at English on screen ("no positions", in the exchange
       panel, reported 2026-08-20). A string sitting between a > and a <
       inside a JS literal reaches the DOM exactly as a t() call does and
       has to be translated the same way. */
    re=/>([A-Za-z][A-Za-z ,.'\u2019\u2014-]{2,118}[A-Za-z.])</g;
    while(m=re.exec(src)){
      const v=m[1].trim();
      if(/^[\w$]+\.[\w$]+$/.test(v))continue;   /* a JS comparison, not prose */
      markup.push([v,f+' markup']);
    }
  }
  /* static markup */
  const html=read('index.html');
  const body=html.slice(html.indexOf('<body>'))
    .replace(/<script[\s\S]*?<\/script>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,'');
  let m,re=/>([^<>]+)</g;
  while(m=re.exec(body)){
    const v=m[1].replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim();
    if(/^[\s$€0-9.,%\/—·-]*$/.test(v))continue;      /* pure numeric placeholders */
    add(v,'index.html');
  }
  re=/aria-label="([^"]+)"/g;
  while(m=re.exec(html))add(m[1],'index.html aria-label');
  /* A fragment lifted from between two tags is only a finding if it is not
     already part of a string the audit has seen — "<b>trusted</b>" sits
     inside a note() call that is translated whole. */
  const whole=[...found.keys()];
  for(const [v,w] of markup){
    if(found.has(v))continue;
    if(whole.some(k=>k!==v&&k.includes(v)))continue;
    add(v,w);
  }
  return found;
}

/* One ignore list, parsed out of i18n.js so the runtime counter in the
   top bar and this audit can never disagree about what counts as a
   missing string. */
const IGNORE=(function(){
  const line=fs.readFileSync(I18N,'utf8').split('\n').find(l=>l.trim().startsWith('const I18N_OK='));
  if(!line)throw new Error('I18N_OK line not found in i18n.js');
  return new Set(JSON.parse(line.slice(line.indexOf('['),line.lastIndexOf(']')+1)));
})();

const mode=process.argv[2];
if(mode==='audit'){
  const {dict}=readDict();
  const found=collect();
  const missing=[...found].filter(([k])=>!(k in dict)&&!IGNORE.has(k));
  console.log('DICT entries: '+Object.keys(dict).length);
  console.log('strings reachable by the player: '+found.size);
  console.log('missing: '+missing.length);
  for(const [k,w] of missing.sort())console.log('  ['+w+'] '+JSON.stringify(k));
  process.exit(missing.length?1:0);
}else if(mode==='add'){
  const file=process.argv[3];
  if(!file){console.error('usage: i18n.js add <file.json>');process.exit(2)}
  const pairs=JSON.parse(fs.readFileSync(file,'utf8'));
  const {src,i,dict}=readDict();
  let added=0,changed=0;
  for(const k in pairs){
    if(!(k in dict))added++; else if(dict[k]!==pairs[k])changed++;
    dict[k]=pairs[k];
  }
  writeDict(src,i,dict);
  console.log('added '+added+', updated '+changed+', total '+Object.keys(dict).length);
}else{
  console.error('usage: i18n.js audit | add <file.json>');process.exit(2);
}
