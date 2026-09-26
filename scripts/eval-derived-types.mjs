import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {classifyDirectObject} from '../lib/derived-work-type.mjs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
import holdout from './fixtures/derived-type-holdout-v1.json' with {type:'json'};
import manifest from '../lib/national-manifest.json' with {type:'json'};
const base=process.argv[2]||'http://127.0.0.1:3005';
void test('shipping rules match the frozen evaluation and its 140 observations',()=>{
 const source=fs.readFileSync('lib/derived-work-type.mjs','utf8').replaceAll('\r\n','\n');
 assert.equal(createHash('sha256').update(source).digest('hex'),holdout.frozen_rule_sha256);
 assert.equal(holdout.cases.length,140);
 for(const row of holdout.cases)assert.deepEqual(classifyDirectObject(row.title),row.labels,row.id);
});
void test('known locative false positives abstain and a changed title recalculates the result',()=>{
 for(const title of ['Pavimentação da Rua da Cisterna','Passarela de acesso à biblioteca','Construção de barreira perimetral do hospital','Cobertura de acesso às docas do restaurante estudantil'])assert.deepEqual(classifyDirectObject(title),[]);
 assert.equal(classifyDirectObject('Construção de biblioteca')[0].id,'biblioteca');
 assert.deepEqual(classifyDirectObject('Construção de passarela de acesso à biblioteca'),[]);
});
void test('coverage over the national snapshot preserves official fields and never fills abstentions',()=>{
 let total=0,classified=0;const categories={};
 for(const bucket of manifest.buckets)for(const work of Object.values(decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`))))){
  const before=JSON.stringify(work.context.classification);const found=classifyDirectObject(work.name);total++;
  assert.equal(JSON.stringify(work.context.classification),before);assert.ok(found.length<=1);
  if(found.length){classified++;const result=found[0];assert.equal(result.source_field,'desc_nome');assert.ok(result.evidence);categories[result.id]=(categories[result.id]||0)+1;}
 }
 assert.equal(total,manifest.total);console.log(JSON.stringify({sourceLoad:manifest.sourceLoad,total,classified,abstained:total-classified,categories}));
});
void test('HTML distinguishes derived type from official area and explains limitations',async()=>{
 const html=await (await fetch(`${base}/obras/44379.35-79`)).text();
 assert.ok(html.includes('Classificação oficial'));assert.ok(html.includes('Tipo identificado no título:'));
 assert.ok(html.includes('data-classification="derived"'));assert.ok(html.includes('/metodologia#tipo-derivado'));
 assert.ok(html.includes('Construção de Biblioteca da Informação'));
 const methodology=await (await fetch(`${base}/metodologia`)).text();assert.ok(methodology.includes('sem avaliação externa independente'));assert.ok(methodology.includes('120 correspondências'));
});
