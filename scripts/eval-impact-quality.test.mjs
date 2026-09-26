import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {impactQuality} from '../lib/impact-quality.mjs';
import quality from '../lib/impact-quality.json' with {type:'json'};
import manifest from '../lib/national-manifest.json' with {type:'json'};
void test('quality distinguishes missing, zero, invalid and unusually large counts',()=>{
 for(const x of [null,undefined])assert.equal(impactQuality(x,3000),'missing');
 for(const x of [-1,1.5,NaN,Infinity,'20'])assert.equal(impactQuality(x,3000),'invalid');
 for(const x of [0,20,3000])assert.equal(impactQuality(x,3000),'unverified');
 assert.equal(impactQuality(3001,3000),'outlier');
 assert.equal(impactQuality(1213647762,quality.fields.beneficiaries.threshold),'outlier');
});
void test('thresholds match the complete preserved source and cannot imply verified accuracy',()=>{
 assert.equal(quality.sourceLoad,manifest.sourceLoad);
 const values={beneficiaries:[],jobs:[]};
 for(const bucket of manifest.buckets)for(const row of Object.values(JSON.parse(fs.readFileSync(`source-data/context/${bucket}.json`)))){
  for(const key of Object.keys(values))if(Number.isSafeInteger(row[key])&&row[key]>0)values[key].push(row[key]);
 }
 for(const [key,list] of Object.entries(values)){
  const q=quality.fields[key];list.sort((a,b)=>a-b);
  assert.equal(q.positiveRecords,list.length);
  assert.equal(q.threshold,list[Math.ceil(list.length*0.995)-1]);
  assert.equal(q.flagged,list.filter(x=>x>q.threshold).length);
  assert.ok(list.every(x=>impactQuality(x,q.threshold)!=='verified'));
 }
});
